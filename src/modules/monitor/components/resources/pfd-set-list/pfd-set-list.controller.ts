import convertToBoolean from 'opdev-front/src/components/convert-to-boolean';

import './pfd-set-list.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

export class ResourcePfdSetListController extends AbstractResourcePage<qos.resources.ISet> {

  groupId: string;
  group: qos.resources.IGroup;
  groups: qos.resources.IGroup[];

  groupPromise: angular.IHttpPromise<any>;
  metricPromises: angular.IHttpPromise<any>[] = [];

  /* @ngInject */
  constructor(
    protected $rootScope: angular.IRootScopeService,
    protected $q: angular.IQService,
    protected $filter: angular.IFilterService,
    protected qnModal: base.ui.IQnModalService,

    protected unitConvertUtil: base.IUnitCovertUtil,
    protected echartsUtil: echarts.IEchartsUtilService,
    protected $echarts: echarts.IEchartService,
    protected $interval: angular.IIntervalService,
    protected $scope: angular.IScope,
    protected $translate: angular.translate.ITranslateService,
    protected $state: angular.ui.IStateService,
    protected httpHelper: base.IHttpHelper) {

    super({
      httpHelper,
      unitConvertUtil,
      echartsUtil,
      $echarts,
      $interval,
      $scope,
      $translate,
      $rootScope,
      $q,
      $state
    }, {
      isAutoReload: true,
      isGlobalCache: true
    });
    this.groupId = (this.$state.params as any).id;
    this.loadGroups();
  }

  doLoad(tab) {
    let ret = this.$q.resolve();
    if (tab === 'PERFORMANCE') {
      return this.groupPromise.then(() => {
        let metricPromises = [];
        for (let i = 0; i < this.group.hosts.length; i++) {
          let host = this.group.hosts[i][0];
          let promise = this.httpHelper.call<qos.resources.IPerformanceData>('GET', '/api/app/simple/pfd/metric', {
            host: host,
            start: this.startDate,
            end: this.endDate,
            size: 'large'
          }).$promise;
          metricPromises.push(promise);
        }
        return this.$q.all(metricPromises) as any;
      });
    } else if (tab === 'REAL_TIME_STATUS') {
      ret = this.httpHelper.call<qos.resources.ISet[]>('GET', '/api/app/pfd', {
        set: true,
        groupId: this.groupId
      }).$promise as any;
    }
    return ret;
  }

  afterLoad(tab, datas) {
    if (tab === 'PERFORMANCE') {
      let theDatas = {};
      for (let i = 0; i < this.group.hosts.length; i++) {
        // let host = this.group.hosts[i][0];
        let hostname = this.group.hostnames[i];
        theDatas[hostname] = datas[i];
      }
      this.buildHostPerformanceCharts(theDatas);
    } else if (tab === 'REAL_TIME_STATUS') {
    }
  }

  loadGroups() {
    this.$rootScope.loadResourceIdPromise = this.$q((
      resolve: angular.IQResolveReject<string>,
      reject: angular.IQResolveReject<string>) => {
      this.groupPromise = this.httpHelper.call<qos.resources.IGroup[]>('GET', '/api/app/pfd', {
        performance: 'disable',
        group: true
      }).$promise;
      this.groupPromise.success((data: qos.resources.IGroup[]) => {
        this.groups = data;
        this.groups.forEach( (element: any) => {
          if (element.id === this.groupId) {
            this.group = element;
            resolve(this.$filter<any>('pfdGroupHostsFilter')(this.group.hosts, true));
            return;
          }
        });
      });
    });
  }

  goGroup(group: qos.resources.IGroup) {
    this.$state.go('^.group', { id: group.id });
  }

  changeSetAccess(set: qos.resources.ISet, readOnly: boolean) {
    this.$translate(['CONFIRM', 'PROMT_SET_PFD_SET_ACCESS'], {
      status: readOnly ? 'RO' : 'RW',
      name: set.id
    }).then((res: any) => {
      this.qnModal.confirm(res.CONFIRM, res.PROMT_SET_PFD_SET_ACCESS, undefined, 'sm').then(() => {
        this.httpHelper.call<qos.resources.ISet[]>('POST', `/api/app/pfd?access=true`, {
          dgids: [set.id],
          readOnly
        }).$promise.error((data: qos.resources.ISet[]) => {
          set.readOnly = !readOnly;
        });
      }, () => {
        set.readOnly = !readOnly;
      });
    });
  }

  setBad(set: qos.resources.ISet, host: string) {
    this.openSetBadDialog(set, host);
  }

  syncDisk(set: qos.resources.ISet, host: string) {
    this.openSyncDialog(set, host);
  }

  openSyncDialog(set: qos.resources.ISet, host: string) {
    this.$translate(['CONFIRM', 'PROMT_SYNC_DISK']).then((res: any) => {
      this.qnModal.confirm(res.CONFIRM, res.PROMT_SYNC_DISK, undefined, 'sm').then(() => {
        this.httpHelper.call<qos.resources.ISet[]>('POST', `/api/app/pfd?repair=true`, {
          dgid: set.id,
          host
        }).$promise.success((data: qos.resources.ISet[]) => {
          this.loadData(false);
        });
      });
    });
  }

  openSetBadDialog(set: qos.resources.ISet, host: string) {
    this.$translate(['CONFIRM', 'PROMT_SET_BAD_DISK']).then((res: any) => {
      this.qnModal.confirm(res.CONFIRM, res.PROMT_SET_BAD_DISK, 'danger', 'sm').then(() => {
        this.httpHelper.call<qos.resources.ISet[]>('POST', `/api/app/pfd?setbroken=true`, {
          dgid: set.id,
          host
        }).$promise.success((data: qos.resources.ISet[]) => {
          this.loadData();
        });
      });
    });
  }

  static getDepns() {
    return [convertToBoolean];
  }
}


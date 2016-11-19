import './pfd-list.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

function cacheKeyGenerator($state) {
  return $state.href($state.current.name, { realtime: ($state.params as any).realtime, onlybroken: undefined, page: undefined});
}

export class ResourcePfdListController extends AbstractResourcePage<qos.resources.IGroup> {

  hideRealtimeData: boolean;
  hasBrokenDisks: boolean;

  itemsPerPage: number = 10;
  page: number = 1;
  pageData: qos.resources.IGroup[];
  totalData: qos.resources.IGroup[];

  searchKey: string;

  /* @ngInject */
  constructor(
    protected $q: angular.IQService,
    protected $rootScope: angular.IRootScopeService,
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
      isAutoReload: false,
      isGlobalCache: true,
      cacheKeyGenerator
    });

    this.hideRealtimeData = false;
    let realtime = ($state.params as any).realtime;
    if (realtime === 'false') {
      this.hideRealtimeData = true;
    }
    let onlybroken = ($state.params as any).onlybroken;
    if (onlybroken === 'true') {
      this.hasBrokenDisks = true;
    }
    let page = parseInt(($state.params as any).page, 10);
    this.page = isNaN(page) ? 1 : page;
  }

  doLoad(tab) {
    let ret = this.$q.resolve();
    if (tab === 'PERFORMANCE') {
      ret = this.httpHelper.call<qos.resources.IPerformanceData>('GET', '/api/app/simple/pfd/metric', {
        total: true,
        start: this.startDate,
        end: this.endDate,
        size: 'large'
      }).$promise as any;
    } else if (tab === 'REAL_TIME_STATUS') {
      ret = this.httpHelper.call<qos.resources.IGroup[]>('GET', '/api/app/pfd', {
        performance: this.hideRealtimeData ? 'disable' : undefined,
        group: true
      }).$promise as any;
    }
    return ret;
  }

  afterLoad(tab, data) {
    if (tab === 'PERFORMANCE') {
      this.buildPerformanceCharts(data);
    } else if (tab === 'REAL_TIME_STATUS') {
      if (this.hasBrokenDisks) {
        this.totalData = this.realtimeTab.data.filter(item => item.repair > 0);
      } else {
        this.totalData = this.realtimeTab.data;
      }

      let start = (this.page - 1) * this.itemsPerPage;
      let end = start + this.itemsPerPage;
      this.pageData = this.totalData.slice(start, end);
    }
  }

  searchChange() {
    if (this.searchKey === undefined || this.searchKey === '') {
      this.loadData();
      return;
    }

    this.realtimeTab.loaded = false;
    this.doSearchContent().then(data => {
      this.pageData = data;
      this.realtimeTab.loaded = true;
    });
  }

  doSearchContent() {
    return this.$q<qos.resources.IGroup[]>((resolve, reject) => {
      setTimeout(() => {
        let res = this.totalData.filter(data => {
          for (let i = 0; i < data.hostnames.length; i++) {
            if (data.hostnames[i] && (data.hostnames[i].indexOf(this.searchKey) >= 0)) {
              return true;
            }
            if (data.hosts[i] && data.hosts[i][0] && (data.hosts[i][0].indexOf(this.searchKey) >= 0)) {
              return true;
            }
          }
          return false;
        });
        resolve(res);
      }, 200);
    });
  }

  refreshState() {
    console.log(this.page);
    this.$state.go('^.main', {
      realtime: this.hideRealtimeData ? 'false' : 'true',
      onlybroken: this.hasBrokenDisks ? 'true' : 'false',
      page: this.page
    });
  }

  refresh() {
    this.searchKey = '';
    this.onUpdate();
  }

  gotoGroup(group: qos.resources.IGroup) {
    this.$state.go('^.group', { id: group.id });
  }
}

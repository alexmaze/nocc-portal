import './common-resource-list.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

export class CommonResourceListController extends AbstractResourcePage<qos.resources.IInstance> {

  resourceType: string;

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
      isAutoReload: true,
      isGlobalCache: true
    });
    let states = this.$state.current.name.split('.');
    this.resourceType = states[states.length - 2];
  }

  doLoad(tab) {
    let ret = this.$q.resolve();
    if (tab === 'PERFORMANCE') {
      ret = this.httpHelper.call<qos.resources.IPerformanceData>('GET', '/api/app/simple/:type/metric', {
        type: this.resourceType,
        total: true,
        start: this.startDate,
        end: this.endDate,
        size: 'large'
      }).$promise as any;
    } else if (tab === 'REAL_TIME_STATUS') {
      ret = this.httpHelper.call<qos.resources.IInstance[]>('GET', '/api/app/simple/:type', {
        type: this.resourceType
      }).$promise as any;
    }
    return ret;
  }

  afterLoad(tab, data) {
    if (tab === 'PERFORMANCE') {
      this.buildPerformanceCharts(data as any);
    } else if (tab === 'REAL_TIME_STATUS') {
    }
  }

  gotoInstance(instance: qos.resources.IInstance) {
    this.$state.go('^.instance', { instance: instance.instance, type: this.resourceType, host: instance.host });
  }
}

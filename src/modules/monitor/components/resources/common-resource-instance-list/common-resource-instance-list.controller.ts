import './common-resource-instance-list.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

export class CommonResourceInstanceListController extends AbstractResourcePage<any> {

  resourceType: string;
  instance: qos.resources.IInstance = {};

  /* @ngInject */
  constructor(
    protected $rootScope: angular.IRootScopeService,
    protected $q: angular.IQService,

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
      isGlobalCache: true
    });

    this.loadInstance();
  }

  doLoad(tab) {
    let ret = this.$q.resolve();
    if (tab === 'PERFORMANCE') {
      ret = this.httpHelper.call<qos.resources.IPerformanceData>('GET', '/api/app/simple/:type/metric', {
        type: this.resourceType,
        host: this.instance.host,
        start: this.startDate,
        end: this.endDate,
        size: 'large'
      }).$promise as any;
    }
    return ret;
  }

  afterLoad(tab, data) {
    if (tab === 'PERFORMANCE') {
      this.buildPerformanceCharts(data as any);
    }
  }

  loadInstance() {
    this.instance.host = (this.$state.params as any).host;
    this.instance.instance = (this.$state.params as any).instance;
    let states = this.$state.current.name.split('.');
    this.resourceType = states[states.length - 2];

    this.$rootScope.loadResourceIdPromise = this.$q((
      resolve: angular.IQResolveReject<string>,
      reject: angular.IQResolveReject<string>) => {
      resolve(this.instance.instance);
    });
  }

  bindTabs() {
    super.bindTabs('PERFORMANCE');
  }

}

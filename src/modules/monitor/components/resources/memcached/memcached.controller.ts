import './memcached.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

interface IMemcachedInstance {
  host: string;
  status: string;
  usedMemory: number;
  limitMemory: number;
}

export class ResourceMemcachedController extends AbstractResourcePage<IMemcachedInstance> {

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
    });  }

  doLoad(tab) {
    return this.httpHelper.call<IMemcachedInstance[]>('GET', '/api/app/memcached').$promise;
  }

  afterLoad(tab, data) {}

  gotoInstance(instance: IMemcachedInstance) {
    this.$state.go('^.instance', { host: instance.host });
  }
}

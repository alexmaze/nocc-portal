import './mongo.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

interface IMongoInstance {
  host: string;
  status: string;
  role: string;
}

export class ResourceMongoController extends AbstractResourcePage<IMongoInstance> {

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
    return this.httpHelper.call<IMongoInstance[]>('GET', '/api/app/mongo').$promise;
  }

  afterLoad(tab, data) {}

  gotoInstance(instance: IMongoInstance) {
    this.$state.go('^.instance', { host: instance.host });
  }
}

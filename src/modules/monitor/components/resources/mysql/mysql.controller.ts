import './mysql.less';
import { AbstractResourcePage } from '../../../common/new-abstract-resource-page.controller';

interface IMysqlInstance {
  host: string;
  status: string;
  role: string;
}

export class ResourceMysqlController extends AbstractResourcePage<IMysqlInstance> {

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
  }

  doLoad(tab) {
    return this.httpHelper.call<IMysqlInstance[]>('GET', '/api/app/mysql').$promise;
  }

  afterLoad(tab, data) {}

  gotoInstance(instance: IMysqlInstance) {
    this.$state.go('^.instance', { host: instance.host });
  }
}

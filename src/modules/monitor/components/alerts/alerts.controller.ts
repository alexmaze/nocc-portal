import { assign } from 'lodash';
import './alerts.less';

export class AlertsController  {

  loaded: boolean;
  config: qos.IGlobalConfig;
  newConfig: qos.IGlobalConfig;

  /* @ngInject */
  constructor(
    private ApiGlobalConfig: qos.api.IGlobalConfigService,
    private httpHelper: base.IHttpHelper,
    private $scope: angular.IScope) {
    this.loadData();
  }

  loadData() {
    this.loaded = false;
    this.ApiGlobalConfig.get(true).then(conf => {
      this.loaded = true;
      this.config = conf;
      this.newConfig = assign({}, conf);
    });
  }

  update() {
    this.loaded = false;
    this.ApiGlobalConfig.patch(this.newConfig).then(conf => {
      this.loaded = true;
      this.config = conf;
      this.newConfig = assign({}, this.config);
    });
  }

  reset() {
    this.newConfig = assign({}, this.config);
    (this as any).configForm.$setPristine();
  }

}

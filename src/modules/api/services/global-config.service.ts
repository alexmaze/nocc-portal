/**
 * Global Config Api Service
 *
 * @export
 * @class ApiGlobalConfig
 */
export class ApiGlobalConfig {

  promise: angular.IPromise<qos.IGlobalConfig>;

  /* @ngInject */
  constructor(private httpHelper: base.IHttpHelper) {
  }

  /**
   * 获取 Global Config
   *
   * @param {boolean} force 强制刷新
   * @returns {angular.IPromise<qos.IGlobalConfig>}
   *
   * @memberOf ApiGlobalConfig
   */
  get(force: boolean = false): angular.IPromise<qos.IGlobalConfig> {
    if (force || this.promise === undefined) {
      this.promise = this.httpHelper.call<qos.IGlobalConfig>('GET', '/api/global_config').$promise;
    }
    return this.promise;
  }

  /**
   * 修改 Global Config
   *
   * @param {qos.IGlobalConfig} config 必须带上所有字段
   * @returns {angular.IPromise<qos.IGlobalConfig>}
   *
   * @memberOf ApiGlobalConfig
   */
  patch(config: qos.IGlobalConfig): angular.IPromise<qos.IGlobalConfig> {
    this.promise = this.httpHelper.call<qos.IGlobalConfig>('PATCH', '/api/global_config', config).$promise;
    return this.promise;
  }
}

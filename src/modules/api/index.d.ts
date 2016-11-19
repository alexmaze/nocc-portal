declare namespace qos.api {
  interface IGlobalConfigService {
    get(force?: boolean): angular.IPromise<qos.IGlobalConfig>;
    patch(config: qos.IGlobalConfig): angular.IPromise<qos.IGlobalConfig>;
  }
}

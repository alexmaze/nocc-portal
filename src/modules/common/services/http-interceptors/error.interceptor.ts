export class ErrorInterceptor {

  constructor(private $rootScope: angular.IRootScopeService,
              private $q: angular.IQService,
              private $window: angular.IWindowService,
              private toaster: { error: (msg: any) => void }) {
  }

  responseError = (rejection: any) => {
    // debugger;
    try {
      if (rejection.status === 401) {
        this.$rootScope.$emit('no_session', rejection);
        return this.$q.reject(rejection);
      }
      this.toaster.error(`${rejection.status}: ${rejection.statusText} ${rejection.data.code}`);
      return this.$q.reject(rejection);
    } catch (err) {
      this.toaster.error('Unexpected Error, Please check API.');
      this.$q.reject(err);
    }
  };

  /** @ngInject */
  static Factory($rootScope: angular.IRootScopeService,
                 $q: angular.IQService,
                 $window: angular.IWindowService,
                 toaster: { error: () => void }) {
    return new ErrorInterceptor($rootScope, $q, $window, toaster);
  }

}



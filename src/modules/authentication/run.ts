/** @ngInject */
export function runBlock(
  $state: angular.ui.IStateService,
  $window: angular.IWindowService,
  userService: qos.service.IUserService,
  systemConfigService: qos.service.ISystemConfigService,
  urlSafeBase64Util: any,
  $rootScope: angular.IRootScopeService) {

  $rootScope.$on('no_session', (event: any, rejection: any) => {
    userService.clearUserInfo();
    if ($state.current.name !== 'signin') {
      let url = urlSafeBase64Util.encode($window.location.href);
      $window.location.href = $state.href('signin', { redirect: url });
    }
  });

  $rootScope.$on('$stateChangeStart', (
    event: ng.IAngularEvent,
    toState: angular.ui.IState,
    toParams: angular.ui.IStateOptions) => {
      if (toState.name !== 'signin') {
        let userInfo = userService.userInfo();
        if (!userInfo) {
          event.preventDefault();
          $state.go('signin');
        }
      }
  });

  systemConfigService.fetch();
  userService.checkSessionSync();
}

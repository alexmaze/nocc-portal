/** @ngInject */
export default function run(
  $window: angular.IWindowService,
  $timeout: angular.ITimeoutService,
  $state: angular.ui.IStateService,
  $rootScope: angular.IRootScopeService) {

  // toaster config options
  $rootScope.toasterOptions = {
    'limit': 1,
    'position-class': 'toast-top-full-width',
    'close-button': true,
    'time-out': 5000
  };

  $rootScope.$on('#GLOBAL/LANGUAGE_CHANGED', () => {
    $state.reload();
  });
}

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

  ($rootScope as any).tinymceOptions = {
    theme: 'modern',
    plugins : 'textcolor colorpicker',
    skin: 'light',
    visual: true,
    keep_values: false,
    // forced_root_block: "div",
    toolbar: 'styleselect | bold italic | forecolor backcolor | bullist numlist | alignleft aligncenter alignright alignjustify',
    menubar : false,
    statusbar : false
};

  $rootScope.$on('#GLOBAL/LANGUAGE_CHANGED', () => {
    $state.reload();
  });
}

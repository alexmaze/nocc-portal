
/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.change_password', {
      url: 'changepw',
      template: require('./components/change-password/change-password.html'),
      controller: 'ChangePasswordController as ctrl',
      data: {
        icon: 'fa-key',
        title: 'CHANGE_PASSWORD'
      }
    })
    .state('main.about', {
      url: 'about',
      template: require('./components/about/about.html'),
      data: {
        icon: 'fa-info',
        title: 'ABOUT_SYSTEM'
      }
    });
}

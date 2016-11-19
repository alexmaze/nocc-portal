/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('signin', {
      url: '/signin?redirect',
      template: require('./components/signin/signin.html'),
      controller: 'SigninController',
      controllerAs: 'ctrl'
    });
}

/** @ngInject */
export default function routerConfig(
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider,
  $locationProvider: angular.ILocationProvider,
  $uiViewScrollProvider: angular.ui.IUiViewScrollProvider) {

  $urlRouterProvider.otherwise('/');
  $uiViewScrollProvider.useAnchorScroll();
  $locationProvider.html5Mode({
    enabled: true
  });

  $stateProvider
    .state('main', {
      url: '/',
      template: require('./components/main/main.html'),
      controller: 'MainController',
      controllerAs: 'ctrl',
      redirectTo: 'signin'
    });
}

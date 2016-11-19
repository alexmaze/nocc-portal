/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.dashboard', {
      url: 'dashboard',
      template: require('./components/dashboard/dashboard.html'),
      controller: 'DashboardController as ctrl',
      data: {
        icon: 'fa-dashboard',
        title: 'DASHBOARD'
      }
    })
    .state('main.keys', {
      url: 'keys',
      template: require('../namespace/components/keys/keys.html'),
      controller: 'KeysController as ctrl',
      data: {
        icon: 'fa-key',
        title: 'KEYS'
      }
    })
    .state('main.buckets', {
      url: 'buckets',
      template: '<div class="buckets" ui-view></div>',
      redirectTo: 'main.buckets.main'
    })
    .state('main.buckets.main', {
      url: '/',
      template: require('../namespace/components/buckets/buckets.html'),
      controller: 'BucketsController as ctrl',
      data: {
        icon: 'fa-codepen',
        title: 'BUCKETS'
      }
    })
    ;
}

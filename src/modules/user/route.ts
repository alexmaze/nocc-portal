/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.user', {
      url: 'user',
      template: '<div class="user" ui-view></div>',
      redirectTo: 'main.user.main'
    })
    .state('main.user.main', {
      url: '/',
      template: require('./components/user-list/user-list.html'),
      controller: 'UserListController as ctrl',
      data: {
        icon: 'fa-user',
        title: 'USER'
      }
    });
}

/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.event', {
      url: 'event',
      template: '<div class="event" ui-view></div>',
      redirectTo: 'main.event.main'
    })
    .state('main.event.main', {
      url: '/',
      template: require('./components/event-list/event-list.html'),
      controller: 'EventListController as ctrl',
      data: {
        icon: 'fa-newspaper-o',
        title: '事件'
      }
    })
    .state('main.event.detail', {
      url: '/detail?id',
      template: require('./components/event-detail/event-detail.html'),
      controller: 'EventDetailController as ctrl',
      data: {
        icon: 'fa-newspaper-o',
        title: '编辑',
        parents: ['^.main']
      }
    })
    .state('main.event.create', {
      url: '/create',
      template: require('./components/event-detail/event-detail.html'),
      controller: 'EventDetailController as ctrl',
      data: {
        icon: 'fa-newspaper-o',
        title: '新建',
        parents: ['^.main']
      }
    })
    ;
}

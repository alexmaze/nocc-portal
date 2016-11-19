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
    // .state('main.event.detail', {
    //   url: '/',
    //   template: require('./components/event-detail/event-detail.html'),
    //   controller: 'EventDetailController as ctrl',
    //   data: {
    //     icon: 'fa-newspaper-o',
    //     title: 'Events'
    //   }
    // })
    ;
}

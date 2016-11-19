/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.namespace', {
      url: 'namespace',
      template: '<div class="namespace" ui-view></div>',
      redirectTo: 'main.namespace.main'
    })
    .state('main.namespace.main', {
      url: '/',
      template: require('./components/namespace/namespace.html'),
      controller: 'NamespaceController as ctrl',
      data: {
        icon: 'fa-folder-open',
        title: 'NAMESPACE'
      }
    })
    .state('main.namespace.keys', {
      url: '/:ns/keys',
      template: require('./components/keys/keys.html'),
      controller: 'KeysController as ctrl',
      data: {
        icon: 'fa-key',
        title: 'KEYS',
        parents: ['^.main']
      }
    })
    .state('main.namespace.buckets', {
      url: '/:ns/buckets',
      template: '<div class="buckets" ui-view></div>',
      redirectTo: 'main.namespace.buckets.main'
    })
    .state('main.namespace.buckets.main', {
      url: '/',
      template: require('./components/buckets/buckets.html'),
      controller: 'BucketsController as ctrl',
      data: {
        icon: 'fa-codepen',
        title: 'BUCKETS',
        parents: ['^.^.main']
      }
    })
    .state('main.namespace.buckets.domain', {
      url: '/:bk/domain',
      template: require('./components/bucket-domain/bucket-domain.html'),
      controller: 'BucketDomainController as ctrl',
      data: {
        icon: 'fa-at',
        title: 'DOMAIN_MANAGEMENT',
        parents: ['^.^.main', '^.main']
      }
    })
    .state('main.namespace.buckets.history', {
      url: '/:bk/history',
      template: require('./components/bucket-history/bucket-history.html'),
      controller: 'BucketHistoryController as ctrl',
      data: {
        icon: 'fa-at',
        title: 'HISTORY_USAGE',
        parents: ['^.^.main', '^.main']
      }
    });
}

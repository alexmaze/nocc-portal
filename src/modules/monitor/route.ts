
/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  const base = 'main.monitor';

  $stateProvider
    .state(`${base}`, {
      url: 'monitor',
      template: '<div class="monitor" ui-view></div>',
      redirectTo: `${base}.capacity`
    })
    .state(`${base}.capacity`, {
      url: '/capacity',
      template: require('./components/capacity/capacity.html'),
      controller: 'MonitorCapacityController as ctrl',
      data: {
        icon: 'fa-pie-chart',
        title: 'MONITOR_CAPACITY'
      }
    })
    .state(`${base}.servers`, {
      url: '/servers',
      template: '<div ui-view></div>',
      redirectTo: `${base}.servers.main`
    })
    .state(`${base}.servers.main`, {
      url: '',
      template: require('./components/server-list/server-list.html'),
      controller: 'ServerListController',
      controllerAs: 'ctrl',
      data: {
        icon: 'fa-server',
        title: 'MONITOR_SERVER'
      }
    })
    .state(`${base}.servers.detail`, {
      url: '/:id',
      template: require('./components/server-detail/server-detail.html'),
      controller: 'ServerDetailController',
      controllerAs: 'ctrl',
      data: {
        icon: 'fa-list-alt',
        title: 'SERVER_DETAIL',
        parents: ['^.main']
      }
    })
    .state(`${base}.events`, {
      url: '/events',
      template: require('./components/event-list/event-list.html'),
      controller: 'EventListController',
      controllerAs: 'ctrl',
      data: {
        icon: 'fa-bell-o',
        title: 'EVENTS'
      }
    })
    .state(`${base}.alerts`, {
      url: '/alerts',
      template: require('./components/alerts/alerts.html'),
      controller: 'AlertsController',
      controllerAs: 'ctrl',
      data: {
        icon: 'fa-exclamation-triangle',
        title: 'ALERTS'
      }
    })
    .state(`${base}.statistics`, {
      url: '/statistics',
      template: require('./components/statistics/statistics.html'),
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      data: {
        icon: 'fa-bar-chart',
        title: 'STATISTICS'
      }
    })
    .state(`${base}.resources`, {
      url: '/resources',
      template: '<div class="monitor-resources" ui-view></div>',
      redirectTo: `${base}.resources.pfd`
    })
    .state(`${base}.resources.pfd`, {
      url: '/pfd',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.pfd.main`
    })
    .state(`${base}.resources.pfd.main`, {
      url: '/?realtime&onlybroken&page',
      template: require('./components/resources/pfd-list/pfd-list.html'),
      controller: 'ResourcePfdListController as ctrl',
      data: {
        icon: 'fa-object-group',
        title: 'MONITOR_PFD'
      }
    })
    .state(`${base}.resources.pfd.group`, {
      url: '/group/:id',
      template: require('./components/resources/pfd-set-list/pfd-set-list.html'),
      controller: 'ResourcePfdSetListController as ctrl',
      data: {
        icon: 'fa-hdd-o',
        title: 'GROUP_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.rs`, {
      url: '/rs',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.rs.main`
    })
    .state(`${base}.resources.rs.main`, {
      url: '/',
      template: require('./components/resources/common-resource-list/common-resource-list.html'),
      controller: 'CommonResourceListController as ctrl',
      data: {
        icon: 'fa-circle-o',
        title: 'MONITOR_RS'
      }
    })
    .state(`${base}.resources.rs.instance`, {
      url: '/instance/:instance?host',
      template: require('./components/resources/common-resource-instance-list/common-resource-instance-list.html'),
      controller: 'CommonResourceInstanceListController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.io`, {
      url: '/io',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.io.main`
    })
    .state(`${base}.resources.io.main`, {
      url: '/',
      template: require('./components/resources/common-resource-list/common-resource-list.html'),
      controller: 'CommonResourceListController as ctrl',
      data: {
        icon: 'fa-cloud-download',
        title: 'MONITOR_IO'
      }
    })
    .state(`${base}.resources.io.instance`, {
      url: '/instance/:instance?host',
      template: require('./components/resources/common-resource-instance-list/common-resource-instance-list.html'),
      controller: 'CommonResourceInstanceListController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.up`, {
      url: '/up',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.up.main`
    })
    .state(`${base}.resources.up.main`, {
      url: '/',
      template: require('./components/resources/common-resource-list/common-resource-list.html'),
      controller: 'CommonResourceListController as ctrl',
      data: {
        icon: 'fa-cloud-upload',
        title: 'MONITOR_UP'
      }
    })
    .state(`${base}.resources.up.instance`, {
      url: '/instance/:instance?host',
      template: require('./components/resources/common-resource-instance-list/common-resource-instance-list.html'),
      controller: 'CommonResourceInstanceListController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.ebd`, {
      url: '/ebd',
      template: require('./components/resources/ebd/ebd.html'),
      controller: 'ResourceEBDController as ctrl',
      data: {
        icon: 'fa-cubes',
        title: 'EBD_GROUP'
      }
    })
    .state(`${base}.resources.memcached`, {
      url: '/memcached',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.memcached.main`
    })
    .state(`${base}.resources.memcached.main`, {
      url: '/',
      template: require('./components/resources/memcached/memcached.html'),
      controller: 'ResourceMemcachedController as ctrl',
      data: {
        icon: 'fa-database',
        title: 'MONITOR_MEMCACHED'
      }
    })
    .state(`${base}.resources.memcached.instance`, {
      url: '/instance?host',
      template: require('./components/resources/mongo-mysql-memcached-instance/common.html'),
      controller: 'ResourceMMMInstanceController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.mysql`, {
      url: '/mysql',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.mysql.main`
    })
    .state(`${base}.resources.mysql.main`, {
      url: '/',
      template: require('./components/resources/mysql/mysql.html'),
      controller: 'ResourceMysqlController as ctrl',
      data: {
        icon: 'fa-database',
        title: 'MONITOR_MYSQL'
      }
    })
    .state(`${base}.resources.mysql.instance`, {
      url: '/instance?host',
      template: require('./components/resources/mongo-mysql-memcached-instance/common.html'),
      controller: 'ResourceMMMInstanceController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    })
    .state(`${base}.resources.mongo`, {
      url: '/mongo',
      template: '<div ui-view></div>',
      redirectTo: `${base}.resources.mongo.main`
    })
    .state(`${base}.resources.mongo.main`, {
      url: '/',
      template: require('./components/resources/mongo/mongo.html'),
      controller: 'ResourceMongoController as ctrl',
      data: {
        icon: 'fa-database',
        title: 'MONITOR_MONGO'
      }
    })
    .state(`${base}.resources.mongo.instance`, {
      url: '/instance?host',
      template: require('./components/resources/mongo-mysql-memcached-instance/common.html'),
      controller: 'ResourceMMMInstanceController as ctrl',
      data: {
        icon: 'fa-gear',
        title: 'INSTANCE_INFO',
        parents: ['^.main']
      }
    });
}

import * as angular from 'angular';

const uiPagination = require('angular-ui-bootstrap/src/pagination');

import Register from 'opdev-front/src/utils/register';

import { routes } from './route';
import { MonitorCapacityController } from './components/capacity/capacity.controller';
import { ServerListController } from './components/server-list/server-list.controller';
import { ServerDetailController } from './components/server-detail/server-detail.controller';
import { EventListController } from './components/event-list/event-list.controller';
import { StatisticsController } from './components/statistics/statistics.controller';
import { AlertsController } from './components/alerts/alerts.controller';

import { ResourcePfdListController } from './components/resources/pfd-list/pfd-list.controller';
import { ResourcePfdSetListController } from './components/resources/pfd-set-list/pfd-set-list.controller';
import { CommonResourceListController } from './components/resources/common-resource-list/common-resource-list.controller';
import { CommonResourceInstanceListController } from './components/resources/common-resource-instance-list/common-resource-instance-list.controller';
import { ResourceEBDController } from './components/resources/ebd/ebd.controller';
import { ResourceMemcachedController } from './components/resources/memcached/memcached.controller';
import { ResourceMysqlController } from './components/resources/mysql/mysql.controller';
import { ResourceMongoController } from './components/resources/mongo/mongo.controller';
import { ResourceMMMInstanceController } from './components/resources/mongo-mysql-memcached-instance/common.controller';

import { hostFilter, hostStatisticsFilter, pfdGroupHostsFilter } from './components/resources/filters/hosts-format.filter';
import { tableNumber } from './components/resources/filters/table-number.filter';

import { storageItem } from './components/capacity/storage-item/storage-item.directive';

let MODULE_NAME = 'evm.monitor';
(new Register(MODULE_NAME, [uiPagination]))
  .config(routes)
  .filter('tableNumber', tableNumber)
  .filter('hostFilter', hostFilter)
  .filter('hostStatisticsFilter', hostStatisticsFilter)
  .filter('pfdGroupHostsFilter', pfdGroupHostsFilter)
  .directive('storageItem', storageItem)
  .controller('MonitorCapacityController', MonitorCapacityController)
  .controller('ServerListController', ServerListController)
  .controller('ServerDetailController', ServerDetailController)
  .controller('EventListController', EventListController)
  .controller('StatisticsController', StatisticsController)
  .controller('AlertsController', AlertsController)
  .controller('ResourcePfdListController', ResourcePfdListController)
  .controller('ResourcePfdSetListController', ResourcePfdSetListController)
  .controller('CommonResourceListController', CommonResourceListController)
  .controller('CommonResourceInstanceListController', CommonResourceInstanceListController)
  .controller('ResourceEBDController', ResourceEBDController)
  .controller('ResourceMemcachedController', ResourceMemcachedController)
  .controller('ResourceMysqlController', ResourceMysqlController)
  .controller('ResourceMongoController', ResourceMongoController)
  .controller('ResourceMMMInstanceController', ResourceMMMInstanceController)
  .build(angular);

export default MODULE_NAME;

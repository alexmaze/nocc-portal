import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { EventListController } from './components/event-list/event-list.controller';
import { EventDetailController } from './components/event-detail/event-detail.controller';

let MODULE_NAME = 'evm.event';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('EventListController', EventListController)
  .controller('EventDetailController', EventDetailController)
  .build(angular);

export default MODULE_NAME;

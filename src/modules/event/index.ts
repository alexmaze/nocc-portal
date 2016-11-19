import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { EventListController } from './components/event-list/event-list.controller';

let MODULE_NAME = 'evm.event';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('EventListController', EventListController)
  .build(angular);

export default MODULE_NAME;

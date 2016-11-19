import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { DashboardController } from './components/dashboard/dashboard.controller';

let MODULE_NAME = 'evm.namespace-admin';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('DashboardController', DashboardController)
  .build(angular);

export default MODULE_NAME;

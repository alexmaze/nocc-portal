import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { ShowcaseController } from './components/showcase/showcase.controller';

let MODULE_NAME = 'evm.other';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('ShowcaseController', ShowcaseController)
  .build(angular);

export default MODULE_NAME;

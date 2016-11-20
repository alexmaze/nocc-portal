import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

let MODULE_NAME = 'evm.other';
(new Register(MODULE_NAME, []))
  .config(routes)
  .build(angular);

export default MODULE_NAME;

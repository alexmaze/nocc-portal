import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';

import { routes } from './route';

import './components/about/about.less';
import { ChangePasswordController } from './components/change-password/change-password.controller';


let MODULE_NAME = 'evm.settings';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('ChangePasswordController', ChangePasswordController)
  .build(angular);

export default MODULE_NAME;

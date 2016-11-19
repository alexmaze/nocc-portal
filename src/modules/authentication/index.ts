import * as angular from 'angular';
import commonModule from '../common';

import { routes } from './route';
import { runBlock } from './run';

import { SigninController } from './components/signin/signin.controller';
import { UserService } from './services/user-service/user-service';
import { UserFeaturesService } from './services/user-features/user-features.service';

let MODULE_NAME = 'qos.authentication';
angular.module(MODULE_NAME, [commonModule])
  .config(routes)
  .run(runBlock)
  .service('userService', UserService)
  .service('userFeaturesService', UserFeaturesService)
  .controller('SigninController', SigninController);

export default MODULE_NAME;

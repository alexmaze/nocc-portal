import * as angular from 'angular';

import { ApiGlobalConfig } from './services/global-config.service';

let MODULE_NAME = 'qos.api';
angular.module(MODULE_NAME, [])
  .service('ApiGlobalConfig', ApiGlobalConfig);

export default MODULE_NAME;

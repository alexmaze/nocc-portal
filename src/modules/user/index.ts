import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { UserListController } from './components/user-list/user-list.controller';
import { userExplorer } from './components/user-explorer/user-explorer.component';
import { UserModalService } from './components/modals';

let MODULE_NAME = 'evm.user';
(new Register(MODULE_NAME, []))
  .config(routes)
  .component('userExplorer', userExplorer)
  .controller('UserListController', UserListController)
  .service('userModal', UserModalService)
  .build(angular);

export default MODULE_NAME;

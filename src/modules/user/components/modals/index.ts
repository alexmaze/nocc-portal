import './styles.less';

const uibModal = require('angular-ui-bootstrap/src/modal');

import { PasswordController } from './password/password.controller';
import { CreateController } from './create/create.controller';
import { EditController } from './edit/edit.controller';

export class UserModalService {

  /* @ngInject */
  constructor(
    private $rootScope: angular.IRootScopeService,
    private $uibModal: angular.ui.bootstrap.IModalService) {
  }

  changePassword(user: qos.user.IUser) {
    let scope: any = this.$rootScope.$new(true);
    scope.user = user;
    return this.openModal(scope, require('./password/password.html'), PasswordController).result;
  }

  create() {
    let scope: any = this.$rootScope.$new(true);
    return this.openModal(scope, require('./create/create.html'), CreateController).result;
  }

  edit(user: qos.user.IUser) {
    let scope: any = this.$rootScope.$new(true);
    scope.user = user;
    return this.openModal(scope, require('./edit/edit.html'), EditController).result;
  }

  openModal(scope: any, template: string, controller: any, size: base.ui.QnModalSize = 'md') {
    return this.$uibModal.open({
      template,
      scope,
      windowClass: 'modal-center',
      size,
      backdrop: false,
      keyboard: false,
      controller,
      controllerAs: 'ctrl'
    });
  };

  static getDepns() {
    return [uibModal];
  }
}

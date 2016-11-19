import { CommonCheckModalController } from './common-check-modal.controller';

/* @ngInject */
export class CommonCheckModalService {
  constructor(private $rootScope: any,
    private $uibModal: angular.ui.bootstrap.IModalService) {
  }

  build(data: qos.service.ICommonCheckModalData) {
    let scope = this.$rootScope.$new();
    scope.data = data;
    return this.$uibModal.open({
      template: require('./common-check-modal.html'),
      controller: CommonCheckModalController,
      controllerAs: 'ctrl',
      windowClass: 'modal-center',
      size: 'md',
      scope: scope,
      backdrop: false
    }).result;

  }
}

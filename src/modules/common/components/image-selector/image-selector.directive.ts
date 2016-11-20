import * as _ from 'lodash';
import './image-selector.less';

/* @ngInject */
export function imageSelector() {

  return {
    restrict: 'AE',
    template: require('./image-selector.html'),
    replace: true,
    scope: {
      items: '='
    },
    controller: ImageSelectorController,
    controllerAs: 'ctrl'
  };
}

class ImageSelectorController {

  items: qos.IImage[];

  /* @ngInject */
  constructor(
    private Upload: any,
    private $scope: any,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private $rootScope: angular.IRootScopeService) {
    this.items = $scope.items;
  }

  addOne() {
    this.items.push({} as any);
  }

  upload(item: qos.IImage) {
    console.log('upload', this.Upload);
    this.Upload.upload({
      url: '/api/file',
      data: item
    }).success(data => {
      item.url = '/upload/' + data.filename;
      console.log(data);
        // $scope.hide(data);
    });
  }

  descripton(item: qos.IImage) {
    let scope = this.$rootScope.$new() as any;
    scope.item = item;
    return this.$uibModal.open({
      template: require('./descripton.html'),
      windowClass: 'modal-center',
      size: 'md',
      scope: scope,
      backdrop: false
    }).result;
  }

  remove(item: qos.IImage) {
    // todo 删除文件
    _.pull(this.items, item);
  }
}

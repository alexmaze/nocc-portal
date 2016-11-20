import * as _ from 'lodash';
import './single-image-selector.less';

/* @ngInject */
export function singleImageSelector() {

  return {
    restrict: 'AE',
    template: require('./single-image-selector.html'),
    replace: true,
    scope: {
      url: '='
    },
    controller: ImageSelectorController,
    controllerAs: 'ctrl'
  };
}

class ImageSelectorController {

  file: any;

  /* @ngInject */
  constructor(
    private Upload: any,
    private $scope: any,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private $rootScope: angular.IRootScopeService) {
  }

  upload() {
    console.log('upload', this.Upload);
    this.Upload.upload({
      url: '/api/file',
      data: { file: this.file }
    }).success(data => {
      this.$scope.url = '/upload/' + data.filename;
      console.log(data);
        // $scope.hide(data);
    });
  }
}

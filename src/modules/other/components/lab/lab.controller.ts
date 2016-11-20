import './lab.less';
import * as _ from 'lodash';

export class LabController {

  circles = ['circle1', 'circle2', 'circle3', 'circle4'];
  data: qos.ILab;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper) {
    this.load();
  }

  load() {
    this.httpHelper.call<qos.ILab>('GET', '/api/lab').$promise.success(data => {
      this.data = data;
      if (!this.data.images) {
        this.data.images = [];
      }
    });
  }

  submit() {
    this.httpHelper.call<qos.ILab>('PATCH', '/api/lab', this.data).$promise.success(data => {
      this.load();
    });
  }
}

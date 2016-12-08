import './mission.less';
import * as _ from 'lodash';

export class MissionController {

  data: qos.IMission;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper) {
    this.load();
  }

  load() {
    this.httpHelper.call<qos.IMission>('GET', '/api/mission').$promise.success(data => {
      this.data = data;
      if (!this.data.images) {
        this.data.images = [];
      }
    });
  }

  submit() {
    this.httpHelper.call<qos.IMission>('POST', '/api/mission/patch', this.data).$promise.success(data => {
      this.load();
    });
  }
}

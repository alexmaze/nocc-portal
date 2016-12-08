import './showcase.less';
import * as _ from 'lodash';

export class ShowcaseController {

  data: qos.IShowcase;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper) {
    this.load();
  }

  load() {
    this.httpHelper.call<qos.IShowcase>('GET', '/api/showcase').$promise.success(data => {
      this.data = data;
      if (!this.data.images) {
        this.data.images = [];
      }
    });
  }

  submit() {
    this.httpHelper.call<qos.IShowcase>('POST', '/api/showcase/patch', this.data).$promise.success(data => {
      this.load();
    });
  }
}

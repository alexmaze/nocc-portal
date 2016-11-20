import './event-detail.less';
import * as _ from 'lodash';

export class EventDetailController {

  editId: string;
  event: qos.IEvent = {} as any;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper) {
    this.editId = (this.$state.params as any).id;
    if (this.editId) {
      this.load();
    }
  }

  load() {
    this.httpHelper.call<qos.IEvent>('GET', '/api/event/' + this.editId).$promise.success(data => {
      this.event = data;
    });
  }

  submit() {
  }
}

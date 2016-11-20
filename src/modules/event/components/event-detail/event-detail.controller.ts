import './event-detail.less';
import * as _ from 'lodash';

export class EventDetailController {

  editId: string;
  event: qos.IEvent = {
    poster: [],
    images: []
  } as any;

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
    if (this.event.poster) {
      this.event.poster.forEach(img => {
        (img as any).file = undefined;
      });
    }
    if (this.event.images) {
      this.event.images.forEach(img => {
        (img as any).file = undefined;
      });
    }

    this.httpHelper.call<qos.user.IUser>('POST', '/api/event', this.event).$promise.success(() => {
      this.$state.go('^.main');
    });

    console.log(this.event);
  }
}

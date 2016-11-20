import './event-list.less';
import * as _ from 'lodash';

export class EventListController {

  perpage = 10;

  searchKey: string;
  loaded: boolean;

  data: base.IPageData<qos.IEvent>;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService) {
    this.loadPage(1);
  }

  searchChange() {
  }

  create() {
    this.$state.go('main.event.create');
  }

  edit(event: qos.IEvent) {
    this.$state.go('main.event.detail', { id: event._id });
  }

  loadPage(page: number) {
    this.loaded = false;
    return this.httpHelper.call<base.IPageData<qos.IEvent>>('GET', '/api/event', {
      page: page,
      perpage: this.perpage
    }).$promise.success((data: base.IPageData<qos.IEvent>) => {
      this.loaded = true;
      this.data = data;
    });
  }

  delete(event: qos.IEvent) {
    this.qnModal.confirm('删除确认', '您确定要删除该事件吗？', 'danger', 'sm').then(() => {
      return this.httpHelper.call<void>('DELETE', '/api/event/:id', {
        id: event._id
      }).$promise.success(() => {
        _.pull(this.data.items, event);
        this.data.total--;
      });
    });
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }
}

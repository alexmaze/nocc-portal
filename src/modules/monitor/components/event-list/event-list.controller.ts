import './event-list.less';
import { AbstractAutoReloadPageController } from '../../common/abstract-auto-reload-page.controller';
import * as _ from 'lodash';

export class EventListController extends AbstractAutoReloadPageController {
  static DEFAULT_PER_PAGE = 15;
  loaded: boolean;
  data: base.IPageData<qos.events.IEvent>;

  page: number = 1;

  filters: any = [{
    text: 'ALL_EVENTS',
    value: undefined
  }, {
    text: 'CAPACITY',
    value: 'capacity'
  }, {
    text: 'SERVERS',
    value: 'server'
  }/*, {
    text: 'RESOURCES',
    value: 'resource'
  }*/];
  filter: any = this.filters[0];

  unsolved: boolean = false;
  active: boolean = false;

  /* @ngInject */
  constructor(
    protected $state: angular.ui.IStateService,
    protected $scope: angular.ui.IStateService,
    protected $interval: angular.IIntervalService,
    protected $translate: angular.translate.ITranslateService,
    protected qnModal: base.ui.IQnModalService,
    protected httpHelper: base.IHttpHelper) {
    super($interval, $scope);
    this.loadData(this.page);
  }

  loadData(page: number) {
    const locale = this.$translate.use();
    this.loaded = false;

    this.httpHelper.call<base.IPageData<qos.events.IEvent>>('GET', '/api/events', {
      locale,
      page: page,
      type: this.filter.value,
      unsolved: this.unsolved ? this.unsolved : undefined,
      active: this.active ? this.active : undefined,
      perpage: EventListController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.events.IEvent>) => {
      this.data = data;
      this.loaded = true;
    });
  }

  pageChanged() {
    // this.data.items = undefined;
    this.loadData(this.data.page);
  }

  goFilter(filter: { text: string; value: number }) {
    this.filter = filter;
    this.loadData(1);
  }

  autoLoad() {
    this.loadData(this.data.page);
  }

  ignore(event: qos.events.IEvent) {
    this.$translate(['CONFIRM', 'PROMT_IGNORE_EVENT']).then((res: any) => {
      this.qnModal.confirm(res.CONFIRM, res.PROMT_IGNORE_EVENT, undefined, 'sm')
        .then(() => {
          this.httpHelper.call<void>('PATCH', '/api/events/:id', {
             id: event.id,
             ignore: true
          }).$promise.success(() => {
            event.ignored = true;
          });
        });
    });
  }
}

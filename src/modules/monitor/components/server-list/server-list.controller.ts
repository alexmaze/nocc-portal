import './server-list.less';
import { AbstractAutoReloadPageController } from '../../common/abstract-auto-reload-page.controller';

export class ServerListController extends AbstractAutoReloadPageController {
  static DEFAULT_PER_PAGE = 10;
  loaded: boolean;
  data: base.IPageData<qos.server.IServer>;

  page: number = 1;

  filters: any = [{
    text: 'ALL_SERVERS',
    value: undefined
  }, {
    text: 'PROBLEM_SERVERS',
    value: 'error'
  }];
  filter: any = this.filters[0];
  searchKey: string;

  /* @ngInject */
  constructor(
    protected $state: angular.ui.IStateService,
    protected $scope: angular.IScope,
    protected $interval: angular.IIntervalService,
    protected httpHelper: base.IHttpHelper) {
    super($interval, $scope);
    this.loadData(this.page);
  }

  loadData(page: number) {
    this.loaded = false;
    this.httpHelper.call<base.IPageData<qos.server.IServer>>('GET', '/api/server', {
      page: page,
      detail: true,
      filter: this.filter.value,
      q: this.searchKey,
      perpage: ServerListController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.server.IServer>) => {
      this.data = data;
      this.loaded = true;
    });
  }

  pageChanged() {
    // this.data.items = undefined;
    this.loadData(this.data.page);
  }

  goDetail(server: qos.server.IServer) {
    this.$state.go('^.detail', server);
  }

  goFilter(filter: { text: string; value: number }) {
    this.filter = filter;
    this.loadData(1);
  }

  searchChange() {
    this.loadData(1);
  }

  autoLoad() {
    this.loadData(this.data.page);
  }
}

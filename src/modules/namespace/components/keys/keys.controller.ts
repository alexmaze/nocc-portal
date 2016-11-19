import './keys.less';

import * as _ from 'lodash';

export class KeysController {

  static DEFAULT_PER_PAGE = 10;

  data: base.IPageData<qos.key.IKey>;

  loaded: boolean;
  searchKey: string;

  namespaceId: string;
  namespaceName: string;

  systemConfig: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private httpHelper: base.IHttpHelper,
    private qnModal: base.ui.IQnModalService,
    private userService: qos.service.IUserService,
    private systemConfigService: qos.service.ISystemConfigService) {

    let params = $state.params as any;
    this.namespaceId = params.ns;
    if (this.namespaceId === undefined || this.namespaceId === null) {
      this.namespaceId = userService.userInfo().namespace;
    }
    if (this.namespaceId === undefined || this.namespaceId === null) {
      return;
    }

    this.systemConfig = systemConfigService.config;
    this.loadNamespace();
    this.loadPage(1);
  }

  loadNamespace() {
    this.httpHelper.call<qos.namespace.INamespace>('GET', '/api/namespace/:id', { id: this.namespaceId })
      .$promise.success((ns: qos.namespace.INamespace) => { this.namespaceName = ns.name; });
  }

  loadPage(page: number) {
    this.loaded = false;
    let simple = this.systemConfig.complexMode ? '' : 'simple/';
    this.httpHelper.call<base.IPageData<qos.key.IKey>>('GET', `/api/${simple}namespace/:id`, {
      id: this.namespaceId,
      keys: true,
      page: page,
      perpage: KeysController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.key.IKey>) => {
      this.data = data;
      this.loaded = true;
    });
  }

  refresh() {
    this.loadPage(1);
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }

  isOnlyOneActive() {
    let activeNum = 0;
    if (this.data.items) {
      this.data.items.forEach((key: qos.key.IKey) => {
        if (key.status === 'active') {
          activeNum++;
        }
      });
    } else {
      return false;
    }
    return (activeNum <= 1);
  }

  addKey() {
    if (this.data.items.length >= 2) { return; };
    this.$translate(['NEW', 'PROMT_ADD_KEY']).then((res: any) => {
      this.qnModal.confirm(res.NEW, res.PROMT_ADD_KEY, undefined, 'sm').then(() => {
        let simple = this.systemConfig.complexMode ? '' : 'simple/';
        this.httpHelper.call<qos.key.IKey>('PUT', `/api/${simple}namespace/:id/key`, {
          id: this.namespaceId
        }).$promise.success((key: qos.key.IKey) => {
          this.pageChanged();
        });
      });
    });
  }

  suspendKey(key: qos.key.IKey) {
    let simple = this.systemConfig.complexMode ? '' : 'simple/';
    this.httpHelper.call<qos.key.IKey>('PATCH', `/api/${simple}key/:id?suspend=true`, {
      id: key.id
    }).$promise.success((data: qos.key.IKey) => {
      key.status = data.status;
    });
  }

  resumeKey(key: qos.key.IKey) {
    let simple = this.systemConfig.complexMode ? '' : 'simple/';
    this.httpHelper.call<qos.key.IKey>('PATCH', `/api/${simple}key/:id?resume=true`, {
      id: key.id
    }).$promise.success((data: qos.key.IKey) => {
      key.status = data.status;
    });
  }

  deleteKey(key: qos.key.IKey) {
    this.$translate(['DELETE', 'PROMT_DELETE_KEY']).then((res: any) => {
      this.qnModal.confirm(res.DELETE, res.PROMT_DELETE_KEY, 'danger', 'sm').then(() => {
        let simple = this.systemConfig.complexMode ? '' : 'simple/';
        this.httpHelper.call<qos.key.IKey>('DELETE', `/api/${simple}key/:id`, {
          id: key.id
        }).$promise.success(() => {
          _.pull(this.data.items, key);
          this.data.total--;
        });
      });
    });
  }

}

import './namespace.less';
import * as _ from 'lodash';

import qnModal from 'opdev-front/src/components/qn-modal';

export class NamespaceController {

  loaded: boolean;
  data: base.IPageData<qos.namespace.INamespace>;
  itemsPerPage: number = 15;
  page: number = 1;
  pageData: qos.namespace.INamespace[];

  actions: qos.namespace.INamespaceActions;
  searchKey: string;

  systemConfig: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService,
    private qnModal: base.ui.IQnModalService,
    private commonCheckModalService: qos.service.ICommonCheckModalService,
    private $translate: angular.translate.ITranslateService,
    private systemConfigService: qos.service.ISystemConfigService) {

    this.loaded = false;
    this.systemConfig = systemConfigService.config;
    this.loadData();
    this.bindActions();
  }

  searchChange() {
    if (this.searchKey === undefined || this.searchKey === '') {
      this.loadData();
      return;
    }
    this.pageData = this.data.items.filter(data =>  (data.name.indexOf(this.searchKey) >= 0));
  }

  bindActions() {
    this.actions = {
      'buckets': (ns: qos.namespace.INamespace) => {
        this.$state.go('^.buckets.main', {'ns': ns.id});
      },
      'keys': (ns: qos.namespace.INamespace) => {
        this.$state.go('^.keys', {'ns': ns.id});
      },
      'history': (ns: qos.namespace.INamespace) => {
        this.$state.go('^.history', {'ns': ns.id});
      },
      'edit': (ns: qos.namespace.INamespace) => {
        this.openEditDialog(ns);
      },
      'delete': (ns: qos.namespace.INamespace) => {
        this.openDeleteDialog(ns);
      }
    };
  }

  loadData() {
    this.loaded = false;
    this.httpHelper.call<base.IPageData<qos.namespace.INamespace>>('GET', '/api/namespace', {
      status: 'all'
    }).$promise.success((data: base.IPageData<qos.namespace.INamespace>) => {
      this.data = data;
      this.loaded = true;
      this.pageChange();
    });
  }

  pageChange() {
    let start = (this.page - 1) * this.itemsPerPage;
    let end = start + this.itemsPerPage;
    this.pageData = this.data.items.slice(start, end);
  }

  openAddDialog() {
    console.log('complexMode', this.systemConfig.complexMode);
    let apiUrl = '/api/simple/namespace';
    if (this.systemConfig.complexMode) {
      apiUrl = '/api/namespace';
    }
    this.$translate(['NEW', 'NAMESPACE', 'FORMAT_ERROR', 'PROMT_ADD_NAMESPACE']).then((res: any) => {
      this.commonCheckModalService.build({
        title: `${res.NEW} ${res.NAMESPACE}`,
        msg: res.PROMT_ADD_NAMESPACE,
        checks: [{
          regexp: /^[A-Za-z][A-Za-z0-9-]{3,62}$/,
          errorMsg: res.FORMAT_ERROR
        }]

      }).then((name: string) => {
        this.httpHelper.call<qos.namespace.INamespace>('PUT', apiUrl, { name })
          .$promise.success((ns: qos.namespace.INamespace) => {
            this.data.items.push(ns);
            this.pageChange();
          });
      });
    });
  }

  openEditDialog(ns: qos.namespace.INamespace) {
    this.$translate(['EDIT', 'PROMT_EDIT_NAMESPACE']).then((res: any) => {
      this.qnModal.prompt(res.EDIT, res.PROMT_EDIT_NAMESPACE, undefined, 'md').then((name: string) => {
        this.httpHelper.call<qos.namespace.INamespace>('PATCH', '/api/namespace', { name })
          .$promise.success((ret: qos.namespace.INamespace) => {
            ns.name = ret.name;
          });
      });
    });
  }

  openDeleteDialog(ns: qos.namespace.INamespace) {
    this.$translate(['DELETE', 'PROMT_DELETE_NAMESPACE'], { name: ns.name }).then((res: any) => {

      this.qnModal.confirm(res.DELETE, res.PROMT_DELETE_NAMESPACE, 'danger', 'sm')
        .then(() => {
          this.httpHelper.call<qos.namespace.INamespace>('DELETE', '/api/namespace/:id', { id: ns.id })
          .$promise.success((ret: qos.namespace.INamespace) => {
            _.pull(this.data.items, ns);
          });
        });
    });
  }

  static getDepns() {
    return [qnModal];
  }
}

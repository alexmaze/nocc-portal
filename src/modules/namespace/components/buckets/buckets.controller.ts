import './buckets.less';
import * as _ from 'lodash';

export class BucketsController {

  static DEFAULT_PER_PAGE = 10;

  data: base.IPageData<qos.bucket.IBucket>;

  loaded: boolean;
  actions: qos.bucket.IBucketActions;
  searchKey: string;

  namespaceId: string;
  namespaceName: string;
  opUser: qos.user.IUser;

  systemConfig: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $q: angular.IQService,
    private $log: angular.ILogService,
    private $window: angular.IWindowService,
    private httpHelper: base.IHttpHelper,
    private qnModal: any,
    private commonCheckModalService: qos.service.ICommonCheckModalService,
    private systemConfigService: qos.service.ISystemConfigService,
    private userService: qos.service.IUserService,
    private $translate: angular.translate.ITranslateService,
    private $scope: angular.IScope) {

    let params = $state.params as any;
    this.namespaceId = params.ns;
    if (this.namespaceId === undefined || this.namespaceId === null) {
      this.namespaceId = userService.userInfo().namespace;
    }
    if (this.namespaceId === undefined || this.namespaceId === null) {
      return;
    }

    this.loaded = false;
    this.systemConfig = systemConfigService.config;
    this.loadPage(1);
    this.loadNamespace();
    this.bindActions();
    this.opUser = userService.userInfo();
  }

  searchChange() {
    this.loadPage(1);
  }

  bindActions() {
    this.actions = {
      'edit': (bk: qos.bucket.IBucket) => {
        this.$log.debug('edit');
        this.openEditDialog(bk);
      },
      'delete': (bk: qos.bucket.IBucket) => {
        this.$log.debug('delete');
        this.openDeleteDialog(bk);
      },
      'domain': (bk: qos.bucket.IBucket) => {
        this.$log.debug('domain');
        this.$state.go('^.domain', { ns: this.namespaceId, bk: bk.id });
      },
      'history': (bk: qos.bucket.IBucket) => {
        this.$log.debug('history');
        this.$state.go('^.history', { ns: this.namespaceId, bk: bk.id });
      }
    };
  }

  loadNamespace() {
    this.httpHelper.call<qos.namespace.INamespace>('GET', '/api/namespace/:id', { id: this.namespaceId })
      .$promise.success((ns: qos.namespace.INamespace) => { this.namespaceName = ns.name; });
  }

  loadPage(page: number) {
    this.loaded = false;
    this.httpHelper.call<base.IPageData<qos.bucket.IBucket>>('GET', `/api/bucket`, {
      namespace: this.namespaceId,
      page: page,
      q: this.searchKey ? this.searchKey : undefined,
      perpage: BucketsController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.bucket.IBucket>) => {
      this.data = data;
      this.loaded = true;
    });
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }

  openAddDialog() {
    this.$translate(['NEW', 'BUCKET', 'PROMT_ADD_BUCKET', 'FORMAT_ERROR']).then((res: any) => {

      this.commonCheckModalService.build({

        title: res.NEW + ' ' + res.BUCKET,
        msg: res.PROMT_ADD_BUCKET,
        checks: [{
          regexp: /^[A-Za-z][A-Za-z0-9-]{3,62}$/,
          errorMsg: res.FORMAT_ERROR
        }]
      }).then((name: string) => {
        let apiUrl = this.systemConfig.complexMode ? '/api/namespace/:nsId/bucket' : '/api/simple/namespace/:nsId/bucket';
        this.httpHelper.call<qos.bucket.IBucket>('PUT', apiUrl, { nsId: this.namespaceId, name })
          .$promise.success((ns: qos.bucket.IBucket) => {
            this.data.items.push(ns);
          });
      });

    });
  }

  // openAddDialog() {
  //   this.$translate(['NEW', 'PROMT_ADD_BUCKET']).then((res: any) => {
  //     this.qnModal.prompt(res.NEW, res.PROMT_ADD_BUCKET).then((name: string) => {
  //       this.httpHelper.call<qos.bucket.IBucket>('PUT', '/api/namespace/:nsId/bucket', { nsId: this.namespaceId, name })
  //         .$promise.success((ns: qos.bucket.IBucket) => {
  //           this.data.items.push(ns);
  //         });
  //     });
  //   });
  // }

  openEditDialog(bk: qos.bucket.IBucket) {
    this.$translate(['EDIT', 'PROMT_EDIT_BUCKET']).then((res: any) => {
      this.qnModal.prompt(res.EDIT, res.PROMT_EDIT_BUCKET, undefined, 'md').then((name: string) => {
        this.httpHelper.call<qos.bucket.IBucket>('PATCH', '/api/namespace/:nsId/bucket/:id', { nsId: this.namespaceId, id: bk.id, name })
          .$promise.success((ret: qos.bucket.IBucket) => {
            bk.name = ret.name;
          });
      });
    });
  }

  openDeleteDialog(bk: qos.bucket.IBucket) {
    this.$translate(['DELETE', 'PROMT_DELETE_BUCKET'], { name: bk.name }).then((res: any) => {
      this.qnModal.confirm(res.DELETE, res.PROMT_DELETE_BUCKET, 'danger', 'sm')
        .then(() => {
          this.httpHelper.call<qos.bucket.IBucket>('DELETE', '/api/namespace/:nsId/bucket/:id', { nsId: this.namespaceId, id: bk.id })
            .$promise.success((ret: qos.bucket.IBucket) => {
              _.pull(this.data.items, bk);
            });
        });
    });
  }
}

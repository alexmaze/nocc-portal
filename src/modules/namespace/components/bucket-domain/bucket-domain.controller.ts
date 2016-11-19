import './bucket-domain.less';
import * as _ from 'lodash';

export class BucketDomainController {

  namespaceId: string;
  bucketId: string;
  bucketName: string;
  namespaceName: string;

  data: qos.bucket.IDomain[];
  loaded: boolean;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $q: angular.IQService,
    private $log: angular.ILogService,
    private $timeout: angular.ITimeoutService,
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
    this.bucketId = params.bk;

    this.loadBucket();
    this.loadNamespace();
    this.loadDomains();
  }

  loadBucket() {
    this.httpHelper.call<qos.bucket.IBucket>('GET', `/api/bucket/:id`, {
      id: this.bucketId
    }).$promise.success((data: qos.bucket.IBucket) => {
      this.bucketName = data.name;
    });
  }
  loadNamespace() {
    this.httpHelper.call<qos.namespace.INamespace>('GET', '/api/namespace/:id', { id: this.namespaceId })
      .$promise.success((ns: qos.namespace.INamespace) => { this.namespaceName = ns.name; });
  }
  loadDomains() {
    this.loaded = false;
    this.httpHelper.call<qos.bucket.IDomain[]>('GET', `/api/bucket/:id`, {
      id: this.bucketId,
      domains: true
    }).$promise.success((data: qos.bucket.IDomain[]) => {
      this.data = data;
      this.loaded = true;
    });
  }
  unbind(domain: qos.bucket.IDomain) {
    this.$translate(['UNBIND', 'PROMT_UNBIND_DOMAIN']).then((res: any) => {
      this.qnModal.confirm(res.UNBIND, res.PROMT_UNBIND_DOMAIN, 'danger', 'sm').then(() => {
        this.httpHelper.call<void>('DELETE', `/api/bucket/:id/unbind`, {
          id: this.bucketId,
          domain
        }).$promise.success(() => {
          _.pull(this.data, domain);
        });

      });
    });
  }
  openAddDialog() {
    this.$translate(['BIND_DOMAIN', 'PROMT_ADD_DOMAIN', 'FORMAT_ERROR']).then((res: any) => {
      this.commonCheckModalService.build({
        title: res.BIND_DOMAIN,
        msg: res.PROMT_ADD_DOMAIN + this.bucketName,
        checks: [{
          regexp: /^(?:[\w_]+|[A-Za-z0-9_\u4E00-\u9FA5]{1,20})([\.\-][A-Za-z0-9_\u4E00-\u9FA5]{1,20}|[\w_]+)*$/,
          errorMsg: res.FORMAT_ERROR
        }]
      }).then((name: string) => {
        this.httpHelper.call<void>('PUT', `/api/bucket/:id/bind`, {
          id: this.bucketId,
          domain: name
        }).$promise.success(() => {
          this.data.push(name);
        });
      });

    });
  }
}

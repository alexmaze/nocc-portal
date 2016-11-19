export class CreateController {

  isSubmitting: boolean = false;
  namespaces: qos.namespace.INamespace[];

  ngModelOptions = { debounce: 500 };
  user: qos.user.IUser = {};

  opUser: qos.user.IUser;
  conf: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private userService: qos.service.IUserService,
    private systemConfigService: qos.service.ISystemConfigService,
    private $scope: angular.ui.bootstrap.IModalScope,
    private httpHelper: base.IHttpHelper) {
      this.conf = systemConfigService.config;
      this.opUser = userService.userInfo();
      this.loadNamespaces();
  }

  loadNamespaces() {
    return this.httpHelper.call<base.IPageData<qos.namespace.INamespace>>('GET', '/api/namespace', {
      status: 'assignable'
    }).$promise.success((data: base.IPageData<qos.namespace.INamespace>) => {
      this.namespaces = data.items;
    });
  }

  submit() {
    this.user.role = parseInt(this.user.role as any, 10);
    this.isSubmitting = true;
    this.httpHelper.call<qos.user.IUser>('PUT', '/api/account', this.user).$promise.success(() => {
      this.$scope.$close();
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}

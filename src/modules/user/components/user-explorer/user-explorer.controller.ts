
export class UserExplorerController implements qos.user.IUserExplorerBinding {

  userModel: qos.user.IUser[];
  userLoaded: boolean;
  userActions: qos.user.IUserActions;

  orderArray: string[];
  orderBy: string;
  orderReverse: boolean;
  allSelected: boolean;

  namespaces: qos.namespace.INamespace[];

  conf: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private systemConfigService: qos.service.ISystemConfigService,
    private $log: angular.ILogService,
    private $scope: any,
    private httpHelper: base.IHttpHelper) {
    this.conf = systemConfigService.config;
    this.changeOrder('name');
    this.allSelected = false;
  }

  /**
   * 修改列表排序
   */
  changeOrder(newOrder: string) {
    if (this.orderBy === newOrder) {
      this.orderReverse = !this.orderReverse;
    } else {
      this.orderBy = newOrder;
      this.orderReverse = false;
    }
    this.orderArray = [(this.orderReverse ? '-' : '') + this.orderBy];
  }
}

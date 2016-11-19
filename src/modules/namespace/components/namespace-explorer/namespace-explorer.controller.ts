import './namespace-explorer.less';

export class NamespaceExplorerController implements ecloud.namespace.IUserExplorerBinding {

  public nsModel: ecloud.namespace.INamespace[];
  public nsLoaded: boolean;
  public nsActions: ecloud.namespace.INamespaceActions;
  public nsFilterKey: string;

  public orderArray: string[];
  public orderBy: string;
  public orderReverse: boolean;
  public allSelected: boolean;

  systemConfig: qos.ISystemConfig;

  /* @ngInject */
  constructor(
    private $log: angular.ILogService,
    private systemConfigService: qos.service.ISystemConfigService,
    private $scope: any) {
    this.systemConfig = systemConfigService.config;
    this.changeOrder('key');
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

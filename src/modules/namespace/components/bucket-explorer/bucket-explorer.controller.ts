import './bucket-explorer.less';

export class BucketExplorerController implements qos.bucket.IUserExplorerBinding {

  public bucketModel: qos.bucket.IBucket[];
  public bucketLoaded: boolean;
  public bucketActions: qos.bucket.IBucketActions;

  public orderArray: string[];
  public orderBy: string;
  public orderReverse: boolean;
  public allSelected: boolean;

  /* @ngInject */
  constructor(
    private $log: angular.ILogService,
    private $scope: any) {

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

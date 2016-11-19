
export class UserExplorerController implements qos.user.IUserExplorerBinding {

  userModel: qos.user.IUser[];
  userLoaded: boolean;
  userActions: qos.user.IUserActions;

  namespaces: qos.namespace.INamespace[];

  /* @ngInject */
  constructor(
    private $log: angular.ILogService,
    private $scope: any,
    private httpHelper: base.IHttpHelper) {
  }

}

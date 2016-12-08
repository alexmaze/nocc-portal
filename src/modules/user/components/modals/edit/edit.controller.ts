import * as _ from 'lodash';

export class EditController {

  isSubmitting: boolean = false;

  ngModelOptions = { debounce: 500 };
  user: qos.user.IUser;

  opUser: qos.user.IUser;

  /* @ngInject */
  constructor(
    private userService: qos.service.IUserService,
    private $scope: angular.ui.bootstrap.IModalScope,
    private httpHelper: base.IHttpHelper) {
      this.user = _.cloneDeep(($scope as any).user);
      this.opUser = userService.userInfo();
  }
  submit() {
    this.isSubmitting = true;
    this.httpHelper.call<qos.user.IUser>('POST', `/api/user/${this.user._id}/patch`, this.user).$promise.success(() => {
      this.$scope.$close();
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}

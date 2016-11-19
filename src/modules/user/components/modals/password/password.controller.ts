export class PasswordController {

  password: string;
  isSubmitting: boolean = false;

  ngModelOptions = { debounce: 500 };
  user: qos.user.IUser;

  /* @ngInject */
  constructor(
    private $scope: angular.ui.bootstrap.IModalScope,
    private httpHelper: base.IHttpHelper) {
      this.user = ($scope as any).user;
  }

  submit() {
    this.isSubmitting = true;
    this.httpHelper.call<qos.user.IUser>('PATCH', '/api/account/:id?password=true', {
      id: this.user.id,
      password: this.password
    }).$promise.success(() => {
      this.$scope.$close();
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}

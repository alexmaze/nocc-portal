import './change-password.less';

export class ChangePasswordController {

  oldPassword: string;
  newPassword: string;
  confirm: string;

  opUser: qos.user.IUser;

  errors: {
    oldPassword?: boolean;
    newPassword?: boolean;
    confirm?: boolean;
  };

  /** @ngInject */
  constructor(
    private $state: any,
    private userService: qos.service.IUserService,
    private httpHelper: base.IHttpHelper,
    private toaster: any) {

    this.opUser = userService.userInfo();
    this.errors = {};
  }

  save() {
    // check
    if (!this.validate()) {
      return;
    }

    this.httpHelper.call<qos.user.IUser>('POST', '/api/session/patch?password=true', {
      old: this.oldPassword,
      new: this.newPassword
    }).$promise.success(() => {
      this.toaster.info('密码更新成功');
    });
  }

  validate() {
    this.errors.oldPassword = (!this.oldPassword || this.oldPassword.length <= 0);
    this.errors.newPassword = (!this.newPassword || this.newPassword.length <= 0);
    this.errors.confirm = (this.newPassword !== this.confirm);
    let error = this.errors.oldPassword || this.errors.newPassword || this.errors.confirm;
    return !error;
  }

}

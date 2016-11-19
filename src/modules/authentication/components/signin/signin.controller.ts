import './signin.less';

export class SigninController {

  username: string;
  password: string;
  redirect: string;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $window: angular.IWindowService,
    private httpHelper: base.IHttpHelper,
    private urlSafeBase64Util: any,
    private userFeaturesService: any,
    private systemConfigService: qos.service.ISystemConfigService,
    private userService: qos.service.IUserService) {
    this.init();
  }

  init() {
    let params = this.$state.params as { redirect: string };
    this.redirect = params && params.redirect;

    // 检查本地
    let cachedUser = this.userService.userInfo();
    if (this.goUserDefaultState(cachedUser)) {
      return;
    }
  }

  submit() {
    if (!this.username || !this.password) {
      return;
    }

    // call signin api
    this.httpHelper.call<qos.user.IUser>('PUT', '/api/session', {
      username: this.username,
      password: this.password
    }).$promise.success((data: qos.user.IUser) => {
      this.userService.cacheUserInfo(data);
      this.goUserDefaultState(data);
    });
  }

  private goUserDefaultState(user: qos.user.IUser) {
    if (!user) {
      return false;
    }

    let features = this.userFeaturesService.get(user.role, this.systemConfigService.config.complexMode);
    if (features && features[0]) {
      if (features[0].state && this.$state.get(features[0].state)) {
        this.$state.go(features[0].state);
        return true;
      } else if (features[0].features[0].state && this.$state.get(features[0].features[0].state)) {
        this.$state.go(features[0].features[0].state);
        return true;
      }
    }
    return false;
  }

  static getDepns () {
    return [];
  }
}

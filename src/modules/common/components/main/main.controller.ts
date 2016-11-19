import './main.less';

export default class MainController {

  userFeatures: any;

  /* @ngInject */
  constructor(
    private userFeaturesService: any,
    private systemConfigService: qos.service.ISystemConfigService,
    private userService: qos.service.IUserService) {

    // check cached user info
    let user = userService.userInfo();
    this.userFeatures = userFeaturesService.get(
      user.role,
      systemConfigService.config.complexMode,
      user.isSuper);
  }


  static getDepns() {
    return [];
  }
}

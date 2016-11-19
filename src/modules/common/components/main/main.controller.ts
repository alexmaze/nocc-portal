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
    this.userFeatures = userFeaturesService.get();
  }


  static getDepns() {
    return [];
  }
}

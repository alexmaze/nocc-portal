import * as jQuery from 'jquery';
import { UserRole } from '../../../common/components/user/user-role.filter';

export class UserService implements qos.service.IUserService {

  /* @ngInject */
  constructor(
    private localStorageService: any,
    private $state: angular.ui.IStateService,
    private $rootScope: angular.IRootScopeService,
    private httpHelper: base.IHttpHelper) {
  }

  cacheUserInfo(user: qos.user.IUser) {
    if (user.isSuper) {
      user.role = UserRole.system_admin;
    }
    this.$rootScope.userInfo = user;
    this.localStorageService.set('user', user);
  }

  userInfo() {
    let ret = this.$rootScope.userInfo;
    if (!ret) {
      ret = this.localStorageService.get('user');
    }
    return ret;
  }

  clearUserInfo() {
    this.$rootScope.userInfo = undefined;
    this.localStorageService.remove('user');
  }

  checkSessionSync() {
    let res = jQuery.ajax({
      url: '/api/session',
      async: false
    });
    if (res.status === 401) {
      this.clearUserInfo();
      return;
    }

    let user = res.responseJSON;
    this.cacheUserInfo(user);
  }

}

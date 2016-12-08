import './navbar-actions.less';
import { UserRole } from '../../../common/components/user/user-role.filter';

const dropdown = require('angular-ui-bootstrap/src/dropdown');

/* @ngInject */
export function navbarActions() {
  return {
    restrict: 'E',
    replace: true,
    template: require('./navbar-actions.html'),
    controller: NavbarActionsClass,
    controllerAs: 'ctrl'
  };
}

class NavbarActionsClass {

  user: qos.user.IUser;
  openEventsBox: boolean;

  /** @ngInject */
  constructor(
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService,
    private $scope: angular.IScope,
    private $state: angular.ui.IStateService) {
      this.user = userService.userInfo();
      $scope.$watch('ctrl.$state.current.name', () => {
        this.openEventsBox = false;
      });
  }

  signOut() {
    this.httpHelper.call<void>('POST', '/api/session/delete');
    this.userService.clearUserInfo();
    this.$state.go('signin');
  }

  /**
   * 目前仅在监控页面显示事件
   *   但要排除:
   *   monitor.events
   *   monitor.resources
   *   monitor.statistics
   *   monitor.alerts
   *
   * @returns
   *
   * @memberOf NavbarActionsClass
   */
  hasEvent() {
    let states = this.$state.current.name.split('.');
    return this.user.role === UserRole.system_admin
      && states[1] === 'monitor'
      && states[2] !== 'events'
      && states[2] !== 'resources'
      && states[2] !== 'statistics'
      && states[2] !== 'alerts';
  }

  openEvents($event: angular.IAngularEvent) {
    this.openEventsBox = !this.openEventsBox;
    $event.stopPropagation();
  }
}

(navbarActions as any).getDepns = () => [dropdown];

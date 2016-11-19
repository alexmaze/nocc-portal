import './dashboard.less';
import { UserRole } from '../../../common/components/user/user-role.filter';

export class DashboardController {
  fileTypeShares: { name: string; type: string; size: number; percentage?: number; }[];
  volume: { max: number; used: number; };
  deviceData: any;
  usageData: any;
  colors: any;
  formatter: any;

  user: qos.user.IUser;
  namespace: qos.namespace.INamespace;

  /* @ngInject */
  constructor(
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService) {

    this.user = userService.userInfo();

    if (this.user.role === UserRole.namesapce_admin) {
      if (this.user.namespace === undefined || this.user.namespace === null) {
        return;
      }
      this.namespace = this.httpHelper.call<qos.namespace.INamespace>('GET',
        '/api/namespace/:id', { id: this.user.namespace });
    }

  }

}

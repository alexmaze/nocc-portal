import { UserRole } from '../../../common/components/user/user-role.filter';
import * as _ from 'lodash';

let userFeatures = [
  {
    name: 'MANAGE',
    features: [
      {
        name: '用户',
        state: 'main.user',
        icon: 'fa-user'
      }
    ]
  }, {
    name: 'SETTINGS',
    features: [
      {
        name: '修改密码',
        state: 'main.change_password',
        icon: 'fa-key'
      }, {
        name: '关于系统',
        state: 'main.about',
        icon: 'fa-info'
      }
    ]
  }
];

export class UserFeaturesService {
  get() {
    return userFeatures;
  }
}

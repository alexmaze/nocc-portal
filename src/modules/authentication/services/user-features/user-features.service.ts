import { UserRole } from '../../../common/components/user/user-role.filter';
import * as _ from 'lodash';

let userFeatures = [
  {
    name: 'MANAGE',
    features: [
      {
        name: '首页',
        state: 'main.showcase',
        icon: 'fa-university'
      }, {
        name: '使命',
        state: 'main.mission',
        icon: 'fa-flag-o'
      }, {
        name: '事件',
        state: 'main.event',
        icon: 'fa-newspaper-o'
      }, {
        name: '实验室',
        state: 'main.lab',
        icon: 'fa-diamond'
      }, {
        name: '关于-全体',
        state: 'main.faculty',
        icon: 'fa-id-card-o'
      }, {
        name: '用户',
        state: 'main.user',
        icon: 'fa-user-o'
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

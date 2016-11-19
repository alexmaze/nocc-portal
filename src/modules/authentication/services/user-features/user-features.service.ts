import { UserRole } from '../../../common/components/user/user-role.filter';
import * as _ from 'lodash';

let userFeatures = {};

// 名称空间管理员
userFeatures[UserRole.namesapce_admin] = [
  {
    name: 'DASHBOARD',
    state: 'main.dashboard',
    icon: 'fa-dashboard'
  }, {
    name: 'MANAGE',
    features: [
      {
        name: 'BUCKETS',
        state: 'main.buckets',
        icon: 'fa-codepen'
      }, {
        name: 'KEYS',
        state: 'main.keys',
        icon: 'fa-key'
      }
    ]
  }, {
    name: 'SETTINGS',
    features: [
      {
        name: 'CHANGE_PASSWORD',
        state: 'main.change_password',
        icon: 'fa-key'
      }, {
        name: 'ABOUT_SYSTEM',
        state: 'main.about',
        icon: 'fa-info'
      }
    ]
  }
];

// 普通管理员
userFeatures[UserRole.normal_admin] = [
  {
    name: 'MONITOR',
    state: 'main.monitor',
    features: [
      {
        name: 'CAPACITY',
        state: 'main.monitor.capacity',
        icon: 'fa-pie-chart'
      }, {
        name: 'STATISTICS',
        state: 'main.monitor.statistics',
        icon: 'fa-bar-chart'
      }
    ]
  }, {
    name: 'MANAGE',
    features: [
      {
        name: 'NAMESPACE',
        state: 'main.namespace',
        icon: 'fa-folder-open'
      }, {
        name: 'USER',
        state: 'main.user',
        icon: 'fa-user'
      }
    ]
  }, {
    name: 'SETTINGS',
    features: [
      {
        name: 'CHANGE_PASSWORD',
        state: 'main.change_password',
        icon: 'fa-key'
      }, {
        name: 'ABOUT_SYSTEM',
        state: 'main.about',
        icon: 'fa-info'
      }
    ]
  }
];

// 系统管理员
userFeatures[UserRole.system_admin] = [
  {
    name: 'MONITOR',
    state: 'main.monitor',
    features: [
      {
        name: 'CAPACITY',
        state: 'main.monitor.capacity',
        icon: 'fa-pie-chart'
      }, {
        name: 'SERVERS',
        state: 'main.monitor.servers',
        icon: 'fa-server'
      }, {
        name: 'SERVICES',
        state: 'main.monitor.resources',
        icon: 'fa-cogs',
        features: [
          {
            name: 'PFD',
            state: 'main.monitor.resources.pfd',
            icon: 'fa-object-group'
          }, {
            name: 'EBD',
            state: 'main.monitor.resources.ebd',
            icon: 'fa-cubes'
          }, {
            name: 'RS',
            state: 'main.monitor.resources.rs',
            icon: 'fa-circle-o'
          }, {
            name: 'IO',
            state: 'main.monitor.resources.io',
            icon: 'fa-cloud-download'
          }, {
            name: 'UP',
            state: 'main.monitor.resources.up',
            icon: 'fa-cloud-upload'
          }, {
            name: 'Memcached',
            state: 'main.monitor.resources.memcached',
            icon: 'fa-database'
          }, {
            name: 'MySQL',
            state: 'main.monitor.resources.mysql',
            icon: 'fa-database'
          }, {
            name: 'MongoDB',
            state: 'main.monitor.resources.mongo',
            icon: 'fa-database'
          }
        ]
      }, {
        name: 'EVENTS',
        state: 'main.monitor.events',
        icon: 'fa-bell-o'
      }, {
        name: 'ALERTS',
        state: 'main.monitor.alerts',
        icon: 'fa-exclamation-triangle'
      }, {
        name: 'STATISTICS',
        state: 'main.monitor.statistics',
        icon: 'fa-bar-chart'
      }
    ]
  }, {
    name: 'MANAGE',
    features: [
      {
        name: 'NAMESPACE',
        state: 'main.namespace',
        icon: 'fa-folder-open'
      }, {
        name: 'USER',
        state: 'main.user',
        icon: 'fa-user'
      }
    ]
  }, {
    name: 'SETTINGS',
    features: [
      {
        name: 'CHANGE_PASSWORD',
        state: 'main.change_password',
        icon: 'fa-key'
      }, {
        name: 'ABOUT_SYSTEM',
        state: 'main.about',
        icon: 'fa-info'
      }
    ]
  }
];

export class UserFeaturesService {
  get(role: UserRole, complexMode: boolean = false, isSuper: boolean = false) {
    let ret = _.cloneDeep(userFeatures[role]);
    if (!complexMode && !isSuper) {
      // 简单模式下去除用户管理
      let manages = ret[1].features;
      let manageUserState = manages.filter(item => item.state === 'main.user');
      if (manageUserState) {
        _.pullAll(manages, manageUserState);
      }
    }
    return ret;
  }

}

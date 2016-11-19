import './user-list.less';
import { UserRole } from '../../../common/components/user/user-role.filter';
import * as _ from 'lodash';

export class UserListController {

  static DEFAULT_PER_PAGE = 10;

  actions: qos.user.IUserActions;
  searchKey: string;
  loaded: boolean;

  opUser: qos.user.IUser;
  data: base.IPageData<qos.user.IUser>;

  namespaces: qos.namespace.INamespace[];

  /* @ngInject */
  constructor(
    private userModal: any,
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService) {
    this.bindUserActions();
    this.loadNamespaces().success(() => {
      this.loadPage(1);
    });

    this.opUser = userService.userInfo();
  }

  searchChange() {
  }

  bindUserActions() {
    this.actions = {
      'edit': (user: qos.user.IUser) => {
        this.userModal.edit(user).then(() => {
          this.loadPage(this.data.page);
        });
      },
      'password': (user: qos.user.IUser) => {
        this.userModal.changePassword(user);
      },
      'delete': (users: qos.user.IUser[]) => {
        this.$translate(['DELETE', 'PROMT_DELETE_USER'], { name: users[0].name }).then((res: any) => {
          this.qnModal.confirm(res.DELETE, res.PROMT_DELETE_USER, 'danger', 'sm').then(() => {
            this.deleteUser(users[0].id).success(() => {
              _.pull(this.data.items, users[0]);
              this.data.total--;
            });
          });
        });
      }
    };
  }

  create() {
    this.userModal.create().then(() => {
      this.loadPage(this.data.page);
    });
  }

  loadPage(page: number) {
    this.loaded = false;
    return this.httpHelper.call<base.IPageData<qos.user.IUser>>('GET', '/api/account', {
      page: page,
      perpage: UserListController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.user.IUser>) => {
      this.loaded = true;
      this.data = data;

      // change user._scope
      for (let user of this.data.items) {
        if (user.role === UserRole.system_admin) {
          user._scope = 'SYSTEM';
        } else {
          let ns = _.find(this.namespaces, { id: user.namespace });
          if (ns) {
            user._scope = `${ns.name}`;
          }
        }
      }
    });
  }

  deleteUser(id: string) {
    return this.httpHelper.call<void>('DELETE', '/api/account/:id', {
      id: id
    }).$promise;
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }

  loadNamespaces() {
    return this.httpHelper.call<base.IPageData<qos.namespace.INamespace>>('GET', '/api/namespace', {
      status: 'avaliable'
    }).$promise.success((data: base.IPageData<qos.namespace.INamespace>) => {
      this.namespaces = data.items;
    });
  }
}

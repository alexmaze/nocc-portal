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

  /* @ngInject */
  constructor(
    private userModal: any,
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService) {
    this.bindUserActions();
    this.loadPage(1);
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
        this.qnModal.confirm('删除确认', '您确定要删除该用户吗？', 'danger', 'sm').then(() => {
          this.deleteUser(users[0]._id).success(() => {
            _.pull(this.data.items, users[0]);
            this.data.total--;
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
    return this.httpHelper.call<base.IPageData<qos.user.IUser>>('GET', '/api/user', {
      page: page,
      perpage: UserListController.DEFAULT_PER_PAGE
    }).$promise.success((data: base.IPageData<qos.user.IUser>) => {
      this.loaded = true;
      this.data = data;
    });
  }

  deleteUser(id: string) {
    return this.httpHelper.call<void>('POST', '/api/user/:id/delete', {
      id: id
    }).$promise;
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }
}

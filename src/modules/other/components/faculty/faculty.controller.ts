import './faculty.less';
import * as _ from 'lodash';

export class FacultyController {

  perpage = 12;

  searchKey: string;
  loaded: boolean;

  data: base.IPageData<qos.IFaculty>;

  /* @ngInject */
  constructor(
    private $rootScope: angular.IRootScopeService,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private $scope: angular.IScope,
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper,
    private userService: qos.service.IUserService) {
    this.loadPage(1);
  }

  searchChange() {
  }

  create() {
    this.$state.go('main.faculty.create');
  }

  edit(faculty: qos.IFaculty) {
    this.$state.go('main.faculty.detail', { id: faculty._id });
  }

  loadPage(page: number) {
    this.loaded = false;
    return this.httpHelper.call<base.IPageData<qos.IFaculty>>('GET', '/api/faculty', {
      page: page,
      perpage: this.perpage
    }).$promise.success((data: base.IPageData<qos.IFaculty>) => {
      this.loaded = true;
      this.data = data;
    });
  }

  delete(faculty: qos.IFaculty) {
    this.qnModal.confirm('删除确认', '您确定要删除此记录吗？', 'danger', 'sm').then(() => {
      return this.httpHelper.call<void>('POST', '/api/faculty/:id/delete', {
        id: faculty._id
      }).$promise.success(() => {
        _.pull(this.data.items, faculty);
        this.data.total--;
      });
    });
  }

  pageChanged() {
    this.data.items = undefined;
    this.loadPage(this.data.page);
  }


  openModal(scope: any, template: string, controller: any, size: base.ui.QnModalSize = 'md') {
    return this.$uibModal.open({
      template,
      scope,
      windowClass: 'modal-center',
      size,
      backdrop: false,
      keyboard: false,
      controller,
      controllerAs: 'ctrl'
    });
  };
}

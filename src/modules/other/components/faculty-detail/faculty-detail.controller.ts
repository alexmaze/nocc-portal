import * as _ from 'lodash';

export class FacultyDetailController {

  editId: string;
  faculty: qos.IFaculty = {} as any;

  /* @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private $translate: angular.translate.ITranslateService,
    private qnModal: any,
    private httpHelper: base.IHttpHelper) {
    this.editId = (this.$state.params as any).id;
    if (this.editId) {
      this.load();
    }
  }

  load() {
    this.httpHelper.call<qos.IFaculty>('GET', '/api/faculty/' + this.editId).$promise.success(data => {
      this.faculty = data;
    });
  }

  submit() {
    console.log(this.faculty);
    this.httpHelper.call<qos.user.IUser>('POST', '/api/faculty', this.faculty).$promise.success(() => {
      this.$state.go('^.main');
    });
  }
}

export class CommonCheckModalController {

  errorIndex: number;
  checks: any;

  /* @ngInject */
  constructor(private $scope: any) {
    this.errorIndex = -1;
    this.checks = $scope.data.checks;
  }

  validate(data: string) {
    for (let i = 0; i < this.checks.length; i++) {
      if (!this.checks[i].regexp.test(data)) {
        this.errorIndex = i;
        return;
      }
    }
    this.errorIndex = -1;
  }
}

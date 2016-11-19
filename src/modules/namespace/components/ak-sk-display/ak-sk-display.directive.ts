import './ak-sk-display.less';
/* @ngInject */
export function akSkDisplay() {
  return {
    restrict: 'E',
    template: `
    <div class="ak-sk-display">
      <div class="ak">
        <span>AK:</span>
        <input type="text" ng-model="key.accessKeyId" disabled />
      </div>
      <div class="sk">
        <span>SK:</span>
        <input type="{{isShowSecret ? 'text' : 'password'}}" ng-model="key.accessKeySecret" disabled />
        <a ng-click="toggleShow()" translate>{{isShowSecret ? 'HIDE' : 'SHOW'}}</a>
      </div>
    </div>
    `,
    replace: true,
    scope: {
      key: '='
    },
    link: (scope: any, elem: any, attrs: any) => {
      scope.isShowSecret = false;
      scope.toggleShow = () => {
        scope.isShowSecret = !scope.isShowSecret;
      };
    }
  };
}

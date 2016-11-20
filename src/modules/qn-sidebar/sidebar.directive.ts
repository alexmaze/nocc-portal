const NARROW_WIDTH_THRESHOLD = 1100;

/** @ngInject */
export function qnSidebar(
  $timeout: angular.ITimeoutService,
  $rootScope: angular.IRootScopeService,
  $window: angular.IWindowService,
  $state: angular.ui.IStateService,
  $document: angular.IDocumentService) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      brand: '@',
      features: '=',
      isSubMenuShow: '=?',
      isDefaultExpand: '=?',
      theme: '@?'
    },
    template: require('./sidebar.html'),
    link: (scope: any, elem: any) => {
      init();

      function init() {
        scope.theme = !scope.theme ? 'light' : scope.theme;
        scope.isActive = isActive;

        if (scope.isDefaultExpand === undefined) {
          scope.isDefaultExpand = true;
        }
        scope.isExpanded = scope.isDefaultExpand;

        scope.isSubMenuShow = false;
        scope.items = parseFeatures();
        scope.action = selectAction;
        scope.toggleExpand = toggleExpand;

        bindSubMenu();
        autoNarrow();
      }

      function toggleExpand(isExpanded?: boolean) {
        scope.isExpanded = isExpanded === undefined ? !scope.isExpanded : isExpanded;
        $timeout(() => {
          $rootScope.$broadcast('GLOBAL_FOR_ECHARTS_RESIZE');
        }, 200);
      }

      /**
       * 转换输入数据格式
       *
       * @returns
       */
      function parseFeatures() {
        let items = [];
        scope.features.forEach(feature => {
          if (feature.icon) {
            // 正常 item
            items.push(feature);
          } else if (feature.features) {
            // 添加标题
            items.push({
              isTitle: true,
              name: feature.name
            });
            // 顶级分组
            feature.features.forEach(subFeature => {
              items.push(subFeature);
            });
            // 添加分割
            items.push({
              isSeparator: true
            });
          }
        });
        return items;
      }

      /**
       * 选择
       *
       * @param {*} item
       */
      function selectAction(item: any) {
        setTimeout(() => {
          if (item.features) {
            scope.isSubMenuShow = true;
            scope.subSelected = item;
            scope.$apply();
          } else {
            scope.isSubMenuShow = false;
            scope.subSelected = {};
            $state.go(item.state);
          }
        }, 0);
      }

      /**
       * 绑定子菜单事件
       */
      function bindSubMenu() {
        scope.subSelected = {};
        $document.on('click', clickOutSide);
        scope.$on('$destroy', () => {
          $document.off('click', clickOutSide);
        });
      }

      function clickOutSide(event: JQueryEventObject) {
        if (scope.isSubMenuShow) {
          let sub = elem[0].lastElementChild;
          if (!sub.contains(event.target)) {
            scope.isSubMenuShow = false;
            scope.subSelected = {};
            event.stopPropagation();
            scope.$apply();
          }
        }
      }

      /**
       * 检查连接是否处于激活状态
       *
       * @param {*} item
       * @returns
       */
      function isActive(item: any) {
        let cur: string = $state.current.name;
        if (cur === item.state) {
          return true;
        } else if (cur.indexOf(item.state) >= 0
          && cur.charAt(item.state.length) === '.') {
          return true;
        } else if (item.state === scope.subSelected.state) {
          return true;
        }
        return false;
      };

      function autoNarrow() {
        if (document.body.clientWidth <= NARROW_WIDTH_THRESHOLD) {
          toggleExpand(false);
        }
        $window.onresize = (ev: UIEvent) => {
          let target = <any>ev.target;
          if (target.innerWidth <= NARROW_WIDTH_THRESHOLD && scope.isExpanded) {
            toggleExpand(false);
            scope.$apply();
          }
        };
      }
    }
  };
}

import './events-box.less';

interface IEventsBoxScope extends angular.IScope {
  isOpen: boolean;
  currentTab: string;
  loaded: boolean;
  page: number;
  data: base.IPageData<qos.events.IEvent>;
  ignore: (e: qos.events.IEvent) => void;
  more: () => void;
}

interface IEventRequestParams {
  locale: string;
  page: number;
  perpage: number;
  unsolved?: boolean;
  type?: string;
  subType?: string;
  resourceId?: string;
}

/* @ngInject */
export function eventsBox(
  $rootScope: angular.IRootScopeService,
  $translate: angular.translate.ITranslateService,
  $document: angular.IDocumentService,
  $state: angular.ui.IStateService,
  qnModal: base.ui.IQnModalService,
  $q: angular.IQService,
  httpHelper: base.IHttpHelper) {

  return {
    restrict: 'E',
    template: require('./events-box.html'),
    replace: true,
    scope: {
      isOpen: '='
    },
    link: (scope: IEventsBoxScope, elem: any, attrs: any) => {
      const DEFAULT_PER_PAGE = 10;
      init();

      function init() {
        scope.loaded = false;
        scope.page = 1;
        scope.$watch('currentTab', (nowTab: string, preTab: string) => {
          scope.data = undefined;
          buildParams(scope.page).then((params: IEventRequestParams) => {
            loadEvents(params, false);
          });
        });
        scope.currentTab = 'smart';
        scope.ignore = ignore;
        scope.more = more;

        $document.on('click', clickOutSide);

        scope.$on('$destroy', () => {
          $document.off('click', clickOutSide);
        });
      }

      function clickOutSide(event: JQueryEventObject) {
        if (!elem[0].contains(event.target)) {
          scope.isOpen = false;
          event.stopPropagation();
          scope.$apply();
        }
      }

      function loadEvents(params: IEventRequestParams, keep: boolean) {
        scope.loaded = false;
        httpHelper.call<base.IPageData<qos.events.IEvent>>('GET', '/api/events', params)
        .$promise.success((data: base.IPageData<qos.events.IEvent>) => {
          if (!scope.data) {
            scope.data = {} as any;
          }
          scope.data.page = data.page;
          scope.data.perpage = data.perpage;
          scope.data.total = data.total;
          if (keep) {
            data.items.forEach((element: qos.events.IEvent) => {
              scope.data.items.push(element);
            });
          } else {
            scope.data.items = data.items;
          }
          scope.loaded = true;
        });
      }

      function ignore(event: qos.events.IEvent) {
        $translate(['CONFIRM', 'PROMT_IGNORE_EVENT']).then((res: any) => {
          qnModal.confirm(res.CONFIRM, res.PROMT_IGNORE_EVENT, undefined, 'sm')
            .then(() => {
              httpHelper.call<void>('PATCH', '/api/events/:id', {
                id: event.id,
                ignore: true
              }).$promise.success(() => {
                _.pull(scope.data.items, event);
              });
            });
        });
      }

      function more() {
        scope.page += 1;
        buildParams(scope.page).then((params: IEventRequestParams) => {
          loadEvents(params, true);
        });
      }

      function buildParams(page: number) {
        return $q((
          resolve: angular.IQResolveReject<IEventRequestParams>,
          reject: angular.IQResolveReject<IEventRequestParams>) => {

          scope.page = page;
          const locale = $translate.use();
          let params: IEventRequestParams = {
            locale,
            page,
            perpage: DEFAULT_PER_PAGE
          };

          if (scope.currentTab === 'smart') {
            params.unsolved = true;
          }
          let states = $state.current.name.split('.');
          if (states[2] === 'resources') {
            params.type = 'resource';
            params.subType = states[3];
            if (states[4] === 'main') {
              resolve(params);
            } else {
              waitForResourceId(resolve, reject, params);
            }
          } else if (states[2] === 'servers') {
            params.type = 'server';
            if (states[3] === 'detail') {
              waitForResourceId(resolve, reject, params);
            } else {
              resolve(params);
            }
          } else if (states[2] === 'capacity') {
            params.type = 'capacity';
            params.subType = 'pfd';
            resolve(params);
          }

        });
      }

      function waitForResourceId(
          resolve: angular.IQResolveReject<IEventRequestParams>,
          reject: angular.IQResolveReject<IEventRequestParams>,
          params: IEventRequestParams) {
        $rootScope.loadResourceIdPromise.then((resourceId: string) => {
          params.resourceId = resourceId;
          resolve(params);
        }, (e: any) => {
          reject(e);
        });
      }
    }
  };
}

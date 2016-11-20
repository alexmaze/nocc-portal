import * as angular from 'angular';

// base utils
import Register from 'opdev-front/src/utils/register';

// base components
import uiRouterExtend from 'opdev-front/src/components/ui-router-extend';
import uiViewSlide from 'opdev-front/src/components/ui-view-slide';
import httpHelper from 'opdev-front/src/services/http-helper';
import qnFooter from 'opdev-front/src/components/qn-footer';
import qnHeader from 'opdev-front/src/components/qn-header';
import qnNavbar from 'opdev-front/src/components/qn-navbar';
import qnSearchBox from 'opdev-front/src/components/qn-searchbox';
import filters from 'opdev-front/src/components/filters';
import qnLoading from 'opdev-front/src/components/qn-loading';
import qnModal from 'opdev-front/src/components/qn-modal';
import utils from 'opdev-front/src/utils';
import statusTag from 'opdev-front/src/components/status-tag';
import validateSameWith from 'opdev-front/src/components/validate-same-with';

import qnSidebar from '../qn-sidebar';
// import qnSidebar from 'opdev-front/src/components/qn-sidebar';
const uiPagination = require('angular-ui-bootstrap/src/pagination');

// base styles
import 'opdev-front/src/reset.less';
import 'opdev-front/src/styles/toaster/toaster.less';
import 'opdev-front/src/styles/buttons/buttons.less';
import 'opdev-front/src/styles/forms/forms.less';
import 'opdev-front/src/styles/card/card.less';
import 'opdev-front/src/styles/item/item.less';
import 'opdev-front/src/styles/table/table.less';
import 'opdev-front/src/styles/page/page.less';
import 'opdev-front/src/styles/tabs/tabs.less';
import 'opdev-front/src/styles/modal/modal.less';
import 'opdev-front/src/styles/switcher/switcher.less';

import './styles.less';
import run from './run';
import config from './config';
import routerConfig from './route';

import { userRoleFilter } from './components/user/user-role.filter';
import { SystemConfigService } from './services/system-config/system-config.service';
import { CommonCheckModalService } from './components/common-check-modal/common-check-modal.service';

import { navbarActions } from './components/navbar-actions/navbar-actions.directive';
import { imageSelector } from './components/image-selector/image-selector.directive';
import { singleImageSelector } from './components/single-image-selector/single-image-selector.directive';

import { commonStatusFilter } from './components/common-status/common-status.filter';
import { commonStatusTypeFilter } from './components/common-status/common-status-type.filter';

import { typeConstants } from './constants/type.contants';
import { type } from './filters/type.filter';

import MainController from './components/main/main.controller';

import './styles/brand.less';

const baseModules = [
  uiRouterExtend,
  uiViewSlide,
  httpHelper,
  filters,
  qnFooter,
  qnHeader,
  qnSidebar,
  qnNavbar,
  qnLoading,
  qnSearchBox,
  statusTag,
  utils,
  qnModal,
  validateSameWith,
  uiPagination
];

const MODULE_NAME = 'qos.common';
(new Register(MODULE_NAME, [ ...baseModules ]))
  .run(run)
  .config(config)
  .config(routerConfig)
  .filter('userRoleFilter', userRoleFilter)
  .filter('commonStatusFilter', commonStatusFilter)
  .filter('commonStatusTypeFilter', commonStatusTypeFilter)
  .service('systemConfigService', SystemConfigService)
  .service('commonCheckModalService', CommonCheckModalService)
  .controller('MainController', MainController)
  .directive('navbarActions', navbarActions)
  .directive('imageSelector', imageSelector)
  .directive('singleImageSelector', singleImageSelector)
  .constant('typeConstants', typeConstants)
  .filter('type', type)
  .build(angular);

export default MODULE_NAME;

import './styles.less';

import { qnSidebar } from './sidebar.directive';

let collapse = require('angular-ui-bootstrap/src/collapse');
let tooltip = require('angular-ui-bootstrap/src/tooltip');

let MODULE_NAME = 'base.qnSidebar';

angular.module(MODULE_NAME, [collapse, tooltip])
.directive('qnSidebar', qnSidebar);

export default MODULE_NAME;

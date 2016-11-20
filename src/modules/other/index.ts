import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { ShowcaseController } from './components/showcase/showcase.controller';
import { MissionController } from './components/mission/mission.controller';
import { FacultyController } from './components/faculty/faculty.controller';
import { FacultyDetailController } from './components/faculty-detail/faculty-detail.controller';

let MODULE_NAME = 'evm.other';
(new Register(MODULE_NAME, []))
  .config(routes)
  .controller('ShowcaseController', ShowcaseController)
  .controller('MissionController', MissionController)
  .controller('FacultyController', FacultyController)
  .controller('FacultyDetailController', FacultyDetailController)
  .build(angular);

export default MODULE_NAME;

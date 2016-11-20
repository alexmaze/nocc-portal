/** @ngInject */
export function routes(
  $stateProvider: angular.ui.IStateProvider) {

  $stateProvider
    .state('main.showcase', {
      url: 'showcase',
      template: require('./components/showcase/showcase.html'),
      controller: 'ShowcaseController as ctrl',
      data: {
        icon: 'fa-university',
        title: '首页'
      }
    })
    .state('main.mission', {
      url: 'mission',
      template: require('./components/mission/mission.html'),
      controller: 'MissionController as ctrl',
      data: {
        icon: 'fa-flag-o',
        title: '使命'
      }
    })
    // .state('main.faculty', {
    //   url: 'faculty',
    //   template: require('./components/faculty/faculty.html'),
    //   controller: 'FacultyController as ctrl',
    //   data: {
    //     icon: 'fa-id-card-o',
    //     title: '关于 全体'
    //   }
    // })
    // .state('main.lab', {
    //   url: 'lab',
    //   template: require('./components/lab/lab.html'),
    //   controller: 'LabController as ctrl',
    //   data: {
    //     icon: 'fa-diamond',
    //     title: '实验室'
    //   }
    // })
    ;
}

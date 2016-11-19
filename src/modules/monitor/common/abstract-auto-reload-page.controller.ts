export abstract class AbstractAutoReloadPageController {

  REFRESH_INTERVAL: number = 30 * 1000;
  isFocused: boolean;
  timer: angular.IPromise<void>;

  /* @ngInject */
  constructor(protected $interval: angular.IIntervalService, protected $scope: any) {

    this.isFocused = true;
    window.onfocus = () => {
      // console.log('!!FOCUSED!!');
      this.isFocused = true;
    };
    window.onblur = () => {
      // console.log('!!BLURED!!');
      this.isFocused = false;
    };

    $scope.$on('$destroy', (event: any) => {
      if (this.timer !== undefined) {
        this.$interval.cancel(this.timer);
        // console.log('canceled!', this.timer);
      }
      window.onfocus = undefined;
      window.onblur = undefined;
    });
    this.startAutoRefresh();
  }


  startAutoRefresh() {
    if (this.timer === undefined) {
      this.timer = this.$interval( () => {
        if (this.isFocused) {
          this.autoLoad();
        }
      }, this.REFRESH_INTERVAL);
    }
  }

  abstract autoLoad();

}

import * as _ from 'lodash';
import * as moment from 'moment';
import './storage-item.less';

/* @ngInject */
export function storageItem() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=ngModel'
    },
    template: require('./storage-item.html'),
    controller: StorageItemController,
    controllerAs: 'ctrl'
  };
}

class StorageItemController {
  keys: IKeys;
  dateRangeOptions = {
    minDate: moment().subtract(7, 'days')
  };
  dateRange = {
    start: moment().subtract(7, 'days'),
    end: moment()
  };
  chart?: echarts.IEchart<qos.chart.IChartData[]>;
  translatePromise: angular.IPromise<void>;

  /* @ngInject */
  constructor(
    private unitConvertUtil: base.IUnitCovertUtil,
    private echartsUtil: echarts.IEchartsUtilService,
    private $echarts: echarts.IEchartService,
    private httpHelper: base.IHttpHelper,
    private $scope: IScope,
    private $translate: angular.translate.ITranslateService) {
    this.translatePromise = this.loadTransLang();
    this.init();
    this.bind();
  }

  init() {
    this.chart = this._newChart('16:9');
  }

  bind() {
    this.translatePromise.then(() => {
      this.$scope.$watch('ctrl.dateRange.end', (newV: any, oldV: any) => {
        if (newV !== oldV) {
          this.load();
        }
      });
    });
  }

  /**
   * 加载翻译信息
   *
   * @returns
   *
   * @memberOf StatisticsController
   */
  loadTransLang() {
    return this.$translate([
      'USED_CAPACITY',
      'AVALIABLE_CAPACITY',
      'TOTAL_CAPACITY']).then((translations: any) => {
      this.keys = translations;
    });
  }

  expand() {
    if (!this.chart.data) {
      this.load();
    }
  }

  load() {
    this.translatePromise.then(() => {
      this.chart.isLoading = true;
      const labels = [
        'total',
        'free'];
      const texts = [
        this.keys.TOTAL_CAPACITY,
        this.keys.AVALIABLE_CAPACITY];

      let start = this.cleanTime(this.dateRange.start);
      let end = this.cleanTime(this.dateRange.end);

      this.httpHelper.call<any>('GET', '/api/storage/metric', {
        type: this.$scope.data.type,
        size: 'large',
        start,
        end
      }).$promise.success(res => {
        let formatter = this.unitConvertUtil.toFilesize;
        this.chart.data = res as any;
        this.chart.config = this.createMultiLineChart(
          'TB',
          undefined,
          [res.total, res.free],
          labels,
          texts,
          value => formatter.call(this.unitConvertUtil, value, 0, 'T'),
          value => formatter.call(this.unitConvertUtil, parseFloat(value), 2, 'T'));
        this.chart.isLoading = false;
      });
    });
  }


  /**
   * 构造多曲线图
   *
   * @param {echarts.IEchart<any>} chart
   * @param {string} unit
   * @param {string} title
   * @param {*} values
   * @param {string[]} keys
   * @param {string[]} labels
   * @param {(value: any) => string} yAxisValueFormatter
   * @param {(value: any) => string} tooltipValueFormatter
   *
   * @memberOf MonitorCapacityController
   */
  createMultiLineChart(
    unit: string,
    title: string,
    values: any,
    keys: string[],
    labels: string[],
    yAxisValueFormatter: (value: any) => string,
    tooltipValueFormatter: (value: any) => string) {

    let config = this.echartsUtil.commonLineConfig(unit);
    _.set(config, 'title.text', title);
    _.set(config, 'legend.data', labels);
    _.set(config, 'xAxis.interval', (3600 * 24));
    _.set(config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D'));
    _.set(config, 'yAxis.axisLabel.formatter', (value) => yAxisValueFormatter(value));
    _.set(config, 'yAxis.min', 0);
    _.set(config, 'yAxis.minInterval', 1);
    _.set(config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D'),
      tooltipValueFormatter
    ));
    _.set(config, 'series', keys.map((key, i) => {
      return {
        name: labels[i],
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        areaStyle: {normal: {}},
        data: (values[i] && values[i][0] && values[i][0].values) ? values[i][0].values : []
      };
    }));
    return config;
  }

  _newChart(dimension: string = '2:1') {
    return {
      id: this.$echarts.generateInstanceIdentity(),
      dimension: dimension,
      config: {}
    };
  }

  /**
   * 重置时间上某一部分
   *
   * @param {*} from
   * @param {number} [hours=0]
   * @param {number} [minutes=0]
   * @param {number} [seconds=0]
   * @returns
   *
   * @memberOf StatisticsController
   */
  cleanTime(from: any, hours: number = 0, minutes: number = 0, seconds: number = 0) {
    let time = moment(from);
    time.seconds(seconds);
    time.minutes(minutes);
    time.hours(hours);
    return time.unix();
  }
}

interface IScope extends angular.IScope {
  data: {
    key: string;
    type: string;
    total: number;
    free: number;
    isShow: boolean;
  };
}

interface IKeys {
  USED_CAPACITY: string;
  AVALIABLE_CAPACITY: string;
  TOTAL_CAPACITY: string;
}

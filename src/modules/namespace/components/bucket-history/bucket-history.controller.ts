import './bucket-history.less';
import * as moment from 'moment';

import rangepicker from 'opdev-front/src/components/datetime-picker-range';

interface IDateRange {
  start: any;
  end: any;
}

interface IKeys {
  OBJECT_NUMBER: string;
  STORAGE: string;
}

export class BucketHistoryController {

  dateRangeOptions = {
    minDate: moment().subtract(7, 'days')
  };
  dateRange: IDateRange = {
    start: moment().subtract(7, 'days'),
    end: moment()
  };

  bucketId: string;
  keys: IKeys;
  storageChart: echarts.IEchart<qos.chart.IChartData>;
  objNumChart: echarts.IEchart<qos.chart.IChartData>;

  /** @ngInject */
  constructor(
    private $state: angular.ui.IStateService,
    private unitConvertUtil: base.IUnitCovertUtil,
    private echartsUtil: echarts.IEchartsUtilService,
    private $echarts: echarts.IEchartService,
    protected $rootScope: angular.IRootScopeService,
    protected httpHelper: base.IHttpHelper,
    protected $translate: angular.translate.ITranslateService,
    protected $scope: angular.IScope) {

    let params = $state.params as any;
    this.bucketId = params.bk;

    this.init();
    this.loadTransLang().then(() => {
      this.loadData();
    });
  }

  init() {
    this.storageChart = this._newChart();
    this.objNumChart = this._newChart();

    this.$scope.$watch('ctrl.dateRange.end', (newV: any, oldV: any) => {
      if (newV !== oldV) {
        this.loadData();
      }
    });
  }

  loadTransLang() {
    return this.$translate([
      'STORAGE',
      'OBJECT_NUMBER']).then((translations: any) => {
      this.keys = translations;
    });
  }

  loadData() {
    this.loadChart('STORAGE', this.storageChart);
    this.loadChart('OBJECT_NUMBER', this.objNumChart);
  }

  /**
   * 加载数据并且调用绘图
   *
   * @param {string} title
   * @param {echarts.IEchart<qos.chart.IChartData>} chart
   *
   * @memberOf StatisticsController
   */
  loadChart(title: string, chart: echarts.IEchart<qos.chart.IChartData>) {
    let key;
    let start = this.cleanTime(this.dateRange.start);
    let end = this.cleanTime(this.dateRange.end);
    let range = '1d';
    switch (title) {
      case 'STORAGE':
        key = 'capacity';
        break;
      case 'OBJECT_NUMBER':
        key = 'object';
        break;
    }

    chart.isLoading = true;
    this.httpHelper.call<any>('GET', '/api/bucket/:id', {
      statistics: true,
      name: key,
      total: true,
      start,
      end,
      range,
      size: 'large',
      id: this.bucketId
    }).$promise.success((data: any) => {
      chart.isLoading = false;
      chart.data = data;
      this.buildChart(title, chart);
    });
  }


  /**
   * 画图
   *
   * @param {string} title
   * @param {echarts.IEchart<any>} chart
   *
   * @memberOf StatisticsController
   */
  buildChart(title: string, chart: echarts.IEchart<any>) {
    let values;
    let tempFormatter;
    switch (title) {
      case 'STORAGE':
        tempFormatter = this.unitConvertUtil.toFilesize;
        this.createSingleLineChart(chart, '', this.keys[title], chart.data[0].values,
        value => tempFormatter.call(this.unitConvertUtil, value, 0),
        value => tempFormatter.call(this.unitConvertUtil, parseFloat(value), 2));
        break;
      case 'OBJECT_NUMBER':
        tempFormatter = this.unitConvertUtil.toCount;
        this.createSingleLineChart(chart, '', this.keys[title], chart.data[0].values,
        value => tempFormatter.call(this.unitConvertUtil, value, 0),
        value => tempFormatter.call(this.unitConvertUtil, parseFloat(value), 2));
        break;
    }
  }
  createSingleLineChart(chart: echarts.IEchart<any>, unit: string, title: string, values: any,
    yAxisValueFormatter: (value: any) => string,
    tooltipValueFormatter: (value: any) => string) {
    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', [title]);
    _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D'));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => yAxisValueFormatter(value));
    _.set(chart.config, 'yAxis.splitNumber', 3);
    _.set(chart.config, 'yAxis.minInterval', 1);
    _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D'),
      tooltipValueFormatter
    ));
    _.set(chart.config, 'series', [
      {
        name: title,
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        // areaStyle: {normal: {}},
        data: values
      }
    ]);
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

  _newChart(dimension: string = '2:1') {
    return {
      id: this.$echarts.generateInstanceIdentity(),
      dimension: dimension,
      config: {}
    };
  }

  static getDepns() {
    return [rangepicker];
  }
}

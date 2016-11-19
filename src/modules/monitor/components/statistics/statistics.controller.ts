import './statistics.less';
import * as moment from 'moment';

import rangepicker from 'opdev-front/src/components/datetime-picker-range';

interface IDateRange {
  start: any;
  end: any;
}

interface IKeys {
  BANDWIDTH: string;
  UPLOAD_BANDWIDTH: string;
  DOWNLOAD_BANDWIDTH: string;
  UPLOAD_REQUESTS_NUM: string;
  DOWNLOAD_REQUESTS_NUM: string;
  DEMETE_REQUESTS_NUM: string;
  FLOW: string;
  TOTAL_NUM: string;
  FAIL_NUM: string;
  UPLOAD: string;
  DOWNLOAD: string;
  STORAGE: string;
  RECYCLED_DAILY: string;
}

export class StatisticsController  {

  tabs = ['STORAGE', 'REQUEST_NUM', 'FLOW', 'BANDWIDTH', 'RECYCLED_DAILY'];
  currentTab: 'STORAGE' | 'REQUEST_NUM' | 'FLOW' | 'BANDWIDTH' | 'RECYCLED_DAILY';
  keys: IKeys;

  dateRangeOptions = {
    minDate: moment().subtract(7, 'days')
  };
  dateRange: IDateRange = {
    start: moment().subtract(7, 'days'),
    end: moment()
  };
  range: '1d' | '10m' = '1d';

  storageTab: {
    storageChart: echarts.IEchart<qos.chart.IChartData>;
  };
  recycledDailyTab: {
    recycledChart: echarts.IEchart<qos.chart.IChartData>;
  };
  requestNumTab: {
    uploadChart: echarts.IEchart<qos.chart.IChartData>;
    downloadChart: echarts.IEchart<qos.chart.IChartData>;
    deleteChart: echarts.IEchart<qos.chart.IChartData>;
  };
  flowTab: {
    uploadTotal: string;
    downloadTotal: string;
    flowChart: echarts.IEchart<qos.chart.IChartData>;
  };
  bandwidthTab: {
    uploadPeak: string;
    downloadPeak: string;
    bandwidthChart: echarts.IEchart<qos.chart.IChartData>;
  };

  /* @ngInject */
  constructor(
    private unitConvertUtil: base.IUnitCovertUtil,
    private echartsUtil: echarts.IEchartsUtilService,
    private $echarts: echarts.IEchartService,
    protected $rootScope: angular.IRootScopeService,
    protected httpHelper: base.IHttpHelper,
    protected $translate: angular.translate.ITranslateService,
    protected $scope: angular.IScope) {
    this.init();
    this.loadTransLang().then(() => {
      this.bindTabs();
    });
  }

  /**
   * 初始化每个页面数据
   *
   *
   * @memberOf StatisticsController
   */
  init() {
    this.storageTab = {
      storageChart: this._newChart()
    };
    this.recycledDailyTab = {
      recycledChart: this._newChart()
    };
    this.requestNumTab = {
      uploadChart: this._newChart(),
      downloadChart: this._newChart(),
      deleteChart: this._newChart()
    };
    this.flowTab = {
      uploadTotal: '- b',
      downloadTotal: '- b',
      flowChart: this._newChart()
    };
    this.bandwidthTab = {
      uploadPeak: '- bps',
      downloadPeak: '- bps',
      bandwidthChart: this._newChart()
    };
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
      'BANDWIDTH',
      'UPLOAD_BANDWIDTH',
      'DOWNLOAD_BANDWIDTH',
      'FLOW',
      'UPLOAD_REQUESTS_NUM',
      'DOWNLOAD_REQUESTS_NUM',
      'DEMETE_REQUESTS_NUM',
      'STORAGE',
      'TOTAL_NUM',
      'FAIL_NUM',
      'UPLOAD',
      'DOWNLOAD',
      'RECYCLED_DAILY']).then((translations: any) => {
      this.keys = translations;
    });
  }

  /**
   * 绑定事件
   *
   *
   * @memberOf StatisticsController
   */
  bindTabs() {
    this.$scope.$watch('ctrl.currentTab', (nowTab: string, preTab: string) => {
      this.onUpdate();
    });
    this.currentTab = 'STORAGE';

    this.$scope.$watch('ctrl.dateRange.end', (newV: any, oldV: any) => {
      if (newV !== oldV) {
        this.onUpdate(true);
      }
    });
    this.$scope.$watch('ctrl.range', () => {
      switch (this.currentTab) {
        case 'FLOW':
        case 'BANDWIDTH':
          this.onUpdate(true);
        break;
      }
    });
  }

  /**
   * 触发更新页面数据
   *
   * @param {boolean} [force=false]
   *
   * @memberOf StatisticsController
   */
  onUpdate(force: boolean = false) {
    this.loadData(this.currentTab, force);
  }

  /**
   * 更换页面时触发，加载页面
   *
   * @param {string} tab
   * @param {boolean} force
   *
   * @memberOf StatisticsController
   */
  loadData(tab: string, force: boolean) {
    switch (this.currentTab) {
      case 'STORAGE':
          this.loadChart(this.currentTab, 'STORAGE', this.storageTab.storageChart);
        break;
      case 'REQUEST_NUM':
          this.loadChart(this.currentTab, 'UPLOAD_REQUESTS_NUM', this.requestNumTab.uploadChart);
          this.loadChart(this.currentTab, 'DOWNLOAD_REQUESTS_NUM', this.requestNumTab.downloadChart);
          this.loadChart(this.currentTab, 'DEMETE_REQUESTS_NUM', this.requestNumTab.deleteChart);
        break;
      case 'FLOW':
          this.loadChart(this.currentTab, 'FLOW', this.flowTab.flowChart);
        break;
      case 'BANDWIDTH':
          this.loadChart(this.currentTab, 'BANDWIDTH', this.bandwidthTab.bandwidthChart);
        break;
      case 'RECYCLED_DAILY':
          this.loadChart(this.currentTab, 'RECYCLED_DAILY', this.recycledDailyTab.recycledChart);
        break;
    }
  }

  /**
   * 加载数据病调用绘图
   *
   * @param {string} tab
   * @param {string} title
   * @param {echarts.IEchart<qos.chart.IChartData>} chart
   *
   * @memberOf StatisticsController
   */
  loadChart(tab: string, title: string, chart: echarts.IEchart<qos.chart.IChartData>) {
    let key;
    let start = this.cleanTime(this.dateRange.start);
    let end = this.cleanTime(this.dateRange.end);
    let range = this.range;
    switch (title) {
      case 'BANDWIDTH':
        key = 'bandwidth';
        break;
      case 'FLOW':
        key = 'trafficio';
        break;
      case 'UPLOAD_REQUESTS_NUM':
        range = '1d';
        key = 'uprequest';
        break;
      case 'DOWNLOAD_REQUESTS_NUM':
        range = '1d';
        key = 'downloadreqeust';
        break;
      case 'DEMETE_REQUESTS_NUM':
        range = '1d';
        key = 'deleterequest';
        break;
      case 'STORAGE':
        range = '1d';
        key = 'capacity';
        break;
      case 'RECYCLED_DAILY':
        range = '1d';
        key = 'compact';
        break;
    }

    if (title === 'BANDWIDTH' || title === 'FLOW') {
      if (range !== '1d') {
        let today = this.cleanTime(new Date());
        if (today === end) {
          end = moment().unix();
        }
      }
    }

    chart.isLoading = true;
    this.httpHelper.call<any>('GET', '/api/statistics/metric', {
      name: key,
      total: true,
      start,
      end,
      size: 'large',
      range
    }).$promise.success((data: any) => {
      chart.isLoading = false;
      if ((title === 'BANDWIDTH' || title === 'FLOW') && this.range !== range) {
        return;
      }
      chart.data = data;
      this.buildChart(title, chart);
    });
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
      case 'RECYCLED_DAILY':
        this.absData(chart.data);
      case 'STORAGE':
        this.createSingleLineChart(chart, '', this.keys[title], (chart.data && chart.data[0]) ? chart.data[0].values : []);
        break;
      case 'UPLOAD_REQUESTS_NUM':
      case 'DOWNLOAD_REQUESTS_NUM':
      case 'DEMETE_REQUESTS_NUM':
        values = {};
        values[this.keys.TOTAL_NUM] = chart.data.total;
        values[this.keys.FAIL_NUM] = chart.data.failed;
        this.createMultiLineChart(chart, '',
          this.keys[title], values, [this.keys.TOTAL_NUM, this.keys.FAIL_NUM],
          value => this.unitConvertUtil.toCount(value, 0),
          value => this.unitConvertUtil.toCount(parseFloat(value), 2));
        break;
      case 'BANDWIDTH':
        tempFormatter = this.unitConvertUtil.toBandwidth;
      case 'FLOW':
        tempFormatter = this.unitConvertUtil.toFlow;
        values = {};
        values[this.keys.UPLOAD] = chart.data.up;
        values[this.keys.DOWNLOAD] = chart.data.down;
        this.computeExtraInfo(title, chart.data.up, chart.data.down);
        this.createMultiLineChart(chart, '',
          this.keys[title], values, [this.keys.UPLOAD, this.keys.DOWNLOAD],
          value => tempFormatter.call(this.unitConvertUtil, value, 0),
          value => tempFormatter.call(this.unitConvertUtil, parseFloat(value), 2));
        break;
    }
  }

  /**
   * 用于 流量、宽带 页面计算额外信息
   *
   * @param {string} chartTitleKey
   * @param {*} uploadData
   * @param {*} downloadData
   *
   * @memberOf StatisticsController
   */
  computeExtraInfo(chartTitleKey: string, uploadData: any, downloadData: any) {

    if (chartTitleKey === 'BANDWIDTH') {
      let uploadPeak = 0;
      let downloadPeak = 0;
      if (uploadData && uploadData[0] && uploadData[0].values) {
        uploadData[0].values.forEach((v: [number, string]) => {
          let val = parseFloat(v[1]);
          if (!isNaN(val) && val > uploadPeak) {
            uploadPeak = val;
          }
        });
      }
      if (downloadData && downloadData[0] && downloadData[0].values) {
        downloadData[0].values.forEach((v: [number, string]) => {
          let val = parseFloat(v[1]);
          if (!isNaN(val) && val > downloadPeak) {
            downloadPeak = val;
          }
        });
      }
      this.bandwidthTab.uploadPeak = this.unitConvertUtil.toBandwidth(uploadPeak, 2);
      this.bandwidthTab.downloadPeak = this.unitConvertUtil.toBandwidth(downloadPeak, 2);
    } else if (chartTitleKey === 'FLOW') {
      let uploadTotal = 0;
      let downloadTotal = 0;
      if (uploadData && uploadData[0] && uploadData[0].values) {
        uploadData[0].values.forEach((v: [number, string]) => {
          let val = parseFloat(v[1]);
          if (!isNaN(val)) {
            uploadTotal += val;
          }
        });
      }
      if (downloadData && downloadData[0] && downloadData[0].values) {
        downloadData[0].values.forEach((v: [number, string]) => {
          let val = parseFloat(v[1]);
          if (!isNaN(val)) {
            downloadTotal += val;
          }
        });
      }
      this.flowTab.uploadTotal = this.unitConvertUtil.toFlow(uploadTotal, 2);
      this.flowTab.downloadTotal = this.unitConvertUtil.toFlow(downloadTotal, 2);

    }
  }

  /**
   * 正值化图表数据
   *
   * @param {*} datas
   *
   * @memberOf StatisticsController
   */
  absData(datas: any) {
    datas.forEach((element: any) => {
      if (angular.isArray(element.values)) {
        element.values.forEach((value: [number, string]) => {
          let temp = parseFloat(value[1]);
          if (!isNaN(temp) && temp < 0) {
            value[1] = '0';
          }
        });
      }
    });
  }

  createSingleLineChart(chart: echarts.IEchart<any>, unit: string, title: string, values: any) {
    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', [title]);
    _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D'));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => this.unitConvertUtil.toFilesize(value, 0));
    _.set(chart.config, 'yAxis.splitNumber', 3);
    _.set(chart.config, 'yAxis.minInterval', 1);
    _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D'),
      value => this.unitConvertUtil.toFilesize(parseFloat(value), 2)
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

  createMultiLineChart(
    chart: echarts.IEchart<any>, unit: string,
    title: string, values: any, keys: string[],
    yAxisValueFormatter: (value: any) => string,
    tooltipValueFormatter: (value: any) => string) {

    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', keys);
    _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D'));
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => yAxisValueFormatter(value));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.splitNumber', 4);
    _.set(chart.config, 'yAxis.minInterval', 1);
    if (this.range === '1d') {
      _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
        value => moment.unix(value).format('M/D'),
        tooltipValueFormatter
      ));
    } else {
      _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
        value => moment.unix(value).format('M/D HH:mm'),
        tooltipValueFormatter
      ));
    }

    _.set(chart.config, 'series', keys.map(key => {
      return {
        name: key,
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        data: (values && values[key] && values[key][0]) ? values[key][0].values : []
      };
    }));
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

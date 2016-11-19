import * as moment from 'moment';

type ResourceTab = 'PERFORMANCE' | 'REAL_TIME_STATUS';

interface IKeys {
  RESPONSE_TIME: string;
  TRANSACTION_NUMBER: string;
  THROUGHPUT: string;
  ERROR_RATE: string;
  UPSTREAM: string;
  DOWNSTREAM: string;
}

interface IRealTimeTab<T> {
  data?: T[];
  loaded?: boolean;
}

interface IPerformanceTab {
  data?: any;
  loaded?: boolean;
  charts?: qos.resources.IPerformanceCharts;
}

interface IHostPerformanceData {
  [host: string]: qos.resources.IPerformanceData;
}

interface IAbstractResourcePageDepns {
  $q: angular.IQService;
  $echarts: echarts.IEchartService;
  $interval: angular.IIntervalService;
  $scope: angular.IScope;
  $translate: angular.translate.ITranslateService;
  $rootScope: angular.IRootScopeService;
  $state: angular.ui.IStateService;
  unitConvertUtil: base.IUnitCovertUtil;
  echartsUtil: echarts.IEchartsUtilService;
  httpHelper: base.IHttpHelper;
}

interface IAbstractResourceOptions {
  isAutoReload: boolean;
  isGlobalCache: boolean;
  cacheKeyGenerator?: ($state: angular.ui.IStateService) => string;
}

/**
 * 公共资源页面控制器
 *
 * @export
 * @abstract
 * @class AbstractResourcePage
 * @template T 列表数据类型
 */
export abstract class AbstractResourcePage<T> {

  REFRESH_INTERVAL: number = 30 * 1000;
  isFocused: boolean;
  timer: angular.IPromise<void>;

  keys: IKeys;
  tabs: ResourceTab[] = ['REAL_TIME_STATUS', 'PERFORMANCE'];
  currentTab: ResourceTab;

  startDate: number;
  endDate: number;

  performanceTab: IPerformanceTab;
  realtimeTab: IRealTimeTab<T>;

  /**
   * Creates an instance of AbstractResourcePage.
   *
   * @param {IAbstractResourcePageDepns} depns Angular 依赖
   * @param {boolean} [isAutoReload=true] 是否开启自动刷新功能
   * @param {boolean} [isGlobalCache=false] 是否要全局缓存数据，方便页面跳转回来的时候不刷新
   *
   * @memberOf AbstractResourcePage
   */
  constructor(
    protected depns: IAbstractResourcePageDepns,
    protected options: IAbstractResourceOptions = {
      isAutoReload: true,
      isGlobalCache: false}) {

    this.loadTransLang().then(() => {
      this.init();
    });

  }

  loadTransLang() {
    return this.depns.$translate([
      'RESPONSE_TIME',
      'TRANSACTION_NUMBER',
      'THROUGHPUT',
      'ERROR_RATE',
      'UPSTREAM',
      'DOWNSTREAM']).then((translations: any) => {
      this.keys = translations;
    });
  }

  init() {
    this.performanceTab = {
      loaded: false,
      charts: {
        responseTime: this._newChart(),
        transaction: this._newChart(),
        errorRate: this._newChart(),
        throughput: this._newChart()
      }
    };
    this.realtimeTab = {
      loaded: false
    };

    this.bindAutoRefresh();
    this.bindTabs();
  }

  bindTabs(defaultTab: ResourceTab = 'REAL_TIME_STATUS') {
    this.depns.$scope.$watch('ctrl.currentTab', (nowTab: string, preTab: string) => {
      this.loadData(true);
    });
    this.currentTab = defaultTab;
  }

  onDateChange(startDate: number, endDate: number) {
    this.startDate = startDate;
    this.endDate = endDate;

    if (this.currentTab === 'PERFORMANCE') {
      this.loadData(false);
    }
  }

  onUpdate() {
    this.loadData(false);
  }

  setLoadingStatus(isLoading: boolean) {
    if (this.currentTab === 'PERFORMANCE') {
      this.performanceTab.loaded = !isLoading;
      this.performanceTab.charts.errorRate.isLoading = isLoading;
      this.performanceTab.charts.responseTime.isLoading = isLoading;
      this.performanceTab.charts.throughput.isLoading = isLoading;
      this.performanceTab.charts.transaction.isLoading = isLoading;
    } else if (this.currentTab === 'REAL_TIME_STATUS') {
      this.realtimeTab.loaded = !isLoading;
    }
  }

  loadData(isFromCache: boolean = true) {
    const tab = this.currentTab;
    if (tab === 'PERFORMANCE') {
      if (this.startDate === undefined || this.endDate === undefined) {
        return;
      }
    }

    let cacheKey;
    if (this.options.cacheKeyGenerator) {
      cacheKey = `__cached_monitor_${tab}_${this.options.cacheKeyGenerator(this.depns.$state)}`;
    } else {
      cacheKey = `__cached_monitor_${tab}_${this.depns.$state.href(this.depns.$state.current.name, this.depns.$state.params)}`;
    }

    let cache = this.depns.$rootScope[cacheKey];
    let promise = this.depns.$q.resolve(cache);

    this.setLoadingStatus(true);

    if (!isFromCache || cache === undefined || !this.options.isGlobalCache) {
      console.debug('DO LOAD', 'isFromCache:', isFromCache, 'isGlobalCache:', this.options.isGlobalCache);
      promise = this.doLoad(tab);
    } else {
      console.debug('HIT CACHE!', cacheKey);
    }
    promise.then(ret => {
      this.depns.$rootScope[cacheKey] = ret;

      if (tab === 'PERFORMANCE') {
        this.performanceTab.data = ret;
      } else if (tab === 'REAL_TIME_STATUS') {
        this.realtimeTab.data = ret;
      }

      this.afterLoad(tab, ret);

      this.setLoadingStatus(false);
    });
  }

  /**
   * 从数据源加载数据
   *
   * @abstract
   * @param {ResourceTab} type
   * @returns {angular.IPromise<any>}
   *
   * @memberOf AbstractResourcePage
   */
  abstract doLoad(type: ResourceTab): angular.IPromise<any>;

  /**
   * 加载完成后对数据处理
   *
   * @abstract
   * @param {ResourceTab} type
   * @param {*} data
   *
   * @memberOf AbstractResourcePage
   */
  abstract afterLoad(type: ResourceTab, data: any);

  bindAutoRefresh() {
    this.isFocused = true;
    window.onfocus = () => {
      this.isFocused = true;
    };
    window.onblur = () => {
      this.isFocused = false;
    };
    this.depns.$scope.$on('$destroy', (event: any) => {
      if (this.timer !== undefined) {
        this.depns.$interval.cancel(this.timer);
      }
      window.onfocus = undefined;
      window.onblur = undefined;
    });
    this.startAutoRefresh();
  }

  startAutoRefresh() {
    if (this.timer === undefined) {
      this.timer = this.depns.$interval( () => {
        if (this.currentTab === 'REAL_TIME_STATUS' && this.isFocused && this.options.isAutoReload) {
          this.loadData(false);
        }
      }, this.REFRESH_INTERVAL);
    }
  }

  _newChart(dimension: string = '3:1') {
    return {
      id: this.depns.$echarts.generateInstanceIdentity(),
      dimension: dimension,
      config: {}
    };
  }

  buildPerformanceCharts(data: qos.resources.IPerformanceData) {
    // load charts data
    let throughputData = {};
    throughputData[this.keys.UPSTREAM] = data.throughputUp;
    throughputData[this.keys.DOWNSTREAM] = data.throughputDown;
    this.performanceTab.charts.throughput.data = throughputData;
    this.performanceTab.charts.errorRate.data = data.errorRate;
    this.performanceTab.charts.responseTime.data = data.responseTime;
    this.performanceTab.charts.transaction.data = data.transaction;

    this.createSingleLineChart(this.performanceTab.charts.responseTime, 'ms',
      this.keys.RESPONSE_TIME, data.responseTime[0] ? data.responseTime[0].values : [],
      value => value.toFixed(0) + ' ms',
      value => value.toFixed(2) + ' ms');
    this.createSingleLineChart(this.performanceTab.charts.transaction, 'tps',
      this.keys.TRANSACTION_NUMBER, data.transaction[0] ? data.transaction[0].values : [],
      value => value.toFixed(0) + ' tps',
      value => value.toFixed(2) + ' tps');
    this.createSingleLineChart(this.performanceTab.charts.errorRate, '%',
      this.keys.ERROR_RATE, data.errorRate[0] ? data.errorRate[0].values : [],
      value => value.toFixed(1) + ' %',
      value => value.toFixed(3) + ' %', 0.1);

    this.createMultiLineChart(this.performanceTab.charts.throughput, 'bps',
      this.keys.THROUGHPUT, throughputData, [this.keys.UPSTREAM, this.keys.DOWNSTREAM],
      value => this.depns.unitConvertUtil.toBandwidth(value, 0),
      value => this.depns.unitConvertUtil.toBandwidth(value, 2));

  }

  buildHostPerformanceCharts(data: IHostPerformanceData) {
    let responseTimeData = {};
    let responseTimeKeys = [];

    let transactionNumData = {};
    let transactionNumKeys = [];

    let errorRateData = {};
    let errorRateKeys = [];

    let throughputData = {};
    let throughputKeys = [];

    Object.keys(data).forEach(host => {
      let responseTimeKey = host;
      responseTimeKeys.push(responseTimeKey);
      responseTimeData[responseTimeKey] = data[host].responseTime;

      let transactionNumKey = host;
      transactionNumKeys.push(transactionNumKey);
      transactionNumData[transactionNumKey] = data[host].transaction;

      let errorRateKey = host;
      errorRateKeys.push(errorRateKey);
      errorRateData[errorRateKey] = data[host].errorRate;

      let throughputKeyUp = host + ' ' + this.keys.UPSTREAM;
      let throughputKeyDown = host + ' ' + this.keys.DOWNSTREAM;
      throughputKeys.push(throughputKeyUp);
      throughputKeys.push(throughputKeyDown);
      throughputData[throughputKeyUp] = data[host].throughputUp;
      throughputData[throughputKeyDown] = data[host].throughputDown;

    });

    this.performanceTab.charts.responseTime.data = responseTimeData;
    this.performanceTab.charts.transaction.data = transactionNumData;
    this.performanceTab.charts.errorRate.data = errorRateData;
    this.performanceTab.charts.throughput.data = throughputData;

    this.createMultiLineChart(this.performanceTab.charts.responseTime, 'ms',
      this.keys.RESPONSE_TIME, responseTimeData, responseTimeKeys,
      value => value.toFixed(0) + ' ms',
      value => value.toFixed(2) + ' ms');
    this.createMultiLineChart(this.performanceTab.charts.transaction, 'tps',
      this.keys.TRANSACTION_NUMBER, transactionNumData, transactionNumKeys,
      value => value.toFixed(0) + ' tps',
      value => value.toFixed(2) + ' tps');
    this.createMultiLineChart(this.performanceTab.charts.errorRate, '%',
      this.keys.ERROR_RATE, errorRateData, errorRateKeys,
      value => value.toFixed(1) + ' %',
      value => value.toFixed(3) + ' %', 0.1);
    this.createMultiLineChart(this.performanceTab.charts.throughput, 'bps',
      this.keys.THROUGHPUT, throughputData, throughputKeys,
      value => this.depns.unitConvertUtil.toBandwidth(value, 0),
      value => this.depns.unitConvertUtil.toBandwidth(value, 2));
  }

  createSingleLineChart(
    chart: echarts.IEchart<any>, unit: string, title: string, values: any,
    yAxisValueFormatter: (value: number) => string,
    tooltipValueFormatter: (value: number) => string,
    minInterval: number = 1) {
    chart.config = this.depns.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', [title]);
    // _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.axisLabel.formatter', value => yAxisValueFormatter(parseFloat(value)));
    _.set(chart.config, 'yAxis.splitNumber', 3);
    _.set(chart.config, 'yAxis.minInterval', minInterval);
    _.set(chart.config, 'tooltip.formatter', this.depns.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D HH:mm:ss'),
      value => tooltipValueFormatter(parseFloat(value))
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
    tooltipValueFormatter: (value: any) => string,
    minInterval: number = 1) {

    chart.config = this.depns.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', keys);
    // _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => yAxisValueFormatter(parseFloat(value)));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.splitNumber', 4);
    _.set(chart.config, 'yAxis.minInterval', minInterval);
    _.set(chart.config, 'tooltip.formatter', this.depns.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D HH:mm'),
      value => tooltipValueFormatter(parseFloat(value))
    ));

    _.set(chart.config, 'series', keys.map(key => {
      return {
        name: key,
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        data: values[key][0] ? values[key][0].values : []
      };
    }));
  }

  gotoServer(host: string) {
    let newPage = window.open('', '_blank') as any;
    this.depns.httpHelper.call<{ id: string; }>('GET', '/api/server/getid', {host})
      .$promise.success((data: {id: string}) => {
        const url = this.depns.$state.href('main.monitor.servers.detail', data);
        // window.open(url);
        newPage.location = url;
    });
  }
}

import * as moment from 'moment';

export abstract class ResourceMMMInstanceController {

  tabs = ['PERFORMANCE'];
  currentTab = 'PERFORMANCE';
  startDate: number;
  endDate: number;

  performanceTab: qos.resources.IPerformanceCharts;

  instance: { host?: string; } = {};
  instances: { host?: string; }[][];

  type: 'mongo' | 'mysql' | 'memcached';
  chartNames = {
    mongo: ['connections', 'crate', 'qps', 'tps', 'networkIo', 'request'],
    mysql: ['connections', 'iops', 'qps', 'tps', 'networkIo', 'slowquery'],
    memcached: ['memoryUsedRate', 'gethits', 'getmisses', 'qps', 'gethitedRate', 'items', 'connections', 'evictedtotal']
  };
  chartTitleKeyMap = {
    'connections': 'TOTAL_CONNECTION_NUM', // 总连接数 个
    'crate': 'CONNECTION_USED_RATE', // 连接数使用率 %
    'qps': 'QPS', // 每秒 sql 执行次数  次/s
    'tps': 'TPS', // 每秒事务处理数  次/s
    'networkIo': 'NETWORK_IO', // 网络 io 分上行下行 Mbps
    'request': 'REQUEST_NUM',
    'iops': 'IOPS', // 次/s
    'slowquery': 'SLOW_QUERY_NUM', // SQL慢查询个数 次
    'memoryUsedRate': 'MEMORY_LOAD',
    'gethits': 'GET_HITES_NUM', // 请求成功的总次数 次/s
    'getmisses': 'GET_MISSES_NUM', // 请求失败的总次数 次/s
    'gethitedRate': 'GET_HITED_RATE', // 读取命中率 %
    'items': 'RECORD_NUM', // 记录数 个
    'evictedtotal': 'EVICATED_KV_NUM', // 逐出KV数 次/s
  };
  keys: {
    [key: string]: string;
  };

  beforeLoadChartPromise: angular.IPromise<void>;

  /* @ngInject */
  constructor(
    protected $rootScope: angular.IRootScopeService,
    protected $q: angular.IQService,

    protected unitConvertUtil: base.IUnitCovertUtil,
    protected echartsUtil: echarts.IEchartsUtilService,
    protected $echarts: echarts.IEchartService,
    protected $interval: angular.IIntervalService,
    protected $scope: angular.IScope,
    protected $translate: angular.translate.ITranslateService,
    protected $state: angular.ui.IStateService,
    protected httpHelper: base.IHttpHelper) {
      this.beforeLoadChartPromise = this.loadTransLang().then(() => {
        this.initParams();
        this.loadInstance();
        this.initCharts();
      });
  }

  initParams() {
    this.instance.host = (this.$state.params as any).host;
    this.type = this.$state.current.name.split('.')[3] as any;
  }

  initCharts() {
    this.performanceTab = {};
    this.chartNames[this.type].forEach(chartName => {
      this.performanceTab[chartName] = this._newChart();
    });
  }

  loadTransLang() {
    let keys = Object.keys(this.chartTitleKeyMap).map(key => this.chartTitleKeyMap[key]);
    return this.$translate(keys).then((translations: any) => {
      this.keys = translations;
    });
  }

  loadPerformance() {
    if (this.startDate === undefined || this.endDate === undefined) {
      return;
    }
    this.chartNames[this.type].forEach(chartName => {
      this.performanceTab[chartName].isLoading = true;
      if (chartName === 'networkIo') {
        // Received
        // Transmite
        let uploadPromise = this.doLoadChart('networkIoTransmited');
        let downloadPromise = this.doLoadChart('networkIoReceived');
        this.$q.all([uploadPromise, downloadPromise]).then(datas => {
          this.performanceTab[chartName].data = datas;
          this.buildChart(chartName, datas);
        });
      } else if (chartName === 'qps' && this.type === 'memcached') {
        // 'getqps': 'GET_QPS', // 读取每秒 sql 执行次数 qps
        // 'setqps': 'SET_QPS', // 更新每秒 sql 执行次数 qps
        let totalPromise = this.doLoadChart('qps');
        let readPromise = this.doLoadChart('getqps');
        let updatePromise = this.doLoadChart('setqps');
        this.$q.all([totalPromise, readPromise, updatePromise]).then(datas => {
          this.performanceTab[chartName].data = datas;
          this.buildChart(chartName, datas);
        });
      } else {
        this.doLoadChart(chartName).then(data => {
          this.performanceTab[chartName].data = data;
          this.buildChart(chartName, data);
        });
      }
    });
  }

  buildChart(chartName: string, data: any) {
    let datas;
    switch (chartName) {
      case 'memoryUsedRate':
      case 'crate':
      case 'gethitedRate':
        // %
        this._createSingleLineChart(this.performanceTab[chartName], '%',
          this.keys[this.chartTitleKeyMap[chartName]], data[0].values,
          value => value.toFixed(1) + ' %',
          value => value.toFixed(3) + ' %');
        break;
      case 'tps':
        // 次/s
        this._createSingleLineChart(this.performanceTab[chartName], 'tps',
          this.keys[this.chartTitleKeyMap[chartName]], data[0].values,
          value => value.toFixed(0) + ' tps',
          value => value.toFixed(2) + ' tps');
        break;
      case 'iops':
      case 'gethits':
      case 'getmisses':
      case 'evictedtotal':
        // 次/s
        this._createSingleLineChart(this.performanceTab[chartName], '/s',
          this.keys[this.chartTitleKeyMap[chartName]], data[0].values,
          value => value.toFixed(0) + ' /s',
          value => value.toFixed(2) + ' /s');
        break;
      case 'items':
      case 'slowquery':
      case 'connections':
        // 个
        this._createSingleLineChart(this.performanceTab[chartName], '',
          this.keys[this.chartTitleKeyMap[chartName]], data[0].values,
          value => value.toFixed(0) + '',
          value => value.toFixed(0) + '');
        break;
      case 'request':
        // 'REQUEST_NUM', 次
        datas = [];
        let keys = [];
        data.forEach(subData => {
          keys.push(subData.metric.type);
          datas.push(subData.values);
        });
        this._createMultiLineChart(this.performanceTab[chartName], '',
          this.keys[this.chartTitleKeyMap[chartName]], datas, keys,
          value => value.toFixed(2),
          value => value.toFixed(2));
        break;
      case 'networkIo':
        // 'NETWORK_IO', // 网络 io 分上行下行 Mbps
        datas = data.map(data => data[0].values);
        this._createMultiLineChart(this.performanceTab[chartName], 'Mbps',
          this.keys[this.chartTitleKeyMap[chartName]], datas, ['upload', 'download'],
          value => this.unitConvertUtil.toBandwidth(value, 0),
          value => this.unitConvertUtil.toBandwidth(value, 2));
        break;
      case 'qps':
        if (this.type === 'memcached') {
          datas = data.map(data => data[0].values);
          this._createMultiLineChart(this.performanceTab[chartName], 'qps',
            this.keys[this.chartTitleKeyMap[chartName]], datas, ['total', 'read', 'update'],
            value => this.unitConvertUtil.toCount(value, 0) + ' qps',
            value => this.unitConvertUtil.toCount(value, 2) + ' qps');
        } else {
          this._createSingleLineChart(this.performanceTab[chartName], 'qps',
            this.keys[this.chartTitleKeyMap[chartName]], data[0].values,
            value => value.toFixed(0) + ' qps',
            value => value.toFixed(2) + ' qps');
        }
        break;
    }

    this.performanceTab[chartName].isLoading = false;
  }

  doLoadChart(name: string) {
    return this.httpHelper.call<qos.resources.IPerformanceData>('GET', `/api/app/${this.type}/metric`, {
      host: this.instance.host,
      start: this.startDate,
      end: this.endDate,
      size: 'large',
      name
    }).$promise;
  }

  loadInstance() {
    this.httpHelper.call<any>('GET', `/api/app/${this.type}`)
      .$promise.success((data: any) => {
      if (this.type === 'memcached') {
        this.instances = data;
      } else {
        let temp = [];
        data.forEach(insts => {
          insts.forEach(inst => {
            temp.push(inst);
          });
        });
        this.instances = temp;
      }
    });
  }

  goInstance(instance: any) {
    this.$state.go('^.instance', { host: instance.host });
  }

  onDateChange(startDate: number, endDate: number) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.beforeLoadChartPromise.then(() => {
      switch (this.currentTab) {
        case 'PERFORMANCE':
          this.loadPerformance();
          break;
      }
    });
  }

  _newChart(dimension: string = '3:1') {
    return {
      id: this.$echarts.generateInstanceIdentity(),
      dimension: dimension,
      config: {}
    };
  }

  _createSingleLineChart(
    chart: echarts.IEchart<any>, unit: string, title: string, values: any,
    yAxisValueFormatter: (value: number) => string,
    tooltipValueFormatter: (value: number) => string) {
    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', [title]);
    // _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.axisLabel.formatter', value => yAxisValueFormatter(parseFloat(value)));
    _.set(chart.config, 'yAxis.splitNumber', 3);
    _.set(chart.config, 'yAxis.minInterval', 1);
    _.set(chart.config, 'yAxis.min', 0);
    _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
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

  _createMultiLineChart(
    chart: echarts.IEchart<any>, unit: string,
    title: string, values: any, keys: string[],
    yAxisValueFormatter: (value: any) => string,
    tooltipValueFormatter: (value: any) => string) {

    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', keys);
    // _.set(chart.config, 'xAxis.interval', (3600 * 24));
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => yAxisValueFormatter(parseFloat(value)));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.splitNumber', 4);
    _.set(chart.config, 'yAxis.minInterval', 1);
    _.set(chart.config, 'yAxis.min', 0);
    _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D HH:mm'),
      value => tooltipValueFormatter(parseFloat(value))
    ));

    let series = [];
    for (let i = 0; i < keys.length; i++) {
      series.push({
        name: keys[i],
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        data: values[i]
      });
    }
    _.set(chart.config, 'series', series);
  }
}

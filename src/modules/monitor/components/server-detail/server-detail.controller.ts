import './server-detail.less';
import * as moment from 'moment';
import { AbstractAutoReloadPageController } from '../../common/abstract-auto-reload-page.controller';

export class ServerDetailController extends AbstractAutoReloadPageController {
  server: qos.server.IServer;
  servers: base.IPageData<qos.server.IServer>;
  serversLoaded: boolean;

  tabs = ['OVERVIEW', 'DISK', 'PROCESS'];
  currentTab: 'OVERVIEW' | 'DISK' | 'PROCESS';

  startDate: number;
  endDate: number;

  orderKey: string = '-cpu';

  overviewTab: IOverviewTab;
  diskTab: IDisksTab;
  processTab: IProcessesTab;

  keys: {
    CPU_LOAD: string;
    LOAD_AVERAGE: string;
    MEMORY_LOAD: string;
    NETWORK_IO: string;
    RECEIVED: string;
    TRANSIMITED: string;
  };

  loadServerPromise: angular.IHttpPromise<qos.server.IServer>;

  /* @ngInject */
  constructor(
    private unitConvertUtil: base.IUnitCovertUtil,
    private echartsUtil: echarts.IEchartsUtilService,
    private $echarts: echarts.IEchartService,
    protected $state: angular.ui.IStateService,
    protected $q: angular.IQService,
    protected $rootScope: angular.IRootScopeService,
    protected httpHelper: base.IHttpHelper,
    protected $translate: angular.translate.ITranslateService,
    protected $scope: angular.IScope,
    protected $interval: angular.IIntervalService) {
    super($interval, $scope);

    this.init();
    this.loadTransLang().then(() => {
      this.loadServer();
      this.bindTabs();
    });
  }

  init() {
    this.overviewTab = {
      cpuChart: this._newChart(),
      loadChart: this._newChart(),
      memoryChart: this._newChart(),
      networkChart: this._newChart(),
    };
    this.diskTab = {};
    this.processTab = {
      cpuChart: this._newChart('2:1'),
      memoryChart: this._newChart('2:1')
    };
  }

  _newChart(dimension: string = '3:1') {
    return {
      id: this.$echarts.generateInstanceIdentity(),
      dimension: dimension,
      config: {}
    };
  }

  loadTransLang() {
    let keys = [
      'CPU_LOAD',
      'LOAD_AVERAGE',
      'MEMORY_LOAD',
      'NETWORK_IO',
      'RECEIVED',
      'TRANSIMITED'];
    return this.$translate(keys).then((translations: any) => {
      this.keys = translations;
    });
  }

  loadServer() {
    // get server id
    this.server = {
      id: (this.$state.params as any).id as string
    };
    // load server
    this.loadServerPromise = this.httpHelper.call<qos.server.IServer>('GET', '/api/server/:id', {
      id: this.server.id
    }).$promise.success((data: qos.server.IServer) => {
      this.server = data;
    });
    // load server list
    this.serversLoaded = false;
    this.httpHelper.call<base.IPageData<qos.server.IServer>>('GET', '/api/server', {
      page: 1,
      perpage: 10000
    }).$promise.success((data: base.IPageData<qos.server.IServer>) => {
      this.servers = data;
      this.serversLoaded = true;
    });
  }

  goServer(server: qos.server.IServer) {
    this.$state.go('^.detail', { id: server.id });
  }

  autoLoad() {
    if (this.currentTab === 'PROCESS') {
      this.loadProcesses();
    }
  }

  bindTabs() {
    this.$scope.$watch('ctrl.currentTab', (nowTab: string, preTab: string) => {
      this.loadResourceId();
      switch (nowTab) {
        case 'OVERVIEW':
          this.loadOverview();
          break;
        case 'DISK':
          this.loadDisks();
          break;
        case 'PROCESS':
          this.loadProcesses();
          break;
      }
    });
    this.currentTab = 'OVERVIEW';

    this.$scope.$watch('ctrl.processTab.selectedProcess', () => {
      this.loadProcessesCharts();
    });
  }

  onDateChange(startDate: number, endDate: number) {
    this.startDate = startDate;
    this.endDate = endDate;
    switch (this.currentTab) {
      case 'OVERVIEW':
        this.loadOverview();
        break;
      case 'DISK':
        break;
      case 'PROCESS':
        this.loadProcessesCharts();
        break;
    }
  }

  loadOverview() {
    if (this.startDate === undefined || this.endDate === undefined) {
      return;
    }

    this.overviewTab.cpuChart.isLoading = true;
    this.overviewTab.loadChart.isLoading = true;
    this.overviewTab.memoryChart.isLoading = true;
    this.overviewTab.networkChart.isLoading = true;

    let id = this.server.id;
    this.httpHelper.call<qos.server.IServerOverview>('GET', '/api/server/:id', {
      id,
      overview: true,
      start: this.startDate,
      end: this.endDate,
      size: 'large'
    }).$promise.success((data: qos.server.IServerOverview) => {
      this.overviewTab.cpuChart.isLoading = false;
      this.overviewTab.loadChart.isLoading = false;
      this.overviewTab.memoryChart.isLoading = false;
      this.overviewTab.networkChart.isLoading = false;

      this.overviewTab.cpuChart.data = data.cpu[0];
      this.overviewTab.loadChart.data = data.loadAverage[0];
      this.overviewTab.memoryChart.data = data.memory[0];

      this.overviewTab.networkChart.data = {};
      this.overviewTab.networkChart.data[this.keys.RECEIVED] = data.networkIoReceived;
      this.overviewTab.networkChart.data[this.keys.TRANSIMITED] = data.networkIoTransmited;

      this.buildOverviewCharts();
    });
  }

  loadDisks() {
    let id = this.server.id;
    this.diskTab.loaded = false;
    const diskPromise = this.httpHelper.call<any[]>('GET', '/api/server/:id', {
      id,
      disk: true
    }).$promise.then((data: any[]) => {
      this.diskTab.data = data;
      this.diskTab.loaded = true;
      return data;
    });

    const typePromise = this.httpHelper.call<{key: string; value: string}[]>('GET', '/api/server/:id', {
      id,
      diskType: true
    }).$promise;

    this.$q.all([diskPromise, typePromise]).then(res => {
      const types = res[1] as {key: string; value: string}[];
      this.diskTab.data.forEach(disk => {
        disk.diskType = types[disk.mountpoint];
      });
    });
  }

  loadProcesses() {
    let id = this.server.id;
    this.processTab.loaded = false;
    this.httpHelper.call<any[]>('GET', '/api/server/:id', {
      id,
      process: true
    }).$promise.success((data: any[]) => {
      this.processTab.data = data;
      this.processTab.loaded = true;

      if (this.processTab.selectedProcess === undefined && this.processTab.data && this.processTab.data.length > 0) {
        this.processTab.selectedProcess = this.processTab.data[0].name;
      }
    });
  }

  buildOverviewCharts() {
    this.createSingleLineChart(this.overviewTab.cpuChart, '%', this.keys.CPU_LOAD);
    this.createSingleLineChart(this.overviewTab.loadChart, '', this.keys.LOAD_AVERAGE);
    this.createSingleLineChart(this.overviewTab.memoryChart, '%', this.keys.MEMORY_LOAD);
    this.createMultiLineChart(this.overviewTab.networkChart, 'bps', this.keys.NETWORK_IO, [this.keys.RECEIVED, this.keys.TRANSIMITED]);
  }

  createSingleLineChart(chart: echarts.IEchart<any>, unit: string, title: string) {
    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', [title]);
    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    if (unit === '%') {
      _.set(chart.config, 'yAxis.min', 0);
      _.set(chart.config, 'yAxis.max', 100);
    }
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'series', [
      {
        name: title,
        type: 'line',
        smoth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: false,
        data: chart.data ? chart.data.values : []
      }
    ]);
    _.set(chart.config, 'yAxis.axisLabel.formatter', `{value} ${unit}`);
  }

  createMultiLineChart(chart: echarts.IEchart<any>, unit: string, title: string, keys: string[]) {
    chart.config = this.echartsUtil.commonLineConfig(unit);
    _.set(chart.config, 'title.text', title);
    _.set(chart.config, 'legend.data', keys);

    _.set(chart.config, 'xAxis.axisLabel.formatter', (value) => moment.unix(value).format('M/D H:mm'));
    _.set(chart.config, 'yAxis.axisLabel.formatter', (value) => this.unitConvertUtil.sizeFormatter(value, 0, 'K', 'bps', 1024));
    _.set(chart.config, 'yAxis.splitLine.show', true);
    _.set(chart.config, 'yAxis.splitNumber', 4);
    _.set(chart.config, 'yAxis.minInterval', 1);
    _.set(chart.config, 'tooltip.formatter', this.echartsUtil.customTooltipFormator(
      value => moment.unix(value).format('M/D HH:mm'),
      value => this.unitConvertUtil.sizeFormatter(parseFloat(value), 2, 'K', 'bps', 1024)
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
        data: chart.data[key][0].values
      };
    }));
  }

  loadProcessesCharts() {
    if (this.startDate === undefined || this.endDate === undefined || !this.processTab.selectedProcess) {
      return;
    }
    let id = this.server.id;
    this.processTab.cpuChart.isLoading = true;
    this.processTab.memoryChart.isLoading = true;

    let cpuPromise = this.httpHelper.call<qos.chart.IChartData[]>('GET', '/api/server/:id', {
      id,
      process: true,
      name: this.processTab.selectedProcess,
      start: this.startDate,
      end: this.endDate,
      type: 'cpu',
      size: 'large'
    }).$promise;
    let memoryPromise = this.httpHelper.call<qos.chart.IChartData[]>('GET', '/api/server/:id', {
      id,
      process: true,
      name: this.processTab.selectedProcess,
      start: this.startDate,
      end: this.endDate,
      type: 'memory',
      size: 'large'
    }).$promise;

    this.$q.all([cpuPromise, memoryPromise]).then(([cpu, memory]: any) => {
      this.processTab.cpuChart.isLoading = false;
      this.processTab.memoryChart.isLoading = false;
      this.processTab.cpuChart.data = cpu[0];
      this.processTab.memoryChart.data = memory[0];

      this.createSingleLineChart(this.processTab.cpuChart, '%', this.keys.CPU_LOAD);
      this.createSingleLineChart(this.processTab.memoryChart, '%', this.keys.MEMORY_LOAD);
    });
  }

  manualUpdate() {
    switch (this.currentTab) {
      case 'OVERVIEW':
        this.loadOverview();
        break;
      case 'DISK':
        this.loadDisks();
        break;
      case 'PROCESS':
        this.loadProcesses();
        break;
    }
  }

  changeOrder(key: string) {
    let seq: boolean;
    let oldKey = this.orderKey;
    if (this.orderKey.charAt(0) === '-') {
      seq = false;
      oldKey = this.orderKey.substring(1);
    } else {
      seq = true;
    }

    if (oldKey === key) {
      seq = !seq;
    } else {
      seq = true;
    }
    this.orderKey = `${seq ? '' : '-'}${key}`;
  }

  // 下面是事件相关的
  loadResourceId() {
    this.$rootScope.loadResourceIdPromise = this.$q((
      resolve: angular.IQResolveReject<string>,
      reject: angular.IQResolveReject<string>) => {
      this.processResourceId(resolve, reject);
    });
  }
  processResourceId(
    resolve: angular.IQResolveReject<string>,
    reject: angular.IQResolveReject<string>) {
    this.loadServerPromise.success((server: qos.server.IServer) => {
      let host = server.host;
      switch (this.currentTab) {
        case 'OVERVIEW':
          break;
        case 'DISK':
          host += '/disk';
          break;
        case 'PROCESS':
          host += '/process';
          break;
      }
      resolve(host);
    }).error((e: any) => {
      reject(e);
    });
  }
}

interface IOverviewTab {
  cpuChart: echarts.IEchart<qos.chart.IChartData>;
  loadChart: echarts.IEchart<qos.chart.IChartData>;
  memoryChart: echarts.IEchart<qos.chart.IChartData>;
  networkChart: echarts.IEchart<any>;
}

interface IDisksTab {
  loaded?: boolean;
  data?: any[];
}

interface IProcessInfo {
  name: string;
}

interface IProcessesTab {
  loaded?: boolean;
  data?: IProcessInfo[];
  selectedProcess?: string;
  cpuChart: echarts.IEchart<qos.chart.IChartData>;
  memoryChart: echarts.IEchart<qos.chart.IChartData>;
}

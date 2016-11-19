import * as _ from 'lodash';
import * as moment from 'moment';
import { UserRole } from '../../../common/components/user/user-role.filter';

import './capacity.less';

import dateRange from 'opdev-front/src/components/date-range';
import echartsLib from 'opdev-front/src/components/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export class MonitorCapacityController {
  dateRangeOptions = {
    minDate: moment().subtract(7, 'days')
  };
  tabs = [{
    title: 'OVERVIEW',
    isShow: true
  }, {
    title: 'DETAIL',
    isShow: false
  }, {
    title: 'LAYERED_MIGRATION',
    isShow: false
  }];
  currentTab: ITab;
  keys: IKeys;

  // 概览
  overviewTab: {
    overviewChart?: echarts.IEchart<IOverview>;
    trendChart?: echarts.IEchart<qos.chart.IChartData[]>;
    isShow: boolean;
    dateRange: IDateRange;
  };

  // 详情
  detailTab: {
    isShow: boolean;
    charts: {
      key: string;
      type: string;
      isShow: boolean;
      total?: number;
      free?: number;
    }[];
  };

  // 分层迁移
  lmTab: {
    data?: ILMData;
    _newData?: ILMData;
    isShow: boolean;
  };

  /* @ngInject */
  constructor(
    private ApiGlobalConfig: qos.api.IGlobalConfigService,
    private $uibModal: angular.ui.bootstrap.IModalService,
    private $q: angular.IQService,
    private userService: qos.service.IUserService,
    private $scope: angular.IScope,
    private unitConvertUtil: base.IUnitCovertUtil,
    private echartsUtil: echarts.IEchartsUtilService,
    private $echarts: echarts.IEchartService,
    private httpHelper: base.IHttpHelper,
    private $translate: angular.translate.ITranslateService) {
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
    this.overviewTab = {
      overviewChart: this._newChart('2:1'),
      trendChart: this._newChart('16:9'),
      isShow: true,
      dateRange: {
        start: moment().subtract(7, 'days'),
        end: moment()
      }
    };
    this.lmTab = {
      isShow: false
    };
    this.detailTab = {
      isShow: false,
      charts: [{
        key: 'PFD_SSD',
        type: 'ssdpfd',
        isShow: false
      }, {
        key: 'PFD',
        type: 'satapfd',
        isShow: false
      }, {
        key: 'EBD',
        type: 'ebd',
        isShow: false
      }, {
        key: 'PFD_EBD',
        type: 'pfdebd',
        isShow: false
      }]
    };

    const user = this.userService.userInfo();
    this.ApiGlobalConfig.get().then(config => {
      // 分层迁移 tab 显示条件：系统管理员，且 storage type 为 pfd 和 ebd 同时存在
      this.lmTab.isShow = (user.role === UserRole.system_admin) && (config.storageType > 2);
      this.tabs[2].isShow = this.lmTab.isShow;
      // 详情 tab 显示条件：非单纯 pfd 部署
      this.detailTab.isShow = config.storageType > 1;
      this.tabs[1].isShow = this.detailTab.isShow;
      // 详情 tab 各个图表显示条件
      if (config.storageType === 2) {
        // Separated SSD PFD and SATA PFD
        this.detailTab.charts[0].isShow = true;
        this.detailTab.charts[1].isShow = true;
      } else if (config.storageType === 3) {
        // Separated SATA PFD and EBD
        this.detailTab.charts[1].isShow = true;
        this.detailTab.charts[2].isShow = true;
      } else if (config.storageType === 4) {
        // Separated SSD PFD, SATA PFD, EBD
        this.detailTab.charts[0].isShow = true;
        this.detailTab.charts[1].isShow = true;
        this.detailTab.charts[2].isShow = true;
      } else if (config.storageType === 5) {
        // Mixed SATA PFD, EBD
        this.detailTab.charts[1].isShow = true;
        this.detailTab.charts[2].isShow = true;
        this.detailTab.charts[3].isShow = true;
      } else if (config.storageType === 6) {
        // SSD PFD and (Mixed SATA PFD EBD)
        this.detailTab.charts[0].isShow = true;
        this.detailTab.charts[1].isShow = true;
        this.detailTab.charts[2].isShow = true;
        this.detailTab.charts[3].isShow = true;
      }
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
    this.currentTab = 'OVERVIEW';

    this.$scope.$watch('ctrl.overviewTab.dateRange.end', (newV: any, oldV: any) => {
      if (newV !== oldV) {
        this.loadOverviewTrend();
      }
    });
  }

  /**
   * 触发更新页面数据
   *
   *
   * @memberOf StatisticsController
   */
  onUpdate() {
    this.loadData(this.currentTab);
  }

  /**
   * 更换 TAB 时触发，加载页面
   *
   * @param {string} tab
   *
   * @memberOf StatisticsController
   */
  loadData(tab: string) {
    switch (this.currentTab) {
      case 'OVERVIEW':
        // reset time
        this.overviewTab.dateRange = {
          start: moment().subtract(7, 'days'),
          end: moment()
        };
        this.loadOverviewTop();
        this.loadOverviewTrend();
        break;
      case 'LAYERED_MIGRATION':
        this.loadLMConfig();
        break;
      case 'DETAIL':
        this.loadDetailOverview();
        break;
    }
  }

// 详情
  /**
   * 详情 overview 信息
   *
   *
   * @memberOf MonitorCapacityController
   */
  loadDetailOverview() {
    this.httpHelper.call<IOverview>('GET', '/api/storage/overview', {
      detail: true
    }).$promise.success(res => {
      this.detailTab.charts[0].total = res.ssdPfdTotal;
      this.detailTab.charts[0].free = res.ssdPfdFree;
      this.detailTab.charts[1].total = res.sataPfdTotal;
      this.detailTab.charts[1].free = res.sataPfdFree;
      this.detailTab.charts[2].total = res.ebdTotal;
      this.detailTab.charts[2].free = res.ebdFree;
      this.detailTab.charts[3].total = res.pfdEbdTotal;
      this.detailTab.charts[3].free = res.pfdEbdFree;
    });
  }

// 概览
  /**
   * 概览 top
   *
   *
   * @memberOf MonitorCapacityController
   */
  loadOverviewTop() {
    this.overviewTab.overviewChart.isLoading = true;
    this.httpHelper.call<IOverview>('GET', '/api/storage/overview').$promise.success(res => {
      res.used = res.total - res.free;
      this.overviewTab.overviewChart.data = res;

      this.overviewTab.overviewChart.config = this.echartsUtil.commonPieConfig();
      _.set(this.overviewTab.overviewChart.config, 'series', [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          label: {
            normal: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#ffffff',
              borderWidth: 1
            }
          },
          data: [
            { value: res.total - res.free, name: this.keys.USED_CAPACITY },
            { value: res.free, name: this.keys.AVALIABLE_CAPACITY }
          ]
        }
      ]);
      this.overviewTab.overviewChart.isLoading = false;
    });
  }

  /**
   * 概览 trend
   *
   *
   * @memberOf MonitorCapacityController
   */
  loadOverviewTrend() {
    this.overviewTab.trendChart.isLoading = true;
    const labels = [
      'total',
      'free'];
    const texts = [
      this.keys.TOTAL_CAPACITY,
      this.keys.AVALIABLE_CAPACITY];

    let start = this.cleanTime(this.overviewTab.dateRange.start);
    let end = this.cleanTime(this.overviewTab.dateRange.end);

    let loadPromises = this.httpHelper.call<any>('GET', '/api/storage/metric', {
      type: 'summary',
      size: 'large',
      start,
      end
    }).$promise.success(res => {

      let formatter = this.unitConvertUtil.toFilesize;
      this.overviewTab.trendChart.data = res as any;
      this.overviewTab.trendChart.config = this.createMultiLineChart(
        'TB',
        undefined,
        [res.total, res.free],
        labels,
        texts,
        value => formatter.call(this.unitConvertUtil, value, 0, 'T'),
        value => formatter.call(this.unitConvertUtil, parseFloat(value), 2, 'T'));
      this.overviewTab.trendChart.isLoading = false;
    });

  }



// 分层迁移页面
  loadLMConfig() {
    this.lmTab.data = undefined;
    this.ApiGlobalConfig.get(true).then(conf => {
      this.lmTab.data = conf;
      this.lmTab._newData = _.assign({}, conf);
    });
  }

  changeLMTime() {
    let scope: any = this.$scope.$new(true);
    scope.hours = _.range(25);
    scope.range = {
      start: this.lmTab._newData.pfdMigrateStart + '',
      end: this.lmTab._newData.pfdMigrateEnd + ''
    };
    scope.validate = (start, end) => parseInt(start, 10) < parseInt(end, 10);
    return this.openModal(scope, require('./migration-window-modal.html'), undefined, 'sm').result.then(res => {
      this.lmTab._newData.pfdMigrateStart = parseInt(res.start, 10);
      this.lmTab._newData.pfdMigrateEnd = parseInt(res.end, 10);
      (this as any).configForm.$setDirty(true);
    });
  }

  saveLMConfig() {
    this.ApiGlobalConfig.patch(this.lmTab._newData).then(conf => {
      this.lmTab.data = conf;
      this.resetLMConfig();
    });
  }

  resetLMConfig() {
    this.lmTab._newData = _.assign({}, this.lmTab.data);
    (this as any).configForm.$setPristine();
  }

// 工具函数
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


  openModal(scope: any, template: string, controller: any, size: base.ui.QnModalSize = 'md') {
    return this.$uibModal.open({
      template,
      scope,
      windowClass: 'modal-center',
      size,
      backdrop: false,
      keyboard: false,
      controller,
      controllerAs: 'ctrl'
    });
  };

  static getDepns() {
    return [dateRange, echartsLib];
  }
}

// 类型定义
interface IOverview {
  total: number;
  free: number;
  used: number;
  sataPfdTotal?: number;
  sataPfdFree?: number;
  ssdPfdTotal?: number;
  ssdPfdFree?: number;
  ebdTotal?: number;
  ebdFree?: number;
  pfdEbdTotal?: number;
  pfdEbdFree?: number;
}

type ILMData = qos.IGlobalConfig;

type ITab = 'OVERVIEW' | 'DETAIL' | 'LAYERED_MIGRATION';

interface IDateRange {
  start: any;
  end: any;
}

interface IKeys {
  USED_CAPACITY: string;
  AVALIABLE_CAPACITY: string;
  TOTAL_CAPACITY: string;
}

/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/opdev-front/src/index.d.ts" />
/// <reference path="./modules/api/index.d.ts" />


declare namespace angular {
  interface IRootScopeService {
    loadResourceIdPromise: angular.IPromise<string>;
  }
}

declare namespace qos {
  interface ISystemConfig {
    complexMode: boolean
  }
  interface IGlobalConfig {
    pfdMigrate: boolean;
    pfdMigrateStart: number;
    pfdMigrateEnd: number;
    alertStatus: boolean;
    alertAppId: string;
    storageType: number;
  }
}

declare namespace qos.user {
    interface IUser {
      _id?: string;
      name?: string;
      role?: number;
      namespace?: string;
      isSuper?: boolean;
      password?: string;
      _scope?: string;
    }

    interface IUserActions {
      'edit': (user: IUser) => void;
      'delete': (selectedUsers: IUser[]) => void;
      'password': (user: IUser) => void;
    }

    interface IUserExplorerBinding {
      userModel: IUser[];
      userLoaded: boolean;
      userActions: IUserActions;
    }

    interface IFeature {
      name: string;
      icon?: string;
      state?: string;
      features?: IFeature[];
    }
}



declare namespace qos {
  interface IImage {
    description: String,
    description_en: String,
    url: String
  }

  interface IEvent {
    title: string;
    location: string;
    content: string;

    title_en: string;
    location_en: string;
    content_en: string;

    _id?: string;
    time: String;
    created: Date;
    poster: IImage[];
    images: IImage[];
  }

  interface IShowcase {
    images: IImage[];
  }

}




declare namespace qos.service {
  interface IUserService {
    cacheUserInfo: (user: qos.user.IUser) => void;
    userInfo: () => qos.user.IUser;
    clearUserInfo: () => void;
    checkSessionSync: () => void;
  }

  interface ISystemConfigService {
    config: qos.ISystemConfig;
    fetch: () => void;
  }

  interface ICommonCheckModalData {
    title: string;
    msg: string;
    checks: {
      regexp: RegExp;
      errorMsg: string;
    }[];
  }

  interface ICommonCheckModalService {
    build: (ICommonCheckModalData) => angular.IPromise<any>;
  }
}

declare namespace qos.chart {
  interface IChartData {
    metric: any;
    values: [number, string][];
  }
}

declare namespace qos.namespace {

    interface INamespace {
      id: string;
      name?: string;
      usedCap?: number;
      objNum?: number;
      admin?: qos.user.IUser;
      bucketNum?: number;
    }

    interface INamespaceActions {
      'buckets': (ns: INamespace) => void;
      'keys': (ns: INamespace) => void;
      'history': (ns: INamespace) => void;
      'edit': (ns: INamespace) => void;
      'delete': (ns: INamespace) => void;
    }

    interface IUserExplorerBinding {
      nsModel: INamespace[];
      nsLoaded: boolean;
      nsActions: INamespaceActions;
    }
}

declare namespace qos.key {

  interface IKey {
    id: string,
    createTime?: Date;
    accessKey?: string;
    secretKey?: string;
    status?: string;
  }

  // interface IKeyActions {
  //   'suspend': (key: IKey) => void;
  // }
}

declare namespace qos.bucket {
  interface IBucket {
    id: string;
    name?: string;
    usedCap?: number;
    objNum?: number;
  }
  interface IBucketActions {
    'history': (bucket: IBucket) => void;
    'edit': (bucket: IBucket) => void;
    'delete': (bucket: IBucket) => void;
    'domain': (bucket: IBucket) => void;
  }

  interface IUserExplorerBinding {
    bucketModel: IBucket[];
    bucketLoaded: boolean;
    bucketActions: IBucketActions;
  }
  type IDomain = string;
}

declare namespace qos.server {
  interface IServer {
    id?: string;
    name?: string;
    status?: string;
    machine?: string;
    sysname?: string;
    version?: string;
    host?: string;
    summary?: {
      cpu?: number;
      diskFree?: number;
      diskHealth?: {
        bad?: number;
        good?: number;
        suspect: number;
      };
      diskIo?: number;
      memoryFree?: number;
      processStatus?: {
        RUNNING?: number;
      };
    };
  }

  interface IServerOverview {
    cpu?: qos.chart.IChartData[];
    loadAverage?: qos.chart.IChartData[];
    memory?: qos.chart.IChartData[];
    networkIoReceived?: qos.chart.IChartData[];
    networkIoTransmited?: qos.chart.IChartData[];
  }
}

declare namespace qos.events {
  interface IEvent {
    id: string;
    ignored: boolean;
    type: string;
    subType: string;
    level: string;
    createdAt: number;
    eventId: string;
    metadata: {
      value?: any;
      threshold?: any;
      server?: string;
      process?: string;
      disk?: string;
      group?: string;
      set?: string;
      instance?: string;
    },
    summary: string
  }
}

declare namespace qos.resources {

  interface IGroup {
    id: string;
    repair: number;
    hosts: [[string, string]];
    hostnames: string[];
  }

  interface ISet {
		id: number;
		hosts: [[string, string]];
		path: [string, string, string];
		readOnly: boolean;
    repair: boolean[];
  }

  interface IInstance {
    instance?: string;
    host?: string;
  }

  interface IPerformanceData {
    responseTime?: qos.chart.IChartData[];
    transaction?: qos.chart.IChartData[];
    errorRate?: qos.chart.IChartData[];
    throughputUp?: qos.chart.IChartData[];
    throughputDown?: qos.chart.IChartData[];
    [key: string]: qos.chart.IChartData[];
  }

  interface IPerformanceCharts {
    responseTime?: echarts.IEchart<IPerformanceData | any>;
    transaction?: echarts.IEchart<IPerformanceData | any>;
    errorRate?: echarts.IEchart<IPerformanceData | any>;
    throughput?: echarts.IEchart<IPerformanceData | any>;
    [key: string]: echarts.IEchart<IPerformanceData | any>;
  }

}

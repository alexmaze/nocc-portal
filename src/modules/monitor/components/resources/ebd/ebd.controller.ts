import './ebd.less';

interface IStats {
  total: number;
  available: number;
}

interface IInstance {
  host: string;
  status: string;
  role?: string;      // for ebd master
  diskTotal?: number; // for ebd storage
  diskBad?: number;   // for ebd storage
}

interface IDisk {
  id: string;
  path: string;
  status: string;
}

interface IDiskListPanel {
  isShow: boolean;
  isLoading: boolean;
  disks: IDisk[];
  top?: number;
  left?: number;
}

interface IData {
  /**
   * for ebdM and ecb
   */
  stats?: IStats;
  /**
   * for ebdS
   */
  statsI?: IStats;
  /**
   * for ebdS
   */
  statsD?: IStats;
  insts?: IInstance[];
  instsLoading?: boolean;
}

export class ResourceEBDController {

  ebdM: IData = {};
  ebdS: IData = {};
  ecb: IData = {};

  diskListPanel: IDiskListPanel = { isShow: false, isLoading: false, disks: [] };

  /* @ngInject */
  constructor(
    private $document: angular.IDocumentService,
    private $state: angular.ui.IStateService,
    private $scope: angular.IScope,
    private httpHelper: base.IHttpHelper) {

    this.loadAllStats();
    this.bind();
  }

  loadAllStats() {
    this.ebdM.stats = this.doLoad('ebdmaster', 'stats') as IStats;
    this.ecb.stats = this.doLoad('ecb', 'stats') as IStats;
    this.ebdS.statsI = this.doLoad('ebdstg', 'stats') as IStats;
    this.ebdS.statsD = this.doLoad('ebdstg', 'storage/diskstats') as IStats;
  }

  doLoad(name: string, info: string) {
    let ret = this.httpHelper.call<IStats | IInstance[]>('GET', `/api/app/ebd/${info}`, {
      name
    });
    return ret;
  }

  expand(type: string) {
    switch (type) {
      case 'ebdM':
        if (this.ebdM.insts) return;
        this.ebdM.instsLoading = true;
        this.doLoad('ebdmaster', 'list').$promise.success(res => {
          this.ebdM.insts = res as IInstance[];
          this.ebdM.instsLoading = false;
        });
        break;
      case 'ecb':
        if (this.ecb.insts) return;
        this.ecb.instsLoading = true;
        this.doLoad('ecb', 'list').$promise.success(res => {
          this.ecb.insts = res as IInstance[];
          this.ecb.instsLoading = false;
        });
        break;
      case 'ebdS':
        if (this.ebdS.insts) return;
        this.ebdS.instsLoading = true;
        this.doLoad(undefined, 'storage/instances').$promise.success(res => {
          this.ebdS.insts = res as IInstance[];
          this.ebdS.instsLoading = false;
        });
        break;
    }
  }

  showDisksPanel(inst: IInstance, type: string, $event: MouseEvent) {
    $event.stopPropagation();

    // compute position
    const out = jQuery('.main-wrapper > .content');
    const target = jQuery($event.target);
    const abTop = target.offset().top + out.scrollTop() - out.offset().top;
    const abLeft = target.offset().left + out.scrollLeft() - out.offset().left;
    this.diskListPanel.top = abTop + 20;
    this.diskListPanel.left = abLeft;

    this.diskListPanel.isShow = true;
    this.diskListPanel.isLoading = true;
    this.httpHelper.call<IDisk[]>('GET', '/api/app/ebd/storage/disks', {
      host: inst.host
    }).$promise.success((data: IDisk[]) => {
      this.diskListPanel.disks = data.filter((value: IDisk) => {
        if (type === 'total') {
          return true;
        } else {
          return value.status.toLowerCase() === 'bad';
        }
      });
      this.diskListPanel.isLoading = false;
    });
  }

  bind() {
    let clickOutSide = (event: JQueryEventObject) => {
      if (this.diskListPanel.isShow) {
        let sub = jQuery('.disk-list-panel')[0];
        if (!sub.contains(event.target)) {
          this.diskListPanel.isShow = false;
          this.diskListPanel.disks = [];
          event.stopPropagation();
          this.$scope.$apply();
        }
      }
    };

    this.$document.on('click', clickOutSide);
    this.$scope.$on('$destroy', () => {
      this.$document.off('click', clickOutSide);
    });
  }


  gotoServer(host: string) {
    let newPage = window.open('', '_blank') as any;
    this.httpHelper.call<{ id: string; }>('GET', '/api/server/getid', {host})
      .$promise.success((data: {id: string}) => {
        const url = this.$state.href('main.monitor.servers.detail', data);
        newPage.location = url;
    });
  }
}

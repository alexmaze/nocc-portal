export function pfdGroupHostsFilter() {
  return function (value: string[][], needClean: boolean, hostName: boolean) {
    if (!value) {
      return '';
    }
    if (hostName) {
      let ret = (value as any).map((item: string) => {
        return item.match(/^(https?:\/\/)?([^\:]*)(\:\d+)?$/)[2];
      });
      return needClean ? ret.join(' | ') : ret.join('<br/>');
    } else {
      let ret = value.map((item: [string, string]) => {
        return item[0].match(/^(https?:\/\/)?([^\:]*)(\:\d+)?$/)[2];
      });
      return needClean ? ret.join(' | ') : ret.join('<br/>');
    }
  };
}

export function hostFilter() {
  return function (value: string) {
    if (!value) {
      return '';
    }
    return value.match(/^(https?:\/\/)?([^\:]*)(\:\d+)?$/)[2];
  };
}

/** @ngInject */
export function hostStatisticsFilter(unitConvertUtil: base.IUnitCovertUtil) {
  let theHostFilter = hostFilter();
  return (statistics: any, property: string, hosts: any[]) => {
    // console.log('hahahaha', statistics, property, hosts);
    let values = [];

    switch (property) {
      case 'responseTime':
        hosts.forEach((element: any) => {
          let host = theHostFilter(element[0]);
          if (statistics[host]) {
            values.push(parseInt(statistics[host].responseTime, 10) + ' ms');
          } else {
            values.push('- ms');
          }
        });
        break;
      case 'transaction':
        hosts.forEach((element: any) => {
          let host = theHostFilter(element[0]);
          if (statistics[host]) {
            values.push(parseInt(statistics[host].transaction, 10) + ' tps');
          } else {
            values.push('- tps');
          }
        });
        break;
      case 'throughput':
        hosts.forEach((element: any) => {
          let host = theHostFilter(element[0]);
          if (statistics[host]) {
            let upData = unitConvertUtil.toBandwidth(statistics[host].throughputUp, 2);
            let downData = unitConvertUtil.toBandwidth(statistics[host].throughputDown, 2);
            values.push(`↑ ${upData} ↓ ${downData} `);
          } else {
            values.push(`↑ - bps ↓ - bps `);
          }
        });
        break;
      case 'errorRate':
        hosts.forEach((element: any) => {
          let host = theHostFilter(element[0]);
          if (statistics[host]) {
            values.push(parseFloat(statistics[host].errorRate).toFixed(2) + ' %');
          } else {
            values.push(`- %`);
          }
        });
        break;
    }

    return values.join('<br/>');
  };
}

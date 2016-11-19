import * as jQuery from 'jquery';

export class SystemConfigService implements qos.service.ISystemConfigService {
  config: qos.ISystemConfig;

  fetch() {
    this.config = jQuery.ajax({
      url: '/api/config',
      async: false
    }).responseJSON;
  }
}

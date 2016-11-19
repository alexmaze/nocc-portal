/// <reference path="./index.d.ts" />

import * as angular from 'angular';

import 'angular-animate';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.js';
import 'angular-loading-bar';
import 'angularjs-toaster';
import 'angular-local-storage';
import 'angular-sanitize';
import 'angular-messages';
import 'ui-select';

import 'angular-loading-bar/build/loading-bar.css';
import 'angularjs-toaster/toaster.css';
import 'font-awesome/css/font-awesome.css';
import 'ui-select/dist/select.css';

// sub modules
import commonModule from './modules/common';
import apiModule from './modules/api';
import authenticationModule from './modules/authentication';
import monitorModule from './modules/monitor';
import settingsModule from './modules/settings';
import namespaceModule from './modules/namespace';
import userModule from './modules/user';
import namespaceAdminModule from './modules/namespace-admin';

namespace base {
  let thirdParties = [
    'ui.select',
    'ui.router',
    'ngAnimate',
    'ngMessages',
    'pascalprecht.translate',
    'ngSanitize',
    'angular-loading-bar',
    'toaster',
    'LocalStorageModule'];

  let subModules = [
    apiModule,
    commonModule,
    authenticationModule,
    settingsModule,
    namespaceModule,
    monitorModule,
    userModule,
    namespaceAdminModule];

  angular.module('qos', [
    ...thirdParties,
    ...subModules]);
}

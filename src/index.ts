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
import 'angular-ui-tinymce';
import 'ng-file-upload';

import 'angular-loading-bar/build/loading-bar.css';
import 'angularjs-toaster/toaster.css';
import 'font-awesome/css/font-awesome.css';
import 'ui-select/dist/select.css';

// sub modules
import commonModule from './modules/common';
import authenticationModule from './modules/authentication';
import userModule from './modules/user';
import settingsModule from './modules/settings';
import eventModule from './modules/event';

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
    'ui.tinymce',
    'ngFileUpload',
    'LocalStorageModule'];

  let subModules = [
    commonModule,
    authenticationModule,
    userModule,
    eventModule,
    settingsModule];

  angular.module('qos', [
    ...thirdParties,
    ...subModules]);
}

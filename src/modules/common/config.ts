import { ErrorInterceptor } from './services/http-interceptors/error.interceptor';

/** @ngInject */
export default function config(
  $translateProvider: angular.translate.ITranslateProvider,
  $httpProvider: angular.IHttpProvider,
  cfpLoadingBarProvider: angular.loadingBar.ILoadingBarProvider) {

  $httpProvider.interceptors.push(ErrorInterceptor.Factory);

  // angular-translate
  let lang = (window.localStorage as any).lang || 'zh';
  $translateProvider.preferredLanguage(lang);
  $translateProvider.useStaticFilesLoader({
    prefix: '/static/i18n/',
    suffix: '.json'
  });
  // $translateProvider.useSanitizeValueStrategy('escape');
  // $translateProvider.useSanitizeValueStrategy('sanitize');
  $translateProvider.useSanitizeValueStrategy(null);

  // angular-loading-bar
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.latencyThreshold = 100;
}

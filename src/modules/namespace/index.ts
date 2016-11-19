import * as angular from 'angular';

import Register from 'opdev-front/src/utils/register';
import { routes } from './route';

import { akSkDisplay } from './components/ak-sk-display/ak-sk-display.directive';
import { namespaceExplorer } from './components/namespace-explorer/namespace-explorer.component';
import { bucketExplorer } from './components/bucket-explorer/bucket-explorer.component';

import { keyStatusFilter } from './components/keys/key-status.filter';

import { NamespaceController } from './components/namespace/namespace.controller';
import { KeysController } from './components/keys/keys.controller';
import { BucketsController } from './components/buckets/buckets.controller';
import { BucketDomainController } from './components/bucket-domain/bucket-domain.controller';
import { BucketHistoryController } from './components/bucket-history/bucket-history.controller';

let MODULE_NAME = 'evm.namespace';
(new Register(MODULE_NAME, []))
  .config(routes)
    .directive('akSkDisplay', akSkDisplay)
    .component('bucketExplorer', bucketExplorer)
    .component('namespaceExplorer', namespaceExplorer)
    .filter('keyStatusFilter', keyStatusFilter)
    .controller('NamespaceController', NamespaceController)
    .controller('KeysController', KeysController)
    .controller('BucketsController', BucketsController)
    .controller('BucketDomainController', BucketDomainController)
    .controller('BucketHistoryController', BucketHistoryController)
  .build(angular);

export default MODULE_NAME;

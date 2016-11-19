import { BucketExplorerController } from './bucket-explorer.controller';

export class BucketExplorerComponent implements angular.IComponentOptions {
  public bindings: any;
  public controller: any;
  public template: string;

  constructor() {
    this.bindings = {
      bucketModel: '=',
      bucketLoaded: '=',
      bucketActions: '='
    };
    this.template = require('./bucket-explorer.template.html');
    this.controller = BucketExplorerController;
  }
}

export let bucketExplorer = new BucketExplorerComponent();

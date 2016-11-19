import { NamespaceExplorerController } from './namespace-explorer.controller';

export class NamespaceExplorerComponent implements angular.IComponentOptions {
  public bindings: any;
  public controller: any;
  public template: string;

  constructor() {
    this.bindings = {
      nsModel: '=',
      nsLoaded: '=',
      nsActions: '=',
      nsFilterKey: '='
    };
    this.template = require('./namespace-explorer.template.html');
    this.controller = NamespaceExplorerController;
  }
}

export let namespaceExplorer = new NamespaceExplorerComponent();

import './user-explorer.less';
import { UserExplorerController } from './user-explorer.controller';

export class UserExplorerComponent implements angular.IComponentOptions {
  public bindings: any;
  public controller: any;
  public template: string;

  constructor() {
    this.bindings = {
      userModel: '=',
      userLoaded: '=',
      userActions: '='
    };
    this.template = require('./user-explorer.template.html');
    this.controller = UserExplorerController;
  }
}

export let userExplorer = new UserExplorerComponent();

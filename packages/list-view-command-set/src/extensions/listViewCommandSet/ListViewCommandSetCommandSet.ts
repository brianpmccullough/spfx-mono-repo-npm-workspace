import { Log } from '@microsoft/sp-core-library';
import { formatSharedMessage } from '@spfx-monorepo/shared';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';

import SelectionSummaryDialog from './components/SelectionSummaryDialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IListViewCommandSetCommandSetProperties {
  commandOneText: string;
  commandTwoText: string;
}

const LOG_SOURCE: string = 'ListViewCommandSetCommandSet';

export default class ListViewCommandSetCommandSet extends BaseListViewCommandSet<IListViewCommandSetCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ListViewCommandSetCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    const selectedCount: number = this.context.listView.selectedRows?.length || 0;

    switch (event.itemId) {
      case 'COMMAND_1':
        this._showSelectionDialog(formatSharedMessage('Shared utility', this.properties.commandOneText), selectedCount);
        break;
      case 'COMMAND_2':
        this._showSelectionDialog(formatSharedMessage('Shared utility', this.properties.commandTwoText), selectedCount);
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }

  private _showSelectionDialog(message: string, selectedCount: number): void {
    const dialog: SelectionSummaryDialog = new SelectionSummaryDialog({
      message,
      selectedCount
    });

    dialog.show().catch(() => {
      /* handle error */
    });
  }
}

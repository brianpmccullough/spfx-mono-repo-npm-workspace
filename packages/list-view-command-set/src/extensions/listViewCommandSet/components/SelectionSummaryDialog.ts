import { BaseDialog, type IDialogConfiguration } from '@microsoft/sp-dialog';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import SelectionSummary from './SelectionSummary';

export interface ISelectionSummaryDialogProps {
  message: string;
  selectedCount: number;
}

export default class SelectionSummaryDialog extends BaseDialog {
  public constructor(private readonly _props: ISelectionSummaryDialogProps) {
    super();
  }

  public render(): void {
    const element: React.ReactElement = React.createElement(SelectionSummary, {
      message: this._props.message,
      selectedCount: this._props.selectedCount,
      onDismiss: () => this.close()
    });

    ReactDom.render(element, this.domElement);
  }

  public getConfig(): IDialogConfiguration {
    return {
      isBlocking: false
    };
  }

  protected onAfterClose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}

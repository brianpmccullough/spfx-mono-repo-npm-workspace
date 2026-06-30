import { Log } from '@microsoft/sp-core-library';
import { formatSharedMessage } from '@spfx-monorepo/shared';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import Header from './components/Header';
import * as strings from 'HeaderApplicationCustomizerApplicationCustomizerStrings';

const LOG_SOURCE: string = 'HeaderApplicationCustomizerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHeaderApplicationCustomizerApplicationCustomizerProperties {
  message: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HeaderApplicationCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IHeaderApplicationCustomizerApplicationCustomizerProperties> {

  private _topPlaceholder?: PlaceholderContent;

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholders);
    this._renderPlaceholders();

    return Promise.resolve();
  }

  private _renderPlaceholders = (): void => {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
    }

    if (this._topPlaceholder?.domElement) {
      const element: React.ReactElement = React.createElement(Header, {
        message: formatSharedMessage(
          'Shared utility',
          this.properties.message || 'Simple header application customizer'
        )
      });

      ReactDom.render(element, this._topPlaceholder.domElement);
    }
  };

  private _onDispose = (): void => {
    if (this._topPlaceholder?.domElement) {
      ReactDom.unmountComponentAtNode(this._topPlaceholder.domElement);
    }
  }
}

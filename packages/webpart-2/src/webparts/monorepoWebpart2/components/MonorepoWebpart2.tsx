import * as React from 'react';
import styles from './MonorepoWebpart2.module.scss';
import type { IMonorepoWebpart2Props } from './IMonorepoWebpart2Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { helloWorld } from '@spfxmonorepo/shared';
import welcomeDark from '../assets/welcome-dark.png';
import welcomeLight from '../assets/welcome-light.png';

export default class MonorepoWebpart2 extends React.Component<IMonorepoWebpart2Props> {
  public render(): React.ReactElement<IMonorepoWebpart2Props> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.monorepoWebpart2}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? welcomeDark : welcomeLight} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
          <div dangerouslySetInnerHTML={{ __html: helloWorld }} />
        </div>
      </section>
    );
  }
}

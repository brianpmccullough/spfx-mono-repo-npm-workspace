import * as React from 'react';

import styles from './Header.module.scss';

export interface IHeaderProps {
  message: string;
}

const Header: React.FC<IHeaderProps> = ({ message }) => (
  <div className={styles.header}>
    <span className={styles.label}>Header</span>
    <span>{message}</span>
  </div>
);

export default Header;

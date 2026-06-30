import * as React from 'react';

import styles from './SelectionSummary.module.scss';

export interface ISelectionSummaryProps {
  message: string;
  selectedCount: number;
  onDismiss: () => void;
}

const SelectionSummary: React.FC<ISelectionSummaryProps> = ({
  message,
  selectedCount,
  onDismiss
}) => (
  <div className={styles.summary}>
    <h2 className={styles.title}>List command</h2>
    <p className={styles.message}>{message}</p>
    <p className={styles.count}>Selected items: {selectedCount}</p>
    <button className={styles.button} type="button" onClick={onDismiss}>
      Close
    </button>
  </div>
);

export default SelectionSummary;

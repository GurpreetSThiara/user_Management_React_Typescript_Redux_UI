import React from 'react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.animation}>404</div>
      <div className={styles.message}>Page Not Found</div>
      <div className={styles.subMessage}>
        Oops! The page you're looking for doesn't exist.
      </div>
      <button className={styles.homeButton} onClick={() => window.location.href = '/'}>
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;

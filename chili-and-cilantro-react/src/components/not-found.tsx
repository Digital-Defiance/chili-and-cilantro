import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
  },
  header: {
    fontSize: '6rem',
    color: '#FF5733',
  },
  message: {
    fontSize: '1.5rem',
  },
};

function NotFoundComponent() {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <p style={styles.message}>Page not found.</p>
    </div>
  );
}

export default NotFoundComponent;

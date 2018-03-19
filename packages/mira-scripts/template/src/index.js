import React from 'react';

const App = () => {
  return (
    <div style={styles.container}>
      <div style={styles.title}>MiraKit</div>
      <div style={styles.subtitle}>Screen signage SDK</div>
      <br />
      <div>
        For documentation and examples check out{' '}
        <a
          style={styles.anchor}
          href="https://github.com/mirainc/mira-kit"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/mirainc/mira-kit
        </a>.
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    padding: 50,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
    fontSize: '175%',
    color: 'white',
    background: '#16161d',
    lineHeight: 1.5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '0.85em',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontStyle: 'italic',
    fontSize: '0.85em',
    opacity: 0.6,
  },
  anchor: {
    color: '#0683d4',
    textDecoration: 'none',
  },
};

export default App;

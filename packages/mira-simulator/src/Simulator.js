import {
  ThemeProvider,
  Container,
  PresentationBuilderForm,
  PresentationBuilderPreview,
} from 'mira-elements';
import { extractProperties } from 'mira-kit/prop-types';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import packageJson from '../package.json';
import AppLoader from './AppLoader';

const STORE_KEY = `${packageJson.name}:store`;

class MiraAppSimulator extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    config: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  };

  state = {
    // Everything in store will be saved to localStorage.
    store: {
      previewMode: 'horizontal',
      fullScreen: false,
    },
  };

  componentDidMount() {
    const initialState = localStorage.getItem(STORE_KEY);
    if (initialState) {
      this.setState({ store: JSON.parse(initialState) });
    }
  }

  componentDidUpdate() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.state.store));
  }

  renderApp(appVars, allowedRequestDomains = []) {
    return (
      <AppLoader
        appVars={appVars}
        allowedRequestDomains={allowedRequestDomains}
      >
        {this.props.children}
      </AppLoader>
    );
  }

  render() {
    const { icon, config } = this.props;
    const { store } = this.state;
    const { properties, strings } = extractProperties(
      config.presentationProperties || {},
    );
    const appVarName = Object.keys(config.applicationVariables || {})[0];
    const appVars = config.applicationVariables[appVarName] || {};

    // Merge in defaults.
    properties.forEach(prop => {
      if (
        typeof prop.default !== 'undefined' &&
        typeof appVars[prop.name] === 'undefined'
      ) {
        appVars[prop.name] = prop.default;
      }
    });

    if (store.fullScreen) {
      return (
        <div style={styles.container}>
          {this.renderApp(appVars, config.allowedRequestDomains)}
        </div>
      );
    }

    const application = {
      icon_url: icon,
      name: config.name,
      presentation_properties: properties,
      strings: {
        description: '',
        ...strings,
      },
    };

    const presentation = {
      name: appVarName || config.name,
      application_vars: appVars,
    };

    return (
      <div style={styles.container}>
        <ThemeProvider theme="light">
          <Container style={styles.builder}>
            <div style={styles.form}>
              <PresentationBuilderForm
                presentation={presentation}
                application={application}
                onChange={console.log}
                onSubmit={console.log}
              />
            </div>
            <PresentationBuilderPreview
              application={application}
              previewMode={store.previewMode}
              onPreviewModeChange={previewMode =>
                this.setStore({ previewMode })
              }
            >
              {this.renderApp(appVars, config.allowedRequestDomains)}
            </PresentationBuilderPreview>
          </Container>
        </ThemeProvider>
      </div>
    );
  }

  setStore = store => {
    this.setState({
      store: {
        ...this.state.store,
        ...store,
      },
    });
  };
}

const styles = {
  container: {
    height: '100%',
  },
  builder: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  form: {
    width: 316,
    display: 'flex',
  },
  frame: {
    width: '100%',
    height: '100%',
    border: 0,
  },
};

export default MiraAppSimulator;

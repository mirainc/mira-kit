import {
  ThemeProvider,
  Container,
  PresentationBuilderForm,
  PresentationBuilderPreview,
  Button,
} from 'mira-elements';
import { extractProperties } from 'mira-kit/prop-types';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import React, { Component } from 'react';
import AppLoader from './AppLoader';
import Icon from './Icon';

const PRESENTATION_MIN_DURATION = 5;

class MiraAppSimulator extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    config: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  };

  initialState = {
    previewMode: 'horizontal',
    fullScreen: false,
    index: 0,
    presentation: null,
    previewPresentation: null,
    present: false,
    hideControls: false,
    supressLogs: false,
    files: {},
  };

  queuedPresentationPreview = null;

  componentWillMount() {
    const queryParams = querystring.parse(
      window.location.search.replace(/^\?/, ''),
    );

    this.setState(this.initialState);
    if (queryParams.previewMode) {
      this.setState({ previewMode: queryParams.preview });
    }
    if (queryParams.index) {
      this.setState({ index: parseInt(queryParams.index, 10) });
    }
    if (queryParams.fullScreen) {
      this.setState({ fullScreen: true, hideControls: true });
    }
    if (queryParams.present) {
      this.setState({ present: true });
    }
    if (queryParams.supressLogs) {
      this.setState({ supressLogs: true });
    }
  }

  componentDidUpdate() {
    const queryParams = {};

    if (this.hasStateChanged('previewMode')) {
      queryParams.previewMode = this.state.previewMode;
    }
    if (this.hasStateChanged('index')) {
      queryParams.index = this.state.index;
    }
    if (this.hasStateChanged('fullScreen')) {
      queryParams.fullScreen = this.state.fullScreen;
    }
    if (this.hasStateChanged('present')) {
      queryParams.present = this.state.present;
    }

    const qs = querystring.stringify(queryParams);
    window.history.replaceState(null, '', `?${qs}`);
  }

  hasStateChanged(key) {
    return this.state[key] !== this.initialState[key];
  }

  getAppVarNames() {
    const { applicationVariables = {} } = this.props.config;
    return Object.keys(applicationVariables);
  }

  startHideControlsTimer = () => {
    if (this.state.fullScreen) {
      clearTimeout(this.hideControlsTimeout);
      this.setState({ hideControls: false });
      this.hideControlsTimeout = setTimeout(() => {
        this.setState({ hideControls: true });
      }, 4000);
    }
  };

  setPresentationPreview = (presentation, changedProp) => {
    let previewPresentation = presentation;

    // Delay updating the preview for text and string inputs until onBlur.
    if (changedProp.type === 'string' || changedProp.type === 'text') {
      this.queuedPresentationPreview = previewPresentation;
      previewPresentation = this.state.previewPresentation;
    } else {
      // Clear any queued preview updates because we're about to update.
      this.queuedPresentationPreview = null;
    }

    this.setState({ appVars: presentation.application_vars });
  };

  flushPreviewUpdate = () => {
    // Flush any queued preview updates.
    if (this.queuedPresentationPreview) {
      this.setState({
        appVars: this.queuedPresentationPreview.application_vars,
      });
      this.queuedPresentationPreview = null;
    }
  };

  renderControls() {
    const { index, fullScreen, hideControls, present } = this.state;
    const count = this.getAppVarNames().length;
    const nextIndex = (index + 1) % count;
    const previousIndex = ((index - 1) % count + count) % count;
    const shouldShowPlay = count > 1;

    return (
      <ThemeProvider theme={fullScreen ? 'dark' : 'light'}>
        <div style={styles.controls(fullScreen, hideControls)}>
          <Button
            shrinkwrap
            onClick={() => this.setState({ fullScreen: !fullScreen })}
          >
            <Icon icon={fullScreen ? 'fullscreenExit' : 'fullscreen'} />
          </Button>
          <div style={{ flex: 1 }} />
          {shouldShowPlay && (
            <span>
              <Button
                shrinkwrap
                disabled={present}
                onClick={() =>
                  this.setState({ index: previousIndex, appVars: null })
                }
              >
                <Icon icon="previous" />
              </Button>
              &nbsp;
              <Button
                shrinkwrap
                onClick={() => this.setState({ present: !present })}
              >
                <Icon icon={present ? 'pause' : 'play'} />
              </Button>
              &nbsp;
              <Button
                shrinkwrap
                disabled={present}
                onClick={() =>
                  this.setState({ index: nextIndex, appVars: null })
                }
              >
                <Icon icon="next" />
              </Button>
            </span>
          )}
        </div>
      </ThemeProvider>
    );
  }

  renderApp(appVars, allowedRequestDomains = []) {
    const { index, present, supressLogs } = this.state;
    const count = this.getAppVarNames().length;
    const nextIndex = (index + 1) % count;

    return (
      <AppLoader
        key={index}
        appVars={appVars}
        allowedRequestDomains={allowedRequestDomains}
        supressLogs={supressLogs}
        onMouseOver={this.startHideControlsTimer}
        onComplete={present && (() => this.setState({ index: nextIndex }))}
      >
        {this.props.children}
      </AppLoader>
    );
  }

  render() {
    const { icon, config } = this.props;
    const { previewMode, index, fullScreen } = this.state;
    const {
      name: appName,
      presentationProperties = {},
      applicationVariables = {},
    } = config;
    const { properties, strings } = extractProperties(presentationProperties);
    const selectedAppVar = Object.keys(applicationVariables)[index];
    const appVars =
      this.state.appVars || applicationVariables[selectedAppVar] || {};

    // Merge in defaults.
    properties.forEach(prop => {
      if (
        typeof prop.default !== 'undefined' &&
        typeof appVars[prop.name] === 'undefined'
      ) {
        appVars[prop.name] = prop.default;
      }
    });

    const containerProps = {
      onMouseOver: this.startHideControlsTimer,
      style: styles.container,
    };

    const application = {
      icon_url: icon,
      name: appName,
      presentation_properties: properties,
      strings: {
        description: '',
        ...strings,
      },
    };

    const presentation = {
      // Passing id will trigger the form to update state from props.
      id: `${index}`,
      name: selectedAppVar || appName,
      application_vars: appVars,
    };

    const previewErrors = PresentationBuilderForm.validate(
      presentation,
      application,
      PRESENTATION_MIN_DURATION,
    );

    const shouldRenderApp = previewErrors.length === 0;

    if (fullScreen) {
      return (
        <div {...containerProps}>
          {this.renderControls()}
          {shouldRenderApp &&
            this.renderApp(appVars, config.allowedRequestDomains)}
        </div>
      );
    }

    return (
      <div {...containerProps}>
        {this.renderControls()}
        <ThemeProvider theme="light">
          <Container style={styles.builder}>
            <div style={styles.form}>
              <PresentationBuilderForm
                presentation={presentation}
                application={application}
                onChange={this.setPresentationPreview}
                onBlur={this.flushPreviewUpdate}
                onSubmit={() => {}}
              />
            </div>
            <PresentationBuilderPreview
              application={application}
              previewMode={previewMode}
              onPreviewModeChange={previewMode =>
                this.setState({ previewMode })
              }
            >
              {shouldRenderApp &&
                this.renderApp(appVars, config.allowedRequestDomains)}
            </PresentationBuilderPreview>
          </Container>
        </ThemeProvider>
      </div>
    );
  }
}

const formWidth = 316;
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
    width: formWidth,
    display: 'flex',
  },
  controls: (fullScreen, hideControls) => ({
    position: 'fixed',
    zIndex: 100,
    bottom: 16,
    left: 16,
    boxSizing: 'border-box',
    width: formWidth - 32,
    display: 'flex',
    justifyContent: 'center',
    background: fullScreen ? 'transparent' : '#fff',
    opacity: fullScreen && hideControls ? 0 : 1,
    transition: fullScreen && hideControls ? 'opacity 1s ease-in' : '',
  }),
};

export default MiraAppSimulator;

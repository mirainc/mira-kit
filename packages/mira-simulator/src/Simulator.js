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
import PresentationSkipper from './PresentationSkipper';

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
    const state = { ...this.initialState };
    const queryParams = querystring.parse(
      window.location.search.replace(/^\?/, ''),
    );

    if (queryParams.previewMode) {
      state.previewMode = queryParams.previewMode;
    }
    if (queryParams.index) {
      state.index = parseInt(queryParams.index, 10);
    }
    if (queryParams.fullScreen) {
      state.fullScreen = true;
      state.hideControls = true;
    }
    if (queryParams.present) {
      state.present = true;
    }
    if (queryParams.supressLogs) {
      state.supressLogs = true;
    }

    this.setState(state);
    this.setStateAtIndex(state.index);
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

  setStateAtIndex = index => {
    const { icon, config } = this.props;
    const {
      name: appName,
      applicationVariables = {},
      presentationProperties = {},
    } = config;
    const appVarNames = this.getAppVarNames();
    // Set the selected app var to the index or the first one if not found.
    const selectedAppVar = appVarNames[index] || appVarNames[0];
    const appVars = applicationVariables[selectedAppVar] || {};
    const { properties, strings } = extractProperties(presentationProperties);

    // Merge in defaults.
    properties.forEach(prop => {
      if (
        typeof prop.default !== 'undefined' &&
        typeof appVars[prop.name] === 'undefined'
      ) {
        appVars[prop.name] = prop.default;
      }
    });

    const presentation = {
      // Passing id will trigger the form to update state from props.
      id: `${index}`,
      name: selectedAppVar || '',
      application_vars: appVars,
    };

    const application = {
      name: appName,
      icon_url: icon,
      presentation_properties: properties,
      strings: {
        ...strings,
        description: config.description,
        callToAction: config.callToAction,
      },
    };

    this.setState({
      index,
      presentation,
      application,
      previewPresentation: presentation,
    });
  };

  setPresentationPreview = (presentation, changedProp) => {
    let previewPresentation;

    // Delay updating the preview for text and string inputs until onBlur.
    if (changedProp.type === 'string' || changedProp.type === 'text') {
      this.queuedPresentationPreview = presentation;
      previewPresentation = this.state.previewPresentation;
    } else {
      // Immediately update presentation preview.
      previewPresentation = presentation;
      // Clear any queued preview updates because we're about to update.
      this.queuedPresentationPreview = null;
    }

    this.setState({ previewPresentation });
  };

  flushPreviewUpdate = () => {
    // Flush any queued preview updates.
    if (this.queuedPresentationPreview) {
      this.setState({ previewPresentation: this.queuedPresentationPreview });
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
                onClick={() => this.setStateAtIndex(previousIndex)}
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
                onClick={() => this.setStateAtIndex(nextIndex)}
              >
                <Icon icon="next" />
              </Button>
            </span>
          )}
        </div>
      </ThemeProvider>
    );
  }

  renderPreview() {
    const { config } = this.props;
    const {
      index,
      present,
      supressLogs,
      previewPresentation,
      application,
    } = this.state;

    const previewErrors = PresentationBuilderForm.validate(
      previewPresentation,
      application,
      PRESENTATION_MIN_DURATION,
    );

    const hasErrors = previewErrors.length > 0;

    const count = this.getAppVarNames().length;
    const nextIndex = (index + 1) % count;
    // We only pass an onComplete handler when presentating and there's
    // more than one application variable. We do this because we want to
    // loop when theres one app var even if presenting.
    const shouldHandleOnComplete = present && count > 1;

    // Skip invalid presentation when presenting.
    if (hasErrors && present) {
      console.log('Skipping invalid presentation...');
      return (
        <PresentationSkipper
          onComplete={() => this.setStateAtIndex(nextIndex)}
        />
      );
    }

    if (hasErrors) return null;

    return (
      <AppLoader
        key={index}
        appVars={previewPresentation.application_vars}
        allowedRequestDomains={config.allowedRequestDomains || []}
        supressLogs={supressLogs}
        onMouseOver={this.startHideControlsTimer}
        onComplete={
          shouldHandleOnComplete && (() => this.setStateAtIndex(nextIndex))
        }
      >
        {this.props.children}
      </AppLoader>
    );
  }

  render() {
    const { previewMode, fullScreen, presentation, application } = this.state;
    const containerProps = {
      onMouseOver: this.startHideControlsTimer,
      style: styles.container,
    };

    if (fullScreen) {
      return (
        <div {...containerProps}>
          {this.renderControls()}
          {this.renderPreview()}
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
              {this.renderPreview()}
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
    background: '#000',
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
    bottom: 0,
    left: 0,
    boxSizing: 'border-box',
    width: formWidth,
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
    background: fullScreen ? 'transparent' : '#fff',
    opacity: fullScreen && hideControls ? 0 : 1,
    transition: fullScreen && hideControls ? 'opacity 1s ease-in' : '',
  }),
};

export default MiraAppSimulator;

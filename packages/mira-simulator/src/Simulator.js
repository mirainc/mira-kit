import {
  ThemeProvider,
  Container,
  PresentationBuilderForm,
  PresentationBuilderPreview,
  Button,
} from 'mira-elements';
import querystring from 'querystring';
import React, { Component } from 'react';
import AppLoader from './AppLoader';
import Icon from './Icon';

const PRESENTATION_MIN_DURATION = 5;

class MiraAppSimulator extends Component {
  initialState = {
    presentation: { application_vars: {} },
    previewPresentation: { application_vars: {} },
    application: { icon_url: '', presentation_properties: [] },
    applicationVariables: {},
    previewMode: 'horizontal',
    fullScreen: false,
    index: 0,
    present: false,
    hideControls: false,
    supressLogs: false,
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

  startHideControlsTimer = () => {
    if (this.state.fullScreen) {
      clearTimeout(this.hideControlsTimeout);
      this.setState({ hideControls: false });
      this.hideControlsTimeout = setTimeout(() => {
        this.setState({ hideControls: true });
      }, 4000);
    }
  };

  setStateAtIndex = (
    index,
    application = this.state.application,
    applicationVariables = this.state.applicationVariables,
  ) => {
    // Setting a new id will trigger the form to update state from props
    // and cause the app preview to reload. We use index as part of the id
    // to reload the preview when index changes. We use applicationVariables
    // in the id to ensure theform is updated whenever we change mira.config.js
    let id = `${index}-${JSON.stringify(applicationVariables)}`;
    let name;
    let appVars;

    if (this.state.presentation.id === id) {
      // If the current presentation id is equal to the current one, re-use
      // the current application variables.
      name = this.state.presentation.name;
      appVars = this.state.presentation.application_vars;
    } else {
      // We are rendering a new presentation, reset to the application varibles
      // set in mira.config.js
      const appVarNames = Object.keys(applicationVariables);
      // Set the selected app var to the index or the first one if not found.
      const selectedAppVar = appVarNames[index] || appVarNames[0];
      name = selectedAppVar;
      appVars = applicationVariables[selectedAppVar] || {};
    }

    // Merge in defaults.
    application.presentation_properties.forEach(prop => {
      if (
        typeof prop.default !== 'undefined' &&
        typeof appVars[prop.name] === 'undefined'
      ) {
        appVars[prop.name] = prop.default;
      }
    });

    const presentation = {
      id: id,
      name: name || '',
      application_vars: appVars,
    };

    this.setState({
      index,
      presentation,
      application,
      applicationVariables,
      previewPresentation: presentation,
    });
  };

  setPresentation = (presentation, changedProp) => {
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

    this.setState({ previewPresentation, presentation });
  };

  flushPreviewUpdate = () => {
    // Flush any queued preview updates.
    if (this.queuedPresentationPreview) {
      this.setState({ previewPresentation: this.queuedPresentationPreview });
      this.queuedPresentationPreview = null;
    }
  };

  renderControls() {
    const {
      index,
      fullScreen,
      hideControls,
      present,
      applicationVariables,
    } = this.state;
    const count = Object.keys(applicationVariables).length;
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
    const {
      index,
      present,
      supressLogs,
      previewPresentation,
      application,
      applicationVariables,
    } = this.state;

    const previewErrors = PresentationBuilderForm.validate(
      // We don't care about name not being provided to render
      // the preview so hardcode a valid name.
      { ...previewPresentation, name: ' ' },
      application,
      PRESENTATION_MIN_DURATION,
    );

    const count = Object.keys(applicationVariables).length;
    const nextIndex = (index + 1) % count;

    return (
      <AppLoader
        key={index}
        appVars={previewPresentation.application_vars}
        hasPreviewErrors={previewErrors.length > 0}
        supressLogs={supressLogs}
        isPresenting={present}
        onLoad={(application, applicationVariables) => {
          this.setStateAtIndex(index, application, applicationVariables);
        }}
        onComplete={() => this.setStateAtIndex(nextIndex)}
      />
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
                onChange={this.setPresentation}
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

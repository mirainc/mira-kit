import deepEqual from 'fast-deep-equal';
import * as themes from 'mira-kit/themes';
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
import logger from './logger';
import mergeDefaultAppVars from './mergeDefaultAppVars';

const PRESENTATION_MIN_DURATION = 5;
const EMPTY_PRESENTATION = { name: 'New Presentation', application_vars: {} };
const EMPTY_APP_VERSION = { icon_url: '', presentation_properties: [] };

class MiraAppSimulator extends Component {
  initialState = {
    presentation: null,
    presentationPreview: null,
    appVersion: null,
    previewMode: 'horizontal',
    fullScreen: false,
    present: false,
    hideControls: false,
    enableLogs: true,
    simulatorOptions: { presentations: [] },
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
    if (queryParams.fullScreen) {
      state.fullScreen = true;
      state.hideControls = true;
    }
    if (queryParams.present) {
      state.present = true;
    }
    if (queryParams.enableLogs === 'false') {
      state.enableLogs = false;
    }
    if (queryParams.presentation) {
      try {
        const presentation = JSON.parse(
          decodeURIComponent(queryParams.presentation),
        );
        if (!presentation.application_vars) {
          throw new Error('Missing application_vars');
        }
        state.presentation = presentation;
        state.presentationPreview = state.presentation;
      } catch (err) {
        logger.warning('Could not parse presentation from querystring.');
      }
    }

    this.setState(state);
  }

  componentDidUpdate() {
    const queryParams = {};

    if (this.hasStateChanged('previewMode')) {
      queryParams.previewMode = this.state.previewMode;
    }
    if (this.hasStateChanged('fullScreen')) {
      queryParams.fullScreen = this.state.fullScreen;
    }
    if (this.hasStateChanged('present')) {
      queryParams.present = this.state.present;
    }
    if (this.hasStateChanged('presentation')) {
      queryParams.presentation = encodeURIComponent(
        JSON.stringify(this.state.presentation || {}),
      );
    }

    const qs = querystring.stringify(queryParams);
    window.history.replaceState(null, '', `?${qs}`);
  }

  hasStateChanged(key) {
    return !deepEqual(this.state[key], this.initialState[key]);
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

  // setOptions is called whenever the app is loaded. This happens
  // on first page load but also when the app code has changed, causing
  // webpack to reload the app preview.
  setOptions = (appVersion, simulatorOptions) => {
    const { presentation } = this.state;
    const state = {
      presentation,
      appVersion,
      simulatorOptions,
    };

    // Convert user-defined themes to snake_case for API parity.
    simulatorOptions.themes = (simulatorOptions.themes || []).map(theme => ({
      id: theme.id,
      name: theme.name,
      background_color: theme.backgroundColor,
      background_image: theme.backgroundImage,
      background_image_portrait: theme.backgroundImagePortrait,
      body_font: theme.bodyFont,
      body_text_color: theme.bodyTextColor,
      heading_font: theme.headingFont,
      heading_text_color: theme.headingTextColor,
      heading_2_font: theme.heading2Font,
      heading_2_text_color: theme.heading2TextColor,
      border_color: theme.borderColor,
    }));
    // Add default themes.
    simulatorOptions.themes = [
      ...simulatorOptions.themes,
      themes.frontpage,
      themes.reserved,
      themes.woodwork,
      themes.solid,
      themes.parade,
      themes.xray,
      themes.golden,
      themes.refresh,
      themes.blueprint,
      themes.chalkboard,
      themes.fashion,
      themes.fresh,
      themes.grill,
      themes.seattle,
      themes.showroom,
      themes.clean,
      themes.slate,
    ];

    if (simulatorOptions.presentations) {
      // Map over presentations to add a unique id (index) to each one.
      state.simulatorOptions.presentations = state.simulatorOptions.presentations.map(
        (p, index) => ({
          id: index,
          name: p.name,
          application_vars: p.values || {},
          theme_id: p.theme,
        }),
      );

      // If a presentation exists in state it means the user has updated the
      // form values, is in present mode or has passed in a presentation from
      // the query string.
      if (presentation) {
        if (!isNaN(presentation.id)) {
          // Use the query string presentation values over what's defined in the
          // simulator config to allow users to edit the values in the form and
          // have them persist through a page refresh.
          state.simulatorOptions.presentations[presentation.id] = presentation;
        } else {
          // If a presentation id isn't provided or valid, add the presentation
          // to the end of the simulator presentations with a new id.
          state.presentation.id = state.simulatorOptions.presentations.length;
          state.simulatorOptions.presentations.push(state.presentation);
        }
      } else {
        // No presentation currently set, use the first one in the simulator config.
        const firstPresentation = simulatorOptions.presentations[0];
        state.presentation = firstPresentation;
      }
    }

    // Immediately update the preview.
    state.presentationPreview = state.presentation;

    this.setState(state);
  };

  queuePresentationUpdate = (presentation, changedProp) => {
    let presentationPreview;

    console.log('queuePresentationUpdate', presentation);

    // Delay updating the preview for text and string inputs until onBlur.
    if (changedProp.type === 'string' || changedProp.type === 'text') {
      this.queuedPresentationPreview = presentation;
      presentationPreview = this.state.presentationPreview;
    } else {
      // Immediately update presentation preview.
      presentationPreview = presentation;
      // Clear any queued preview updates because we're about to update.
      this.queuedPresentationPreview = null;
    }

    this.setState({ presentationPreview, presentation });
  };

  flushPreviewUpdate = () => {
    // Flush any queued preview updates.
    if (this.queuedPresentationPreview) {
      this.setState({ presentationPreview: this.queuedPresentationPreview });
      this.queuedPresentationPreview = null;
    }
  };

  nextPresentation = () => {
    const { presentation, simulatorOptions } = this.state;
    const count = simulatorOptions.presentations.length;
    let index = presentation.id;
    // Show the next presentation in the list.
    const nextIndex = (index + 1) % count;
    const nextPresentation = simulatorOptions.presentations[nextIndex];

    this.setState({
      presentation: nextPresentation,
      presentationPreview: nextPresentation,
    });
  };

  previousPresentation = () => {
    const { presentation, simulatorOptions } = this.state;
    const count = simulatorOptions.presentations.length;
    let index = presentation.id;
    // Show the previous presentation in the list.
    const previousIndex = ((index - 1) % count + count) % count;
    const previousPresentation = simulatorOptions.presentations[previousIndex];

    this.setState({
      presentation: previousPresentation,
      presentationPreview: previousPresentation,
    });
  };

  renderControls() {
    const { fullScreen, hideControls, present, simulatorOptions } = this.state;
    const shouldShowPlay = simulatorOptions.presentations.length > 1;

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
                onClick={this.previousPresentation}
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
                onClick={this.nextPresentation}
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
    const { previewMode, present, enableLogs, simulatorOptions } = this.state;
    let { presentationPreview, appVersion } = this.state;

    presentationPreview = presentationPreview || EMPTY_PRESENTATION;
    appVersion = appVersion || EMPTY_APP_VERSION;

    // We don't care about name not being set to render the preview
    // so we hard-code a valid name.
    presentationPreview = mergeDefaultAppVars(
      { ...presentationPreview, name: presentationPreview.name || ' ' },
      appVersion,
    );

    const previewErrors = PresentationBuilderForm.validate(
      presentationPreview,
      appVersion,
      PRESENTATION_MIN_DURATION,
    );

    // Setting key so the app preview reloads when presentation
    // or preview mode changes.
    const key = `${presentationPreview.id}-${previewMode}`;
    // Add selected theme object to presentation.
    if (presentationPreview.theme_id) {
      const theme = (simulatorOptions.themes || []).find(
        t => t.id === presentationPreview.theme_id,
      );
      presentationPreview.theme = theme;
    }
    return (
      <AppLoader
        key={key}
        presentation={presentationPreview}
        previewErrors={previewErrors}
        enableLogs={enableLogs}
        isPresenting={present}
        onLoad={this.setOptions}
        onComplete={this.nextPresentation}
      />
    );
  }

  render() {
    const { previewMode, fullScreen } = this.state;
    let { presentation, appVersion, simulatorOptions } = this.state;

    presentation = presentation || EMPTY_PRESENTATION;
    appVersion = appVersion || EMPTY_APP_VERSION;

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

    const presentationWithDefaults = {
      ...mergeDefaultAppVars(presentation, appVersion),
      id: String(presentation.id),
    };

    return (
      <div {...containerProps}>
        {this.renderControls()}
        <ThemeProvider theme="light">
          <Container style={styles.builder}>
            <div style={styles.form}>
              <PresentationBuilderForm
                presentation={presentationWithDefaults}
                appVersion={appVersion}
                themes={simulatorOptions.themes}
                onChange={this.queuePresentationUpdate}
                onBlur={this.flushPreviewUpdate}
              />
            </div>
            <PresentationBuilderPreview
              appVersion={appVersion}
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
    opacity: fullScreen && hideControls ? 0 : 1,
    transition: fullScreen && hideControls ? 'opacity 1s ease-in' : '',
  }),
};

export default MiraAppSimulator;

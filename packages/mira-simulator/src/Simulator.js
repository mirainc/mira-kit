import deepEqual from 'fast-deep-equal';
import { omitBy, isNil } from 'lodash/fp';
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

const convertThemeToSnakeCase = theme => ({
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
});

const normalizePresentation = presentation => ({
  name: presentation.name,
  application_vars: presentation.values || {},
  theme_id: presentation.theme,
});

const assignIndexId = (obj, index) => ({ ...obj, id: index });

const omitNilValues = omitBy(isNil);

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
    previewOptions: { presentations: [] },
  };

  queuedPresentationPreview = null;

  getStateFromQueryParams() {
    const query = window.location.search.replace(/^\?/, '');
    const queryParams = querystring.parse(query);
    const { previewMode, present, enableLogs } = queryParams;
    let { fullScreen, presentation } = queryParams;
    fullScreen = !!fullScreen && fullScreen !== 'false';

    if (presentation) {
      try {
        presentation = JSON.parse(decodeURIComponent(presentation));

        if (!presentation.application_vars) {
          throw new Error('Missing application_vars');
        }
      } catch (err) {
        logger.warning(
          `Could not parse presentation from querystring: ${err.message}`,
        );
      }
    }

    return omitNilValues({
      previewMode,
      fullScreen,
      present: present && present !== 'false',
      hideControls: fullScreen, // hide controls in fullScreen mode
      enableLogs: enableLogs === 'false' ? false : undefined,
      presentation,
      presentationPreview: presentation,
    });
  }

  persistStateToQueryParams() {
    const previewMode = this.getUpdatedState('previewMode');
    const fullScreen = this.getUpdatedState('fullScreen');
    const present = this.getUpdatedState('present');

    let presentation = this.getUpdatedState('presentation');

    if (presentation) {
      presentation = encodeURIComponent(JSON.stringify(presentation));
    }

    const qs = querystring.stringify(
      omitNilValues({
        previewMode,
        fullScreen,
        present,
        presentation,
      }),
    );

    window.history.replaceState(null, '', `?${qs}`);
  }

  componentWillMount() {
    this.setState({
      ...this.initialState,
      ...this.getStateFromQueryParams(),
    });
  }

  componentDidUpdate() {
    this.persistStateToQueryParams();
  }

  getUpdatedState(key) {
    return this.hasStateChanged(key) ? this.state[key] : undefined;
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

  // onAppLoad is called whenever the app is loaded. This happens
  // on first page load but also when the app code has changed, causing
  // webpack to reload the app preview.
  onAppLoad = (appVersion, previewOptions) => {
    const { presentation } = this.state;
    const state = {
      presentation,
      appVersion,
      previewOptions,
    };

    previewOptions.themes = (previewOptions.themes || [])
      // Convert user-defined themes to snake_case for API parity.
      .map(convertThemeToSnakeCase)
      // Add default themes.
      .concat(Object.values(themes));

    if (previewOptions.presentations) {
      state.previewOptions.presentations = state.previewOptions.presentations
        .map(normalizePresentation)
        .map(assignIndexId);

      // If a presentation exists in state it means the user has updated the
      // form values, is in present mode or has passed in a presentation from
      // the query string.
      if (presentation) {
        if (!isNaN(presentation.id)) {
          // Use the query string presentation values over what's defined in the
          // simulator config to allow users to edit the values in the form and
          // have them persist through a page refresh.
          state.previewOptions.presentations[presentation.id] = presentation;
        } else {
          // If a presentation id isn't provided or valid, add the presentation
          // to the end of the simulator presentations with a new id.
          state.presentation.id = state.previewOptions.presentations.length;
          state.previewOptions.presentations.push(state.presentation);
        }
      } else {
        // No presentation currently set, use the first one in the simulator config.
        const firstPresentation = previewOptions.presentations[0];
        state.presentation = firstPresentation;
      }
    }

    // Immediately update the preview.
    state.presentationPreview = state.presentation;

    this.setState(state);
  };

  queuePresentationUpdate = (presentation, changedProp) => {
    let presentationPreview;

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
    const { presentation, previewOptions } = this.state;
    const count = previewOptions.presentations.length;
    let index = presentation.id;
    // Show the next presentation in the list.
    const nextIndex = (index + 1) % count;
    const nextPresentation = previewOptions.presentations[nextIndex];

    this.setState({
      presentation: nextPresentation,
      presentationPreview: nextPresentation,
    });
  };

  previousPresentation = () => {
    const { presentation, previewOptions } = this.state;
    const count = previewOptions.presentations.length;
    let index = presentation.id;
    // Show the previous presentation in the list.
    const previousIndex = ((index - 1) % count + count) % count;
    const previousPresentation = previewOptions.presentations[previousIndex];

    this.setState({
      presentation: previousPresentation,
      presentationPreview: previousPresentation,
    });
  };

  renderControls() {
    const { fullScreen, hideControls, present, previewOptions } = this.state;
    const shouldShowPlay = previewOptions.presentations.length > 1;

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
    const { previewMode, present, enableLogs, previewOptions } = this.state;
    let { presentationPreview, appVersion } = this.state;

    presentationPreview = presentationPreview || EMPTY_PRESENTATION;
    appVersion = appVersion || EMPTY_APP_VERSION;

    // We don't care about name not being set to render the preview
    // so we hard-code a valid name.
    presentationPreview = mergeDefaultAppVars(
      { ...presentationPreview, name: presentationPreview.name || ' ' },
      appVersion,
      previewOptions.soundZones,
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
      const theme = (previewOptions.themes || []).find(
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
        onLoad={this.onAppLoad}
        onComplete={this.nextPresentation}
      />
    );
  }

  render() {
    const { previewMode, fullScreen } = this.state;
    let { presentation, appVersion, previewOptions } = this.state;

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
      ...mergeDefaultAppVars(
        presentation,
        appVersion,
        previewOptions.soundZones,
      ),
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
                themes={previewOptions.themes}
                soundZones={previewOptions.soundZones}
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

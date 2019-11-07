import deepEqual from 'fast-deep-equal';
import querystring from 'querystring';
import App from 'raydiant-elements/core/App';
import Button from 'raydiant-elements/core/Button';
import ThemeProvider from 'raydiant-elements/core/ThemeProvider';
import ThemeSelector from 'raydiant-elements/core/ThemeSelector/ThemeSelector';
import PresentationBuilder from 'raydiant-elements/presentation/PresentationBuilder';
import PresentationPreview from 'raydiant-elements/presentation/PresentationPreview';
import theme from 'raydiant-elements/theme';
import * as themes from 'raydiant-kit/themes';
import React, { Component } from 'react';
import AppLoader from './AppLoader';
import logger from './logger';
import mergeDefaultAppVars from './mergeDefaultAppVars';

const PRESENTATION_MIN_DURATION = 5;
const EMPTY_PRESENTATION = { name: 'New Presentation', application_vars: {} };
const EMPTY_APP_VERSION = { icon_url: '', presentation_properties: [] };

class RaydiantAppSimulator extends Component {
  initialState = {
    presentation: null,
    appVersion: null,
    previewMode: 'horizontal',
    fullScreen: false,
    present: false,
    enableLogs: true,
    simulatorOptions: { presentations: [] },
  };

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
      } catch (err) {
        logger.warning('Could not parse presentation from querystring.');
      }
    }

    this.setState(state);
  }

  setQueryParams(presentation, previewMode, fullScreen, present) {
    const queryParams = {};

    if (this.hasStateChanged('previewMode')) {
      queryParams.previewMode = previewMode;
    }
    if (this.hasStateChanged('fullScreen')) {
      queryParams.fullScreen = fullScreen;
    }
    if (this.hasStateChanged('present')) {
      queryParams.present = present;
    }
    if (this.hasStateChanged('presentation')) {
      queryParams.presentation = encodeURIComponent(
        JSON.stringify(presentation || {}),
      );
    }

    const qs = querystring.stringify(queryParams);
    window.history.replaceState(null, '', `?${qs}${window.location.hash}`);
  }

  hasStateChanged(key) {
    return !deepEqual(this.state[key], this.initialState[key]);
  }

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
          updated_at: p.updatedAt,
          created_at: p.createdAt,
          application_id: p.applicationId,
          application_deployment_id: p.applicationDeploymentId,
          application_name: p.applicationName,
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

    this.setState(state);
  };

  nextPresentation = () => {
    const { presentation, simulatorOptions } = this.state;
    const count = simulatorOptions.presentations.length;
    let index = presentation.id;
    // Show the next presentation in the list.
    const nextIndex = (index + 1) % count;
    const nextPresentation = simulatorOptions.presentations[nextIndex];

    this.setState({ presentation: nextPresentation });
  };

  previousPresentation = () => {
    const { presentation, simulatorOptions } = this.state;
    const count = simulatorOptions.presentations.length;
    let index = presentation.id;
    // Show the previous presentation in the list.
    const previousIndex = ((index - 1) % count + count) % count;
    const previousPresentation = simulatorOptions.presentations[previousIndex];

    this.setState({ presentation: previousPresentation });
  };

  renderControls() {
    const { fullScreen, present, simulatorOptions } = this.state;
    const shouldShowPlay = simulatorOptions.presentations.length > 1;

    return (
      <ThemeSelector>
        <div style={styles.controls}>
          <Button
            color="primary"
            icon={fullScreen ? 'fullscreenExit' : 'fullscreen'}
            onClick={() => this.setState({ fullScreen: !fullScreen })}
          />
          &nbsp; &nbsp;
          {shouldShowPlay && (
            <span>
              <Button
                color="primary"
                icon="previous"
                disabled={present}
                onClick={this.previousPresentation}
              />
              &nbsp;
              <Button
                color="primary"
                icon={present ? 'pause' : 'play'}
                onClick={() => this.setState({ present: !present })}
              />
              &nbsp;
              <Button
                color="primary"
                icon="next"
                disabled={present}
                onClick={this.nextPresentation}
              />
            </span>
          )}
        </div>
      </ThemeSelector>
    );
  }

  renderPreview(presentationPreview, errors, previewMode) {
    const { enableLogs, present, fullScreen, simulatorOptions } = this.state;

    const presentation = {
      ...presentationPreview,
      application_vars: presentationPreview.applicationVariables,
    };

    const theme = (simulatorOptions.themes || []).find(
      t => t.id === presentation.themeId,
    );

    this.setQueryParams(presentation, previewMode, fullScreen, present);

    const appLoader = (
      <AppLoader
        presentation={presentation}
        theme={theme}
        previewErrors={errors}
        enableLogs={enableLogs}
        isPresenting={present}
        isFullscreen={fullScreen}
        auth={simulatorOptions.auth || {}}
        onLoad={this.setOptions}
        onComplete={this.nextPresentation}
      />
    );

    if (fullScreen) {
      return appLoader;
    }

    return (
      <PresentationPreview previewMode={previewMode}>
        {appLoader}
      </PresentationPreview>
    );
  }

  render() {
    const { previewMode } = this.state;
    let { presentation, appVersion, simulatorOptions } = this.state;

    presentation = presentation || EMPTY_PRESENTATION;
    appVersion = appVersion || EMPTY_APP_VERSION;

    presentation = {
      ...mergeDefaultAppVars(
        presentation,
        appVersion,
        simulatorOptions.soundZones,
        simulatorOptions.playlists,
      ),
      id: String(presentation.id),
    };

    return (
      <ThemeProvider theme={theme}>
        <App color="grey">
          <div style={styles.container}>
            {this.renderControls()}
            <PresentationBuilder
              previewMode={previewMode}
              presentation={{
                ...presentation,
                applicationVariables: presentation.application_vars,
              }}
              appVersion={{
                ...appVersion,
                iconUrl: appVersion.icon_url,
                presentationProperties: appVersion.presentation_properties,
              }}
              themes={simulatorOptions.themes}
              soundZones={simulatorOptions.soundZones}
              playlists={simulatorOptions.playlists}
              minDuration={PRESENTATION_MIN_DURATION}
            >
              {(presentationPreview, errors, previewMode) =>
                this.renderPreview(presentationPreview, errors, previewMode)
              }
            </PresentationBuilder>
          </div>
        </App>
      </ThemeProvider>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    background: '#000',
    display: 'flex',
  },
  builder: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  controls: {
    position: 'fixed',
    zIndex: 100,
    bottom: 0,
    left: 0,
    boxSizing: 'border-box',
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
  },
};

export default RaydiantAppSimulator;

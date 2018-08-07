import * as EventEmitter from 'eventemitter3';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import ErrorMessage from './ErrorMessage';
import frontpage from './themes/frontpage';

export const ERROR_DISPLAY_TIME = 5000;
export const RETRY_PRESENTATION_TIME = 15000;

const miraAppIdentifier = Symbol();
export const isMiraApp = (component: any) =>
  component.isMiraApp === miraAppIdentifier;

interface MiraAppProps {
  presentation: {
    name: string;
    theme: { [key: string]: string };
    application_vars: { [key: string]: any };
  };
  miraEvents: EventEmitter;
  miraFileResource: (file: { url: string }) => any;
  miraRequestResource: (url: string) => any;
  strings: { [key: string]: string };
}

interface MiraAppState {
  isPlaying: boolean;
  playCount: number;
  error?: Error;
}

export default function withMiraApp(App: React.ComponentType<any>) {
  const appName = App.name || App.displayName;

  class WrappedComponent extends React.Component<MiraAppProps, MiraAppState> {
    static displayName = `withMiraApp(${appName || 'App'})`;

    static isMiraApp = miraAppIdentifier;

    // Typescript and prop-types have overlap, normally only Typescript types will suffice but
    // propTypes can validate at runtime. Since the runtime checks are valuable when consuming
    // this component in the Simulator, we are defining prop types here. In the future, we may
    // be able to avoid the duplication with https://github.com/gcanti/prop-types-ts.
    static propTypes = {
      presentation: PropTypes.shape({
        name: PropTypes.string.isRequired,
        application_vars: PropTypes.object.isRequired,
        theme: PropTypes.object,
      }).isRequired,
      miraEvents: PropTypes.shape({
        on: PropTypes.func.isRequired,
        emit: PropTypes.func.isRequired,
      }).isRequired,
      miraFileResource: PropTypes.func.isRequired,
      miraRequestResource: PropTypes.func.isRequired,
      strings: PropTypes.object,
    };

    state: MiraAppState = {
      isPlaying: false,
      playCount: 0,
      error: null,
    };

    hasSentReady = false;
    errorDisplayTimeout: NodeJS.Timer;
    retryTimeout: NodeJS.Timer;

    componentDidMount() {
      this.props.miraEvents.on('play', () => {
        const { error, playCount } = this.state;
        if (error) {
          // An error occurred before we received the play event, delay
          // the presentation_complete event to allow photon enough time
          // to queue the next presentation. If the presentation is the only
          // one in the sequence, we will attempt to load it again in case
          // the error is due to a temporary network disconnect.
          if (playCount === 0) {
            this.errorDisplayTimeout = setTimeout(
              this.handlePresentationComplete,
              ERROR_DISPLAY_TIME,
            );
          } else {
            this.retryTimeout = setTimeout(
              () => this.setState({ error: null }),
              RETRY_PRESENTATION_TIME,
            );
          }
        }

        this.setState({
          isPlaying: true,
          playCount: playCount + 1,
        });
      });
    }

    componentWillReceiveProps() {
      // Clear any previous errors to allow the app to recover.
      this.setState({ error: null });
    }

    componentWillUnmount() {
      clearTimeout(this.errorDisplayTimeout);
      clearTimeout(this.retryTimeout);
    }

    handlePresentationReady = () => {
      // Emit presentation_ready after fetching initial resources.
      // Applications are preloaded before switching to the next
      // presentation and this will notify the device when it is
      // ready to become the active presentation.
      if (!this.hasSentReady) {
        this.props.miraEvents.emit('presentation_ready');
        this.hasSentReady = true;
      }
    };

    handlePresentationComplete = () => {
      // All apps must emit a presentation_complete event to trigger the
      // next presentation to run. This could be after a video end event,
      // a user-defined duration from application variables, an error, etc...
      this.props.miraEvents.emit('presentation_complete');
    };

    handlePresentationError = (error: Error) => {
      const { presentation } = this.props;
      // Fire presentation complete immediately if we are currently playing.
      // Otherwise, fire presentation_ready so that play is triggered.
      if (this.state.isPlaying) {
        this.handlePresentationComplete();
      } else {
        this.handlePresentationReady();
      }

      // Show the error.
      this.setState({ error });

      // tslint:disable-next-line
      console.error(
        `Presentation error for '${presentation.name}': ${error.message}`,
      );
    };

    getPresentation() {
      const { presentation } = this.props;
      const theme = presentation.theme || {};
      return {
        name: presentation.name,
        values: presentation.application_vars,
        theme: {
          name: theme.name || frontpage.name,
          backgroundColor: theme.background_color || frontpage.background_color,
          bodyFont: theme.body_font || frontpage.body_font,
          bodyTextColor: theme.body_text_color || frontpage.body_text_color,
          headingFont: theme.heading_font || frontpage.heading_font,
          headingTextColor:
            theme.heading_text_color || frontpage.heading_text_color,
          // These are optional fields and should not default to front page to allow
          // apps to handle the default values if not set.
          backgroundImage: theme.background_image,
          backgroundImagePortrait: theme.background_image_portrait,
          heading2Font: theme.heading_2_font,
          heading2TextColor: theme.heading_2_text_color,
          borderColor: theme.border_color,
        },
      };
    }

    render() {
      const { error, isPlaying, playCount } = this.state;

      if (error) {
        return (
          <ErrorMessage
            title="Sorry, unable to display this content."
            message={error.message}
          />
        );
      }

      const {
        miraEvents,
        miraFileResource,
        miraRequestResource,
        strings,
        ...legacyApplicationVars
      } = this.props;

      return (
        <App
          {...legacyApplicationVars}
          presentation={this.getPresentation()}
          isPlaying={isPlaying}
          playCount={playCount}
          onReady={this.handlePresentationReady}
          onComplete={this.handlePresentationComplete}
          onError={this.handlePresentationError}
          miraFileResource={miraFileResource}
          miraRequestResource={miraRequestResource}
          strings={strings}
        />
      );
    }
  }

  // WrappedComponent[miraAppIdentifier] = true;

  return WrappedComponent;
}

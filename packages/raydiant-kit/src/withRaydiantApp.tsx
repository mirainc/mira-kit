import * as EventEmitter from 'eventemitter3';
import * as React from 'react';
import ErrorMessage from './ErrorMessage';
import mapPresentationToProps from './mapPresentationToProps';

export const ERROR_DISPLAY_TIME = 5000;
export const RETRY_PRESENTATION_TIME = 15000;

const raydiantAppIdentifier = Symbol();
export const isRaydiantApp = (component: any) =>
  component.isRaydiantApp === raydiantAppIdentifier;

interface RaydiantAppProps {
  presentation: {
    name: string;
    theme: { [key: string]: string };
    application_vars: { [key: string]: any };
    created_at: string;
    updated_at: string;
    application_id: string;
    application_deployment_id: string;
    application_name: string;
  };
  miraEvents: EventEmitter;
  strings: { [key: string]: string };
  isDashboard: boolean;
  isThumbnail: boolean;
  // Deprecated.
  miraFileResource: (file: { url: string }) => any;
  miraRequestResource: (url: string) => any;
}

interface RaydiantAppState {
  isPlaying: boolean;
  playCount: number;
  error?: Error;
}

export default function withRaydiantApp(
  App: React.ComponentType<any>,
): React.ComponentType<RaydiantAppProps> {
  const appName = App.name || App.displayName;

  class WrappedComponent extends React.Component<
    RaydiantAppProps,
    RaydiantAppState
  > {
    static displayName = `withRaydiantApp(${appName || 'App'})`;

    static isRaydiantApp = raydiantAppIdentifier;

    state: RaydiantAppState = {
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

    render() {
      const { presentation } = this.props;
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
        isDashboard,
        isThumbnail,
        ...legacyApplicationVars
      } = this.props;

      return (
        <App
          {...legacyApplicationVars}
          presentation={mapPresentationToProps(presentation)}
          isPlaying={isPlaying}
          playCount={playCount}
          onReady={this.handlePresentationReady}
          onComplete={this.handlePresentationComplete}
          onError={this.handlePresentationError}
          miraFileResource={miraFileResource}
          miraRequestResource={miraRequestResource}
          strings={strings}
          isDashboard={isDashboard}
          isThumbnail={isThumbnail}
          miraEvents={miraEvents}
        />
      );
    }
  }

  return WrappedComponent;
}

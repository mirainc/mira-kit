import React from 'react';
import { withMiraApp } from 'mira-kit';
import './styles.css';

const VideoPlayer = ({
  presentation,
  isPlaying,
  onReady,
  onComplete,
  onError,
}) => (
  <video
    className="video"
    ref={videoEl => {
      if (videoEl && isPlaying) {
        videoEl.play();
      }
    }}
    src={presentation.values.video.url}
    muted={presentation.values.mute}
    onCanPlay={onReady}
    onEnded={onComplete}
    onError={e => onError(new Error(`Media error: ${e.target.error.code}`))}
  />
);

export default withMiraApp(VideoPlayer);

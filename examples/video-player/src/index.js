import React from 'react';
import { withMiraApp } from 'mira-kit';
import './styles.css';

const VideoPlayer = ({
  video,
  mute,
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
    src={video.url}
    muted={mute}
    onCanPlay={onReady}
    onEnded={onComplete}
    onError={e => onError(new Error(`Media error: ${e.target.error.code}`))}
  />
);

export default withMiraApp(VideoPlayer);

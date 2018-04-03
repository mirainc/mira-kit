import { video, boolean } from 'mira-kit/prop-types';

export default {
  name: 'Video Player',
  description: 'Upload videos to your library.',
  callToAction: 'Upload Video',
  presentationProperties: {
    video: video('Video')
      .helperText('Supports .mp4, .mpeg and .mov')
      .required(),
    mute: boolean('Mute').default(true),
  },
  applicationVariables: {
    'Mira Intro': {
      video: {
        filename: 'mira-intro.mp4',
        url: 'mira-intro.mp4',
      },
    },
    Bars: {
      video: {
        filename: 'bars.mp4',
        url: 'bars.mp4',
      },
    },
    'New Presentation': {},
  },
};

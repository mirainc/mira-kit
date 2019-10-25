import { video, boolean } from 'raydiant-kit/prop-types';

export default {
  name: 'Video Player',
  description: 'Upload videos to your library.',
  callToAction: 'Upload Video',
  properties: {
    video: video('Video')
      .helperText('Supports .mp4, .mpeg and .mov')
      .required(),
    mute: boolean('Mute').default(true),
  },
  simulator: {
    presentations: [
      {
        name: 'How Raydiant Works',
        values: {
          video: {
            filename: 'raydiant-how-it-works.mp4',
            url: 'raydiant-how-it-works.mp4',
          },
        },
      },
      {
        name: 'Bars',
        values: {
          video: {
            filename: 'bars.mp4',
            url: 'bars.mp4',
          },
        },
      },
      {
        name: 'Not Found',
        values: {
          video: {
            filename: 'notfound.mp4',
            url: 'notfound.mp4',
          },
        },
      },
      { name: 'New Presentation' },
    ],
  },
};

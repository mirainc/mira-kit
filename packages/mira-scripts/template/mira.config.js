import * as PropTypes from 'mira-kit/prop-types';

export default {
  name: 'My Mira App',
  description: 'Create your first app with MiraKit.',
  callToAction: 'Create App',
  properties: {
    duration: PropTypes.number('Duration')
      .min(5)
      .default(10)
      .helperText('Time in seconds.'),
  },
  simulator: {
    presentations: [{ name: 'New Presentation' }],
  },
};

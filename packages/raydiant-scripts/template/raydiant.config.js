import * as PropTypes from 'raydiant-kit/prop-types';

export default {
  name: 'My Raydiant App',
  description: 'Create your first app with RaydiantKit.',
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

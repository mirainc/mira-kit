import * as PropTypes from 'mira-kit/prop-types';

export default {
  name: 'My Mira App',
  presentationProperties: {
    duration: PropTypes.number('Duration')
      .min(5)
      .default(10)
      .helperText('Time in seconds.'),
  },
  applicationVariables: {
    'New Presentation': {},
  },
};

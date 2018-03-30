import { string, selection, number } from 'mira-kit/prop-types';

export default {
  name: 'Weather',
  description: 'Display local weather conditions.',
  callToAction: 'Add Weather',
  allowedRequestDomains: ['api.openweathermap.org'],
  presentationProperties: {
    location: string('City')
      .helperText('ie. San Francisco, US')
      .required(),
    units: selection('Temperature')
      .option('imperial', 'Fahrenheit')
      .option('metric', 'Celcius')
      .default('imperial'),
    duration: number('Duration')
      .min(15)
      .default(15)
      .helperText('Time in seconds.'),
  },
  applicationVariables: {
    'San Francisco': { location: 'San Francisco, US', units: 'imperial' },
    Toronto: { location: 'Toronto, CA', units: 'metric' },
    Sydney: { location: 'Sydney, AU', units: 'metric' },
    'New Presentation': {},
    'Not Found': { location: 'Not found' },
  },
};

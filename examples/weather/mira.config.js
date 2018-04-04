import { string, selection, number } from 'mira-kit/prop-types';

export default {
  name: 'Weather',
  description: 'Display local weather conditions.',
  callToAction: 'Add Weather',
  allowedRequestDomains: ['api.openweathermap.org'],
  presentationProperties: {
    city: string('City')
      .helperText('eg. San Francisco, US')
      .required(),
    units: selection('Temperature')
      .option('imperial', 'Fahrenheit')
      .option('metric', 'Celsius')
      .default('imperial'),
    duration: number('Duration')
      .min(15)
      .default(15)
      .helperText('Time in seconds.'),
  },
  applicationVariables: {
    'San Francisco': { city: 'San Francisco, US', units: 'imperial' },
    Toronto: { city: 'Toronto, CA', units: 'metric' },
    Sydney: { city: 'Sydney, AU', units: 'metric' },
    'New Presentation': {},
    'Not Found': { city: 'Not found' },
  },
};

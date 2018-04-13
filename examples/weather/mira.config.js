import { string, selection, number } from 'mira-kit/prop-types';

export default {
  name: 'Weather',
  description: 'Display local weather conditions.',
  callToAction: 'Add Weather',
  allowedRequestDomains: ['api.openweathermap.org'],
  properties: {
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
  simulator: {
    presentations: [
      {
        name: 'San Francisco',
        values: { city: 'San Francisco, US', units: 'imperial' },
      },
      {
        name: 'Toronto',
        values: { city: 'Toronto, CA', units: 'metric' },
      },
      {
        name: 'Sydney',
        values: { city: 'Sydney, AU', units: 'metric' },
      },
      {
        name: 'Not Found',
        values: { city: 'Not found' },
      },
      { name: 'New Presentation' },
    ],
  },
};

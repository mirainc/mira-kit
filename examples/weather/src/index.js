import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMiraApp } from 'mira-kit';
import './styles.css';

const apiUrl = process.env.MIRA_APP_OPENWEATHERMAP_API_URL;
const apiKey = process.env.MIRA_APP_OPENWEATHERMAP_API_KEY;

class Weather extends Component {
  static propTypes = {
    presentation: PropTypes.shape({
      values: PropTypes.shape({
        city: PropTypes.string.isRequired,
        units: PropTypes.oneOf(['imperial', 'metric']).isRequired,
        duration: PropTypes.number.isRequired,
      }),
    }).isRequired,
    isPlaying: PropTypes.bool.isRequired,
    onReady: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  state = {
    weatherData: null,
  };

  async componentDidMount() {
    await this.fetchWeatherData();
  }

  async componentDidUpdate(prevProps) {
    const { presentation, isPlaying, onComplete } = this.props;
    const { city, units, duration } = presentation.values;
    // Re-fetch weather data when props change.
    if (
      prevProps.presentation.values.city !== city ||
      prevProps.presentation.values.units !== units
    ) {
      await this.fetchWeatherData();
    }
    // Start onComplete timeout when app becomes visible.
    if (isPlaying && !this.onCompleteTimeout) {
      this.onCompleteTimeout = setTimeout(onComplete, duration * 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.onCompleteTimeout);
  }

  async fetchWeatherData() {
    const { presentation, onReady, onError } = this.props;
    const { city, units } = presentation.values;
    try {
      const response = await fetch(
        `${apiUrl}?q=${city}&units=${units}&appid=${apiKey}`,
      );
      const weatherData = await response.json();

      if (!response.ok) {
        throw new Error(weatherData.message);
      }

      this.setState({ weatherData });
      onReady();
    } catch (err) {
      onError(err);
    }
  }

  render() {
    const { isPlaying } = this.props;
    const { weatherData } = this.state;
    if (!weatherData) return null;

    const isSunny = weatherData.clouds.all < 20;
    const temp = Math.round(weatherData.main.temp);
    const city = weatherData.name;
    return (
      <div className={`container${isSunny ? ' isSunny' : ''}`}>
        <div className={`text${isPlaying ? ' animate' : ''}`}>
          It's&nbsp;<span className="temp">{temp}&deg;</span>&nbsp;and&nbsp;
          <span className="condition">
            {isSunny ? 'sunny' : 'cloudy'}
          </span>&nbsp;in&nbsp;<span className="city">{city}</span>.
        </div>
      </div>
    );
  }
}

export default withMiraApp(Weather);

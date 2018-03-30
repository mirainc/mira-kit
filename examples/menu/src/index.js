import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMiraApp } from 'mira-kit';
import './styles.css';

class Menu extends Component {
  static propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    onReady: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            itemDescription: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
    duration: PropTypes.number.isRequired,
  };

  componentDidMount() {
    // Imediately call onReady on mount.
    this.props.onReady();
  }

  componentDidUpdate() {
    const { isPlaying, duration, onComplete } = this.props;
    if (isPlaying) {
      clearTimeout(this.onCompleteTimeout);
      this.onCompleteTimeout = setTimeout(onComplete, duration * 1000);
    }
  }

  render() {
    const { isPlaying, categories = [] } = this.props;
    const isPortrait = document.body.clientHeight > document.body.clientWidth;

    return (
      <div className={`container${isPortrait ? ' portrait' : ''}`}>
        {categories.map((category, i) => (
          <div
            key={i}
            className={`section${isPlaying ? ' animate' : ''}`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="heading">{category.name}</div>
            {(category.items || []).map((item, j) => (
              <div key={j} className="item">
                <div className="itemName">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
                <div className="itemDescription">{item.itemDescription}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default withMiraApp(Menu);

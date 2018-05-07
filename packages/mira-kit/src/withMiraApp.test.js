import { shallow, mount } from 'enzyme';
import EventEmitter from 'eventemitter3';
import React from 'react';
import withMiraApp, { ERROR_DISPLAY_TIME, isMiraApp } from './withMiraApp';
import ErrorMessage from './ErrorMessage';

const createProps = () => ({
  miraEvents: new EventEmitter(),
  miraRequestResource: () => Promise.resolve,
  miraFileResource: () => Promise.resolve,
  strings: { string: 'string' },
  presentation: {
    name: 'presentation',
    application_vars: {
      foo: 'bar',
    },
  },
});

const App = () => <div />;

test('Should render app', () => {
  const props = createProps();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const app = wrapper.find(App);
  expect(app.length).toEqual(1);
  const appProps = app.props();
  expect(Object.keys(appProps).length).toEqual(9);
  expect(appProps.presentation.name).toEqual(props.presentation.name);
  expect(appProps.presentation.values).toEqual(
    props.presentation.application_vars,
  );
  expect(appProps.isPlaying).toEqual(false);
  expect(appProps.playCount).toEqual(0);
  expect(typeof appProps.onReady).toEqual('function');
  expect(typeof appProps.onComplete).toEqual('function');
  expect(typeof appProps.onError).toEqual('function');
  expect(appProps.miraRequestResource).toEqual(props.miraRequestResource);
  expect(appProps.miraFileResource).toEqual(props.miraFileResource);
  expect(appProps.strings).toEqual(props.strings);
});

test('Should render error', () => {
  const props = createProps();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  wrapper.instance().setState({ error: new Error('test') });
  const error = wrapper.update().find(ErrorMessage);
  expect(error.length).toEqual(1);
  expect(error.props().message).toEqual('test');
});

test('Should emit presentation_ready once on ready', () => {
  const props = createProps();
  props.miraEvents.emit = jest.fn();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const { onReady } = wrapper.find(App).props();
  // Test that multiple calls to handlePresentationReady only fire one presentation_ready
  onReady();
  onReady();
  expect(props.miraEvents.emit).toHaveBeenCalledTimes(1);
  expect(props.miraEvents.emit.mock.calls[0][0]).toEqual('presentation_ready');
});

test('Should emit presentation_complete on complete', () => {
  const props = createProps();
  props.miraEvents.emit = jest.fn();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const { onComplete } = wrapper.find(App).props();
  onComplete();
  expect(props.miraEvents.emit).toHaveBeenCalledTimes(1);
  expect(props.miraEvents.emit.mock.calls[0][0]).toEqual(
    'presentation_complete',
  );
});

test('Should pass play to App on play event', () => {
  const props = createProps();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  props.miraEvents.emit('play');
  wrapper.update();
  expect(wrapper.find(App).props().isPlaying).toEqual(true);
  expect(wrapper.find(App).props().playCount).toEqual(1);
});

test('Should fire presentation_ready with timeout on error BEFORE play', () => {
  jest.useFakeTimers();
  const props = createProps();
  jest.spyOn(props.miraEvents, 'emit');
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const { onError } = wrapper.find(App).props();
  onError(new Error());
  props.miraEvents.emit('play');
  expect(props.miraEvents.emit).toHaveBeenCalledTimes(2);
  expect(props.miraEvents.emit.mock.calls[0][0]).toEqual('presentation_ready');
  expect(props.miraEvents.emit.mock.calls[1][0]).toEqual('play');
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout.mock.calls[0]).toEqual([
    expect.any(Function),
    ERROR_DISPLAY_TIME,
  ]);
  jest.runAllTimers();
  expect(props.miraEvents.emit).toHaveBeenCalledTimes(3);
  expect(props.miraEvents.emit.mock.calls[2][0]).toEqual(
    'presentation_complete',
  );
  jest.useRealTimers();
});

test('Should fire presentation_complete on error AFTER play', () => {
  const props = createProps();
  jest.spyOn(props.miraEvents, 'emit');
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const { onReady, onError } = wrapper.find(App).props();
  onReady();
  props.miraEvents.emit('play');
  onError(new Error());
  expect(props.miraEvents.emit).toHaveBeenCalledTimes(3);
  expect(props.miraEvents.emit.mock.calls[0][0]).toEqual('presentation_ready');
  expect(props.miraEvents.emit.mock.calls[1][0]).toEqual('play');
  expect(props.miraEvents.emit.mock.calls[2][0]).toEqual(
    'presentation_complete',
  );
});

test('Should increment playCount', () => {
  const props = createProps();
  const mockApp = jest.fn(App);
  const MiraApp = withMiraApp(mockApp);
  mount(<MiraApp {...props} />);
  expect(mockApp).toHaveBeenCalledTimes(1);
  expect(mockApp.mock.calls[0][0].playCount).toEqual(0);
  props.miraEvents.emit('play');
  expect(mockApp).toHaveBeenCalledTimes(2);
  expect(mockApp.mock.calls[1][0].playCount).toEqual(1);
  props.miraEvents.emit('play');
  expect(mockApp).toHaveBeenCalledTimes(3);
  expect(mockApp.mock.calls[2][0].playCount).toEqual(2);
});

test('Should reset error state on props update', () => {
  const props = createProps();
  const MiraApp = withMiraApp(App);
  const wrapper = shallow(<MiraApp {...props} />);
  const { onError } = wrapper.find(App).props();
  const error = new Error();
  onError(error);
  expect(wrapper.state().error).toEqual(error);
  wrapper.setProps(props);
  expect(wrapper.state().error).toEqual(null);
});

test('Should return true for valid Mira app', () => {
  expect(isMiraApp(withMiraApp(App))).toEqual(true);
});

test('Should return false for invalid Mira app', () => {
  expect(isMiraApp(App)).toEqual(false);
});

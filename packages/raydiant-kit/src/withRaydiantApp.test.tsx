import { mount, shallow } from 'enzyme';
import * as EventEmitter from 'eventemitter3';
import * as React from 'react';
import ErrorMessage from './ErrorMessage';
import frontpage from './themes/frontpage';
import withRaydiantApp, {
  ERROR_DISPLAY_TIME,
  isRaydiantApp,
} from './withRaydiantApp';

const createProps = () => ({
  miraEvents: new EventEmitter(),
  miraRequestResource: () => Promise.resolve,
  miraFileResource: () => Promise.resolve,
  strings: { string: 'string' },
  presentation: {
    name: 'presentation',
    theme: {
      name: 'name',
      background_color: 'backgroundColor',
      background_image: 'backgroundImage',
      background_image_portrait: 'backgroundImagePortrait',
      body_font: 'bodyFont',
      body_text_color: 'bodyTextColor',
      heading_font: 'headingFont',
      heading_text_color: 'headingTextColor',
      heading_2_font: 'heading2Font',
      heading_2_text_color: 'heading2TextColor',
      border_color: 'borderColor',
    },
    application_vars: {
      foo: 'bar',
    },
    created_at: '2018-05-30T19:55:17.871355Z',
    updated_at: '2019-10-03T16:41:01.692429Z',
    application_deployment_id: 'c0cb796f-afe5-41bb-85c4-62d3c51134f3',
    application_name: 'TestApp',
    application_id: 'ec2710b1-78a8-4dcb-aaf9-e45f465ed99e',
  },
  isDashboard: false,
  isThumbnail: false,
  device: {
    id: 'my-device',
    name: 'My Device',
  },
});

const App: React.SFC<any> = () => <div />;

test('Should render app', () => {
  const props = createProps();
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(
    <RaydiantApp {...props} isDashboard={true} isThumbnail={true} />,
  );
  const app = wrapper.find(App);
  expect(app.length).toEqual(1);
  const appProps = app.props();
  expect(Object.keys(appProps).length).toEqual(13);
  expect(appProps.presentation.name).toEqual(props.presentation.name);
  expect(appProps.presentation.values).toEqual(
    props.presentation.application_vars,
  );
  expect(appProps.presentation.theme).toEqual({
    name: 'name',
    backgroundColor: 'backgroundColor',
    backgroundImage: 'backgroundImage',
    backgroundImagePortrait: 'backgroundImagePortrait',
    bodyFont: 'bodyFont',
    bodyTextColor: 'bodyTextColor',
    headingFont: 'headingFont',
    headingTextColor: 'headingTextColor',
    heading2Font: 'heading2Font',
    heading2TextColor: 'heading2TextColor',
    borderColor: 'borderColor',
  });
  expect(appProps.presentation.createdAt).toEqual(
    '2018-05-30T19:55:17.871355Z',
  );
  expect(appProps.presentation.updatedAt).toEqual(
    '2019-10-03T16:41:01.692429Z',
  );
  expect(appProps.presentation.applicationDeploymentId).toEqual(
    'c0cb796f-afe5-41bb-85c4-62d3c51134f3',
  );
  expect(appProps.presentation.applicationName).toEqual('TestApp');
  expect(appProps.presentation.applicationId).toEqual(
    'ec2710b1-78a8-4dcb-aaf9-e45f465ed99e',
  );
  expect(appProps.isPlaying).toEqual(false);
  expect(appProps.playCount).toEqual(0);
  expect(typeof appProps.onReady).toEqual('function');
  expect(typeof appProps.onComplete).toEqual('function');
  expect(typeof appProps.onError).toEqual('function');
  expect(appProps.miraRequestResource).toEqual(props.miraRequestResource);
  expect(appProps.miraFileResource).toEqual(props.miraFileResource);
  expect(appProps.strings).toEqual(props.strings);
  expect(appProps.isDashboard).toEqual(true);
  expect(appProps.isThumbnail).toEqual(true);
  expect(appProps.miraEvents).toBeInstanceOf(EventEmitter);
  expect(appProps.device.id).toEqual('my-device');
  expect(appProps.device.name).toEqual('My Device');
});

test('Should render error', () => {
  const props = createProps();
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  wrapper.instance().setState({ error: new Error('test') });
  const error = wrapper.update().find(ErrorMessage);
  expect(error.length).toEqual(1);
  expect(error.props().message).toEqual('test');
});

test('Should emit presentation_ready once on ready', () => {
  const props = createProps();
  const mockEmit = jest.spyOn(props.miraEvents, 'emit');
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onReady } = wrapper.find(App).props();
  // Test that multiple calls to handlePresentationReady only fire one presentation_ready
  onReady();
  onReady();
  expect(mockEmit).toHaveBeenCalledTimes(1);
  expect(mockEmit.mock.calls[0][0]).toEqual('presentation_ready');
});

test('Should emit presentation_complete on complete', () => {
  const props = createProps();
  const mockEmit = jest.spyOn(props.miraEvents, 'emit');
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onComplete } = wrapper.find(App).props();
  onComplete();
  expect(mockEmit).toHaveBeenCalledTimes(1);
  expect(mockEmit.mock.calls[0][0]).toEqual('presentation_complete');
});

test('Should pass play to App on play event', () => {
  const props = createProps();
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  props.miraEvents.emit('play');
  wrapper.update();
  expect(wrapper.find(App).props().isPlaying).toEqual(true);
  expect(wrapper.find(App).props().playCount).toEqual(1);
});

test('Should fire presentation_ready with timeout on error BEFORE play', () => {
  jest.useFakeTimers();
  const props = createProps();
  const mockEmit = jest.spyOn(props.miraEvents, 'emit');
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onError } = wrapper.find(App).props();
  onError(new Error());
  props.miraEvents.emit('play');
  expect(mockEmit).toHaveBeenCalledTimes(2);
  expect(mockEmit.mock.calls[0][0]).toEqual('presentation_ready');
  expect(mockEmit.mock.calls[1][0]).toEqual('play');

  const setTimeout = (window.setTimeout as any) as jest.SpyInstance;
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout.mock.calls[0]).toEqual([
    expect.any(Function),
    ERROR_DISPLAY_TIME,
  ]);
  jest.runAllTimers();
  expect(mockEmit).toHaveBeenCalledTimes(3);
  expect(mockEmit.mock.calls[2][0]).toEqual('presentation_complete');
  jest.useRealTimers();
});

test('Should fire presentation_complete on error AFTER play', () => {
  const props = createProps();
  const mockEmit = jest.spyOn(props.miraEvents, 'emit');
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onReady, onError } = wrapper.find(App).props();
  onReady();
  props.miraEvents.emit('play');
  onError(new Error());
  expect(mockEmit).toHaveBeenCalledTimes(3);
  expect(mockEmit.mock.calls[0][0]).toEqual('presentation_ready');
  expect(mockEmit.mock.calls[1][0]).toEqual('play');
  expect(mockEmit.mock.calls[2][0]).toEqual('presentation_complete');
});

test('Should reset error state with timeout when playCount > 1', () => {
  jest.useFakeTimers();
  const props = createProps();
  const mockEmit = jest.spyOn(props.miraEvents, 'emit');
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onReady, onError } = wrapper.find(App).props();
  onReady();
  props.miraEvents.emit('play');
  onError(new Error());
  props.miraEvents.emit('play');
  expect(mockEmit).toHaveBeenCalledTimes(4);
  expect(mockEmit.mock.calls[0][0]).toEqual('presentation_ready');
  expect(mockEmit.mock.calls[1][0]).toEqual('play');
  expect((wrapper.state() as any).error).toBeDefined();
  expect(mockEmit.mock.calls[2][0]).toEqual('presentation_complete');
  expect(mockEmit.mock.calls[3][0]).toEqual('play');
  // Run timeout to check if error is reset.
  jest.runAllTimers();
  expect((wrapper.state() as any).error).toEqual(null);
});

test('Should increment playCount', () => {
  const props = createProps();
  const mockApp = jest.fn(App);
  const RaydiantApp = withRaydiantApp(mockApp);
  mount(<RaydiantApp {...props} />);
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
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const { onError } = wrapper.find(App).props();
  const error = new Error();
  onError(error);
  expect((wrapper.state() as any).error).toEqual(error);
  wrapper.setProps(props);
  expect((wrapper.state() as any).error).toEqual(null);
});

test('Should default to frontpage theme if no theme provided', () => {
  const props = createProps();
  props.presentation.theme = null;
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const app = wrapper.find(App);
  const appProps = app.props();
  expect(appProps.presentation.theme).toEqual({
    name: frontpage.name,
    backgroundColor: frontpage.background_color,
    bodyFont: frontpage.body_font,
    bodyTextColor: frontpage.body_text_color,
    headingFont: frontpage.heading_font,
    headingTextColor: frontpage.heading_text_color,
    // Optional properties, they should not be set.
    // backgroundImage: frontpage.background_image,
    // backgroundImagePortrait: frontpage.background_image_portrait,
    // heading2Font: frontpage.heading_2_font,
    // heading2TextColor: frontpage.heading_2_text_color,
    // borderColor: frontpage.border_color,
  });
});

test('Should default to frontpage if theme not set', () => {
  const props = createProps();
  props.presentation.theme.heading_font = null;
  const RaydiantApp = withRaydiantApp(App);
  const wrapper = shallow(<RaydiantApp {...props} />);
  const app = wrapper.find(App);
  const appProps = app.props();
  expect(appProps.presentation.theme.headingFont).toEqual(
    frontpage.heading_font,
  );
});

test('Should return true for valid Raydiant app', () => {
  expect(isRaydiantApp(withRaydiantApp(App))).toEqual(true);
});

test('Should return false for invalid Raydiant app', () => {
  expect(isRaydiantApp(App)).toEqual(false);
});

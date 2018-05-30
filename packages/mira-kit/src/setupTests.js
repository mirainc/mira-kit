import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Supress console errors during tests.
global.console.error = () => {};

configure({ adapter: new Adapter() });

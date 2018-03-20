import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

// Supress console errors during tests.
global.console.error = () => {};

configure({ adapter: new Adapter() });

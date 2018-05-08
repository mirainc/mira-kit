import ArrayType from './ArrayType';
import BooleanType from './BooleanType';
import FileType from './FileType';
import ImageType from './ImageType';
import NumberType from './NumberType';
import SelectionType from './SelectionType';
import StringType from './StringType';
import TextType from './TextType';
import ThemeType from './ThemeType';
import VideoType from './VideoType';

export const array = (label, singular) => new ArrayType(label, singular);
export const boolean = label => new BooleanType(label);
export const file = label => new FileType(label);
export const image = label => new ImageType(label);
export const number = label => new NumberType(label);
export const selection = label => new SelectionType(label);
export const string = label => new StringType(label);
export const text = label => new TextType(label);
export const theme = label => new ThemeType(label);
export const video = label => new VideoType(label);

export { default as extractProperties } from './extractProperties';

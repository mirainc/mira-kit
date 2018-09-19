import ArrayType from './ArrayType';
import BooleanType from './BooleanType';
import FileType from './FileType';
import ImageType from './ImageType';
import NumberType from './NumberType';
import OAuthType from './OAuthType';
import SelectionType from './SelectionType';
import StringType from './StringType';
import TextType from './TextType';
import ThemeType from './ThemeType';
import VideoType from './VideoType';

export const array = (label: string, singular: string) =>
  new ArrayType(label, singular);
// tslint:disable-next-line
export const boolean = (label: string) => new BooleanType(label);
export const file = (label: string) => new FileType(label);
export const image = (label: string) => new ImageType(label);
// tslint:disable-next-line
export const number = (label: string) => new NumberType(label);
export const oAuth = (label: string) => new OAuthType(label);
export const selection = (label: string) => new SelectionType(label);
// tslint:disable-next-line
export const string = (label: string) => new StringType(label);
export const text = (label: string) => new TextType(label);
export const theme = (label?: string) => new ThemeType(label);
export const video = (label: string) => new VideoType(label);

export { default as extractProperties } from './extractProperties';

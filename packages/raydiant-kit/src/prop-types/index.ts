import ArrayType from './ArrayType';
import BooleanType from './BooleanType';
import FacebookAuthType from './FacebookAuthType';
import FileType from './FileType';
import GoogleAuthType from './GoogleAuthType';
import ImagePickerType from './ImagePickerType';
import ImageType from './ImageType';
import NumberType from './NumberType';
import OAuthType from './OAuthType';
import PlaylistType from './PlaylistType';
import SelectionType from './SelectionType';
import SoundZoneType from './SoundZoneType';
import StringType from './StringType';
import TextType from './TextType';
import ThemeType from './ThemeType';
import VideoType from './VideoType';

export const array = (label: string, singular: string) =>
  new ArrayType(label, singular);
// tslint:disable-next-line
export const boolean = (label: string) => new BooleanType(label);
export const facebookAuth = () => new FacebookAuthType();
export const file = (label: string) => new FileType(label);
export const googleAuth = () => new GoogleAuthType();
export const image = (label: string) => new ImageType(label);
export const imagePicker = () => new ImagePickerType();
// tslint:disable-next-line
export const number = (label: string) => new NumberType(label);
export const oAuth = (label: string) => new OAuthType(label);
export const playlist = (label: string) => new PlaylistType(label);
export const soundZone = (label: string) => new SoundZoneType(label);
export const selection = (label: string) => new SelectionType(label);
// tslint:disable-next-line
export const string = (label: string) => new StringType(label);
export const text = (label: string) => new TextType(label);
export const theme = (label?: string) => new ThemeType(label);
export const video = (label: string) => new VideoType(label);

export { default as extractProperties } from './extractProperties';

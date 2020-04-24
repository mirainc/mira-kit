import OAuthType from './OAuthType';

export default class GoogleAuthType extends OAuthType {
  constructor() {
    super('', 'googleAuth');
  }
}

import BaseType, { PropType } from './BaseType';

interface OAuthPropType extends PropType {
  authUrl: string;
  verifyUrl: string;
  verifyQsParam: string;
}

export default class OAuthType extends BaseType<OAuthPropType> {
  constructor(label: string) {
    super(label, 'oAuth');
  }

  authUrl(url: string) {
    this.propType.authUrl = url;
    return this;
  }

  verifyUrl(url: string, queryStringParam: string = 'token') {
    this.propType.verifyUrl = url;
    this.propType.verifyQsParam = queryStringParam;
    return this;
  }
}

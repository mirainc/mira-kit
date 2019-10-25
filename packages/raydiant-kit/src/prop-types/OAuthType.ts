import BaseType, { PropType } from './BaseType';

interface OAuthPropType extends PropType {
  authUrl: string;
  verifyUrl: string;
  verifyQsParam: string;
  logoutUrl: string;
  logoutQsParam: string;
}

export default class OAuthType extends BaseType<OAuthPropType> {
  constructor(label: string, type = 'oAuth') {
    super(label, type);
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

  logoutUrl(url: string, queryStringParam: string = 'token') {
    this.propType.logoutUrl = url;
    this.propType.logoutQsParam = queryStringParam;
    return this;
  }
}

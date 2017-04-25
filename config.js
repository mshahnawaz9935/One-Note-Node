module.exports = {
  //Live Connect API information
  clientID: 'd23a1a63-2516-4822-bbef-ac9fbf1c05fa',
  clientSecret: 'DrqO19XuXbGyHVz3oULCHdX',
  baseSite :'https://login.live.com',
  authorizePath : '/oauth20_authorize.srf',
  tokenURL : '/oauth20_token.srf',
  redirectUrl: 'http://localhost:3000/callback',
  authURLParams: {
    scope: ['wl.signin', 'wl.basic', 'wl.offline_access', 'office.onenote_create', 'Office.onenote', 'Office.onenote_update', 'Office.onenote_update_by_app'],
    display: 'page',
    locale: 'en',
    response_type: 'code'
  },
  grant_type :'authorization_code'

};

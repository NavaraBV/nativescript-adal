declare var ADAuthenticationContext: any;
declare var ADAuthenticationResult: any;
declare var ADAuthenticationSettings: any;
declare var interop: any;
declare var NSURL: any;

export class AdalContext {

  private authError: any;
  private authResult: ADAuthenticationResult;
  private authority: string;
  private clientId: string;
  private context: ADAuthenticationContext;
  private redirectUri: string = 'urn:ietf:wg:oauth:2.0:oob';
  private resourceId: string;
  private userId: string;

  // Authority is in the form of https://login.microsoftonline.com/yourtenant.onmicrosoft.com
  constructor(authority: string, clientId: string, resourceId: string) {
    this.authError = new interop.Reference();
    this.authority = authority;
    this.clientId = clientId;
    this.resourceId = resourceId;
    ADAuthenticationSettings.sharedInstance().setDefaultKeychainGroup(null);
    this.context = ADAuthenticationContext.authenticationContextWithAuthorityError(this.authority, this.authError);
  }

  public login(): Promise<string> {
    this.authError = new interop.Reference();
    return new Promise<string>((resolve, reject) => {
      this.context.acquireTokenWithResourceClientIdRedirectUriCompletionBlock(
        this.resourceId,
        this.clientId,
        NSURL.URLWithString(this.redirectUri),
        (result: ADAuthenticationResult) => {
          this.authResult = result;
          this.userId = result.tokenCacheItem.userInformation.userObjectId;
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.accessToken);
          }
        });
    });
  }

  public getToken(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.context.acquireTokenSilentWithResourceClientIdRedirectUriCompletionBlock(
        this.clientId,
        this.clientId,
        NSURL.URLWithString(this.redirectUri),
        (result: ADAuthenticationResult) => {
          resolve(result.accessToken);
        }
      );
    });
  }
}
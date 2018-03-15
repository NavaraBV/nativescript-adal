/// <reference path="./platforms/ios/typings/adal-library.ios.d.ts" />import { isIOS } from "tns-core-modules/ui/frame/frame";


import { getString, setString } from "tns-core-modules/application-settings";
declare var interop: any;
declare var NSURL: any;

export interface MultiPlatformRedirectUri {
  ios: string;
  android: string;
}

export class AdalContext {

  private authError: any;
  private authResult: ADAuthenticationResult;
  private authority: string;
  private clientId: string;
  private context: ADAuthenticationContext;
  private redirectUri: string = 'urn:ietf:wg:oauth:2.0:oob';
  private useBroker: boolean;
  private resourceId: string;
  private userId: string;

  // Authority is in the form of https://login.microsoftonline.com/yourtenant.onmicrosoft.com
  constructor(authority: string, clientId: string, resourceId: string, redirectUri?: MultiPlatformRedirectUri | string, useBroker?: boolean) {
    this.authError = new interop.Reference();
    this.authority = authority;
    this.clientId = clientId;
    this.resourceId = resourceId;
    if(redirectUri != null) {
      if (typeof redirectUri === "string") {
        this.redirectUri = redirectUri;
      } else {
        this.redirectUri = redirectUri.ios;
      }
    }
    this.useBroker = ((useBroker == null) ? false : useBroker);
    
  }
  public initContext() {
    if(this.context != null) {
      console.log("Context already initialised");
      return;
    } 
    ADAuthenticationSettings.sharedInstance().setDefaultKeychainGroup(null);
    this.context = ADAuthenticationContext.authenticationContextWithAuthorityError(this.authority, this.authError);
    if(this.useBroker) {
      this.context.credentialsType = ADCredentialsType.D_CREDENTIALS_AUTO;
    } else {
      this.context.credentialsType = ADCredentialsType.D_CREDENTIALS_EMBEDDED;
    }
  }
  public login(): Promise<string> {
    if(!this.isContextInit()) {
      this.initContext();
    }
    this.authError = new interop.Reference();
    return new Promise<string>((resolve, reject) => {
      this.context.acquireTokenWithResourceClientIdRedirectUriCompletionBlock(
        this.resourceId,
        this.clientId,
        NSURL.URLWithString(this.redirectUri),
        (result: ADAuthenticationResult) => {
          this.authResult = result;
          if (result.error) {
            reject(result.error);
          } else {
            this.userId = result.tokenCacheItem.userInformation.userObjectId;
            resolve(result.accessToken);
          }
        });
    });
  }

  public getToken(): Promise<string> {
    if(!this.isContextInit()) {
      this.initContext();
    }
    return new Promise<string>((resolve, reject) => {
      this.context.acquireTokenSilentWithResourceClientIdRedirectUriCompletionBlock(
        this.resourceId,
        this.clientId,
        NSURL.URLWithString(this.redirectUri),
        (result: ADAuthenticationResult) => {
          if(result.accessToken == null) {
            Promise.resolve().then(() => {
              this.context.acquireTokenWithResourceClientIdRedirectUriCompletionBlock(
                this.resourceId,
                this.clientId,
                NSURL.URLWithString(this.redirectUri),
                (result: ADAuthenticationResult) => {
                  this.authResult = result;
                  if (result.error) {
                    reject(result.error);
                  } else {
                    this.userId = result.tokenCacheItem.userInformation.userObjectId;
                    resolve(result.accessToken);
                  }
                });
              });
          } else {
            resolve(result.accessToken);
          }
        }
      );
    });
  }

  private isContextInit(): boolean {
    if(this.context == null) {
      console.log("Context not initialised");
      return false;
    }
    console.log("Context initialised");
    return true;
  }
}
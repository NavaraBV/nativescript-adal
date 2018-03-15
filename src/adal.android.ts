/// <reference path="./platforms/android/typings/adal-library.android.d.ts" />

import * as application from 'tns-core-modules/application';
import * as utils from 'tns-core-modules/utils/utils';
import { isAndroid } from 'tns-core-modules/ui/frame/frame';
import { getString, setString } from "tns-core-modules/application-settings";

export interface MultiPlatformRedirectUri {
  ios: string;
  android: string;
}

const USERID_KEY = "USER_ID";
const LOGINHINT_KEY = "LOGIN_HINT";

export class AdalContext {

  private activity: any;
  private authority: string;
  private clientId: string;
  private context: com.microsoft.aad.adal.AuthenticationContext;
  private _loginHint: string;
  private get loginHint(): string {
    if(this.useBroker) {
      return '';
    }
    if(this._loginHint == null) {
      this._loginHint = getString(LOGINHINT_KEY);
      if(this._loginHint == null) {
        this.loginHint = '';
      }
    }
    return this._loginHint;
  }
  private set loginHint(value: string) {
    this._loginHint = value;
    setString(LOGINHINT_KEY, this._loginHint);
  }
  private redirectUri: string = 'urn:ietf:wg:oauth:2.0:oob';
  private useBroker: boolean;
  private resourceId: string;
  private _userId: string;
  private get userId(): string {
    if(this._userId == null) {
      this._userId = getString(USERID_KEY);
    }
    return this._userId;
  }
  private set userId(value: string) {
    this._userId = value;
    setString(USERID_KEY, this._userId);
  }
  // Authority is in the form of https://login.microsoftonline.com/yourtenant.onmicrosoft.com
  constructor(authority: string, clientId: string, resourceId: string, redirectUri?: MultiPlatformRedirectUri | string, useBroker?: boolean) {
    this.authority = authority;
    this.clientId = clientId;
    this.resourceId = resourceId;
    if(redirectUri != null) {
      if (typeof redirectUri === "string") {
        this.redirectUri = redirectUri;
      } else {
        this.redirectUri = redirectUri.android;
      }
    }
    this.useBroker = ((useBroker == null) ? false : useBroker);
  };
  public initContext() {
    if(this.context != null) {
      console.log("Context already initialised");
      return;
    }
    this.activity = application.android.foregroundActivity || application.android.startActivity;
    this.context = new com.microsoft.aad.adal.AuthenticationContext(utils.ad.getApplicationContext(), this.authority, true);
    com.microsoft.aad.adal.AuthenticationSettings.INSTANCE.setUseBroker(this.useBroker);
    application.android.on('activityResult', (args) => {
      let intent: android.content.Intent = args.activity.getIntent();
      if (this.context) {
        this.context.onActivityResult(args.requestCode, args.resultCode, args.intent);
      }
    });
  }
  public login(): Promise<string> {
    if(!this.isContextInit()) {
      this.initContext();
    }
    var that = this;
    return new Promise<string>((resolve: any, reject: any) => {
      this.context.acquireToken(
        this.activity,
        this.resourceId,
        this.clientId,
        this.redirectUri,
        this.loginHint,
        new com.microsoft.aad.adal.AuthenticationCallback({
          onSuccess(result: com.microsoft.aad.adal.AuthenticationResult): void {
            that.userId = result.getUserInfo().getUserId();
            that.loginHint = result.getUserInfo().getDisplayableId();
            resolve(result.getAccessToken());
          },
          onError(error: javalangException): void {
            reject(error);
          }
        })
      );
    });
  }

  public getToken(): Promise<string> {
    if(!this.isContextInit()) {
      this.initContext();
    }
    if(this.userId == null) {
       return this.login();
    }
    var that = this;
    return new Promise<string>((resolve: any, reject) => {
      this.context.acquireTokenSilentAsync(
        this.resourceId,
        this.clientId,
        this.userId,
        new com.microsoft.aad.adal.AuthenticationCallback({
          onSuccess(result: com.microsoft.aad.adal.AuthenticationResult): void {
            console.log("expires on = " + result.getExpiresOn().toGMTString());
            that.userId = result.getUserInfo().getUserId();
            that.loginHint = result.getUserInfo().getDisplayableId();
            resolve(result.getAccessToken());
          },
          onError(error: javalangException): void {
            if (error instanceof com.microsoft.aad.adal.AuthenticationException) {
              if(error.getCode() == com.microsoft.aad.adal.ADALError.AUTH_REFRESH_FAILED_PROMPT_NOT_ALLOWED) {
                that.context.acquireToken(
                  that.activity,
                  that.resourceId,
                  that.clientId,
                  that.redirectUri,
                  that.loginHint,
                  new com.microsoft.aad.adal.AuthenticationCallback({
                    onSuccess(result: com.microsoft.aad.adal.AuthenticationResult): void {
                      that.userId = result.getUserInfo().getUserId();
                      that.loginHint = result.getUserInfo().getDisplayableId();
                      resolve(result.getAccessToken());
                    },
                    onError(error: javalangException): void {
                      reject(error);
                    }
                  }));
                return;
              }
            }
            reject(error);
          }
        })
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
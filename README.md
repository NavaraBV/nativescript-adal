# NativeScript Active Directory Authentication Library Plugin

[![Build Status](https://travis-ci.org/NavaraBV/nativescript-adal.svg?branch=master)](https://travis-ci.org/NavaraBV/nativescript-adal)

This plugin allows you to quickly add Azure Active Directory Authentication to your NativeScript app

## Prerequisites / Requirements

Your application requires to be registered inside your Azure Active Directory (AAD). Visit the [Azure Portal](https://portal.azure.com) and log in with your organizational account. Grab your Azure AD Tenant ID and Application ID after registering your application.

## Installation

```javascript
tns plugin add @navara/nativescript-adal
```

## Usage 

Import the AdalContext class in application in, for example, an AuthenticationService.

```javascript
import { AdalContext } from 'nativescript-adal';
```

Set your Azure AD constants (or import them from a configuration file)

```javascript
const authority: string = 'https://login.microsoftonline.com/{your-tenant-id}';
const clientId: string = '{your-application-id}';
const resourceId: string = '00000002-0000-0000-c000-000000000000';
```

Initialize the AdalContext

```javascript
this.adalContext = new AdalContext(authority, clientId, resourceId);
```

Then, expose the methods using your own login and token methods, for example:

```javascript
login(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    this.adalContext.login().then((result) => {
      resolve(result);
    }).catch(error => {
      reject(error);
    });
  });
}

getToken(): Promise<string> {
  return new Promise<string>((resolve) => {
    resolve(this.adalContext.getToken());
  });
}
```

...and consume these in your application!

## Known issues on iOS

#### Trouble running on the simulator
Open or create `App_Resources/iOS/<appname>.entitlements` and add these two keys with the value `true`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.keystore.access-keychain-keys</key>
    <true/>
    <key>com.apple.keystore.device</key>
    <true/>
</dict>
</plist>
```
    
## License

See [LICENSE](LICENSE) for details.
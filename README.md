# NativeScript Active Directory Authentication Library Plugin

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![BCH compliance][bch-url-repo]][bch-url]

[build-status]:https://travis-ci.org/NavaraBV/nativescript-adal.svg?branch=master
[build-url]:https://travis-ci.org/NavaraBV/nativescript-adal
[bch-url-repo]:https://bettercodehub.com/edge/badge/NavaraBV/nativescript-adal?branch=master
[bch-url]:https://bettercodehub.com/
[npm-image]:https://img.shields.io/npm/v/@navara/nativescript-adal.svg
[npm-url]:https://npmjs.org/package/@navara/nativescript-adal
[downloads-image]:http://img.shields.io/npm/dm/@navara/nativescript-adal.svg

This plugin allows you to quickly add Azure Active Directory Authentication to your NativeScript app

## Prerequisites / Requirements

Your application requires to be registered inside your Azure Active Directory (AAD). Visit the [Azure Portal](https://portal.azure.com) and log in with your organizational account. Grab your Azure AD Tenant ID and Application ID after registering your application.

## Installation

```javascript
tns plugin add @navara/nativescript-adal
```

## Usage (Angular example)

Import the AdalContext class in application in, for example, an 'AdalService' and initialize it.

```javascript
import { Injectable } from '@angular/core';
import { AdalContext } from '@navara/nativescript-adal';

const authority: string = 'https://login.microsoftonline.com/{your-tenant-id}';
const clientId: string = '{your-application-id}';
const resourceId: string = '00000002-0000-0000-c000-000000000000';

@Injectable()
export class AdalService {

  public adalContext: AdalContext;

  constructor() {
    this.adalContext = new AdalContext(authority, clientId, resourceId);
  }
}
```

...and consume this service in your application!

```javascript
export class AppComponent {

  constructor(private adalService: AdalService) { }

  public login() {
    this.adalService.adalContext.login().then((result) => {
      console.log('Success!');
    })
  }
}
```

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

import { EventData, Observable } from 'tns-core-modules/data/observable';
import { TextField } from 'tns-core-modules/ui/text-field';
import { TextView } from 'tns-core-modules/ui/text-view';
import { AdalContext } from '@navara/nativescript-adal';

const authority: string = 'https://login.microsoftonline.com/common';
const clientId: string = '00000000-0000-0000-0000-000000000000';
const resourceId: string = '00000002-0000-0000-c000-000000000000';

export class HelloWorldModel extends Observable {

  private adalContext: AdalContext;

  constructor() {
    super();
    this.adalContext = new AdalContext(authority, clientId, resourceId);
  }

  public onLogin(): void {
    console.log('Logging in!');
    this.adalContext.login().then((result) => {
      console.log('Success! ' + result);
    }).catch(error => {
      console.log('Error! ' + error);
    });
  }

  public onToken(): void {
    console.log('Fetching token!');
    this.adalContext.getToken().then((result) => {
      console.log('Token is: ' + result);
    });
  }
}

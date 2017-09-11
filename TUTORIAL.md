# Tutorial
Ionic-Bluetooth-Serial Template

Last Update: 08. September 2017

## How to create this template?

1. Open the folder where the project should be created and run the command below. 
If you are in folder 'c:\projects\' the folder 'c:\projects\ionic-bluetooth-serial' will be created with all necessary files of the ionic project.
  ```bash
  $ ionic start ionic-bluetooth-serial blank
  ```
2. Open the folder, which you created the step before and run the command below.
If everything was installed successfully a web browser will be open and show you the Ionic blank page of the project.
  ```bash
  $ ionic serve
  ```
3. Install the Ionic Native plugin 'bluetooth-serial' to the file '/package.json':
  ```bash
  $ npm install @ionic-native/bluetooth-serial@3.12.1
  ```
4. Add the Cordova plugin 'cordova-plugin-bluetooth-serial' to the file '/config.xml':
  ```bash
  $ ionic cordova plugin add cordova-plugin-bluetooth-serial@0.4.7
  ```
5. Add the plugin 'bluetooth-serial' to the app's module /src/app/app.module.ts':
  ```ts
  import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
  providers: [ ... BluetoothSerial ... ]
  ```
6. Add the following code to the page '/src/pages/home/home.ts'
  ```ts
  import { Component } from '@angular/core';
  import { AlertController, NavController } from 'ionic-angular';
  import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
  
  @Component({
    selector: 'page-home',
    templateUrl: 'home.html'
  })
  export class HomePage {
  
    public unpairedDevices: any;
    public pairedDevices: any;
    public gettingDevices: Boolean;
  
    constructor(
      private _bluetoothSerial: BluetoothSerial,
      public alertCtrl: AlertController
    ) {
      let obj = this;
  
      // Check, if Bluetooth is enabled:
      this._bluetoothSerial.isEnabled().then(
        (result: any) => {
          console.log(result);
  
        },
        (error: any) => {
          console.log(error);
  
          obj._enableBluetooth();
        }
      );
    }
  
    private _enableBluetooth(): void {
      this._bluetoothSerial.enable().then(
        (success: any) => {
          console.log(success);
  
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
    public startScanning(): void {
      this.pairedDevices = null;
      this.unpairedDevices = null;
      this.gettingDevices = true;
  
      this._bluetoothSerial.discoverUnpaired().then(
        (result: any) => {
          console.log(result);
  
          this.unpairedDevices = result;
          this.gettingDevices = false;
  
          result.forEach(element => {
            console.log(element);
          });
        },
        (error: any) => {
          console.log(error);
        }
      );
  
      this._bluetoothSerial.list().then(
        (result: any) => {
          console.log(result);
  
          this.pairedDevices = result;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  
    public selectDevice(address: any): any {
      console.log(address);
  
      let alert = this.alertCtrl.create({
        title:    'Connect?',
        message:  'Do you want to connect to the device?',
        buttons:  [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked.');
            }
          },
          {
            text: 'Connect',
            handler: () => {
              this._bluetoothSerial.connectInsecure(address).subscribe(this._success, this._fail);
            }
          }
        ]
      });
      alert.present();
    }
  
    private _success = (data) => console.log(data);
    
    private _fail = (error) => console.log(error);
  
    public disconnect(): void {
      let alert = this.alertCtrl.create({
        title:    'Disconnect?',
        message:  'Do you want to disconnect from the device?',
        buttons:  [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked.');
            }
          },
          {
            text: 'Disconnect',
            handler: () => {
              this._bluetoothSerial.disconnect();
            }
          }
        ]
      });
      alert.present();
    }
  }
  ```
7. Add the following code to the page '/src/pages/home/home.html'
  ```html
  <ion-header>
    <ion-navbar>
      <ion-title>Ionic Bluetooth Serial</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <ion-list padding>
      <ion-list-header>Paired Devices:</ion-list-header>
      <ion-item *ngFor="let device of pairedDevices">
        {{device.name}}
      </ion-item>
      <button ion-button block (click)="startScanning()">scan</button>
    </ion-list>
    <ion-list padding>
      <ion-list-header>Availlable Devices:</ion-list-header>
      <ion-item *ngFor='let device of unpairedDevices'>
        <span (click)="selectDevice(device.address)">
          {{device.name}}
        </span>
      </ion-item>
      <ion-item text-center>
        <ion-spinner name="crescent" *ngIf="gettingDevices"></ion-spinner>
      </ion-item>
      <button ion-button block (click)="disconnect()">Disconnect</button>
    </ion-list>
  </ion-content>
  ```
8. Build the project:
  ```bash
  $ npm run build
  ```

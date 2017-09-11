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

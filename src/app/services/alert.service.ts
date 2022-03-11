import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(public alertController: AlertController) {}

  public async showError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Oops',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  public async showSuccess(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Hurray...',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

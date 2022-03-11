import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public loading: any = null;

  constructor(public loadingController: LoadingController) {}

  async showLoader() {
    this.loading = await this.loadingController.create({
      // cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissLoader() {
    this.loadingController.dismiss();
  }
}

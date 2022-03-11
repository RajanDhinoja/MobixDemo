import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { MenuController } from '@ionic/angular';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public verNo: any = null;

  constructor(
    private appVersion: AppVersion,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) {
    this.appVersion
      .getVersionNumber()
      .then((value) => {
        this.verNo = value;
      })
      .catch((err) => {
        this.alertService.showError(err?.message);
      });
  }

  public logout() {
    this.menu.close();
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['login']);
  }

  public closeMenu() {
    this.menu.close();
  }
}

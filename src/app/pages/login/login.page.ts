import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/models/User';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup = null;
  public validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long.',
      },
    ],
  };
  private loginTypes = {
    email: 1,
    google: 2,
  };
  private userData: User = {
    uid: '',
    email: '',
    photoURL: '',
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    town: '',
    country: '',
    postcode: '',
  };

  constructor(
    public authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    public loaderService: LoaderService,
    private menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  public goToRegisterPage() {
    this.router.navigate(['register']);
  }

  public logIn() {
    this.loaderService.showLoader();
    this.authService
      .login(
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value
      )
      .then((loginDetails) => {
        this.userData.email = loginDetails.user.email;
        this.userData.uid = loginDetails.user.uid;

        this.authService
          .setUserData(this.userData)
          .then((success) => {
            localStorage.setItem('user', JSON.stringify(this.userData));
            localStorage.setItem('loginType', this.loginTypes.email.toString());
            this.router.navigate(['home']);
            this.loaderService.dismissLoader();
          })
          .catch((error) => {
            this.alertService.showError(error?.message);
            this.loaderService.dismissLoader();
          });
      })
      .catch((error) => {
        this.alertService.showError(error?.message);
        this.loaderService.dismissLoader();
      });
  }

  public loginWithGoogle() {
    this.loaderService.showLoader();
    this.authService
      .loginWithGmail()
      .then((loginDetails: any) => {
        console.log('LoginDetails', loginDetails);
        this.userData.email = loginDetails.email;
        this.userData.firstName = loginDetails.givenName;
        this.userData.lastName = loginDetails.familyName;
        this.userData.uid = loginDetails.userId;

        this.authService
          .setUserData(this.userData)
          .then((success) => {
            localStorage.setItem('user', JSON.stringify(this.userData));
            localStorage.setItem('loginType', this.loginTypes.email.toString());
            this.router.navigate(['home']);
            this.loaderService.dismissLoader();
          })
          .catch((error) => {
            this.alertService.showError(error?.message);
            this.loaderService.dismissLoader();
          });
      })
      .catch((error: any) => {
        this.alertService.showError(error?.message);
        this.loaderService.dismissLoader();
      });
  }
}

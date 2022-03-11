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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup = null;
  public errorMessage = '';
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
  private loginTypeEmail = 1;

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
    this.registerForm = this.formBuilder.group({
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

  async register() {
    this.loaderService.showLoader();
    this.authService
      .register(
        this.registerForm.controls.email.value,
        this.registerForm.controls.password.value
      )
      .then((loginDetails) => {
        const userData: User = {
          uid: loginDetails.user.uid,
          email: loginDetails.user.email,
          photoURL: '',
          firstName: '',
          lastName: '',
          mobile: '',
          address: '',
          town: '',
          country: '',
          postcode: '',
        };
        this.authService
          .setUserData(userData)
          .then((success) => {
            console.log('succcess', success);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('loginType', this.loginTypeEmail.toString());
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
}

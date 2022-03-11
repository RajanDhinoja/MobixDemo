import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { User } from 'src/app/models/User';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public profileForm: FormGroup = null;
  public validationMessages = {
    firstName: [{ type: 'required', message: 'First Name is required.' }],
    lastName: [{ type: 'required', message: 'Last Name is required.' }],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
    mobile: [
      { type: 'required', message: 'Mobile is required.' },
      {
        type: 'minlength',
        message: 'Mobile must be at least 10 digit long.',
      },
    ],
    address: [{ type: 'required', message: 'Address is required.' }],
    town: [{ type: 'required', message: 'Town is required.' }],
    country: [{ type: 'required', message: 'Country is required.' }],
    postcode: [
      { type: 'required', message: 'Postcode is required.' },
      {
        type: 'minlength',
        message: 'Postcode must be at least 5 digit long.',
      },
    ],
  };
  public imageUrl = null;
  public imageFormat = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      uid: new FormControl('', Validators.compose([Validators.required])),
      firstName: new FormControl('', Validators.compose([Validators.required])),
      lastName: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      mobile: new FormControl(
        '',
        Validators.compose([Validators.minLength(10), Validators.required])
      ),
      address: new FormControl('', Validators.compose([Validators.required])),
      town: new FormControl('', Validators.compose([Validators.required])),
      country: new FormControl('', Validators.compose([Validators.required])),
      postcode: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });

    const userdata: User = JSON.parse(localStorage.getItem('user'));
    const fireData = this.authService.getUserData(userdata);

    fireData.subscribe((data) => {
      this.setFormData(data);
    });
  }

  public setFormData(userProfile: any) {
    this.profileForm.controls.uid.setValue(userProfile.uid);
    this.profileForm.controls.firstName.setValue(userProfile.firstName);
    this.profileForm.controls.lastName.setValue(userProfile.lastName);
    this.profileForm.controls.email.setValue(userProfile.email);
    this.profileForm.controls.mobile.setValue(userProfile.mobile);
    this.profileForm.controls.address.setValue(userProfile.address);
    this.profileForm.controls.country.setValue(userProfile.country);
    this.profileForm.controls.postcode.setValue(userProfile.postcode);
    this.profileForm.controls.town.setValue(userProfile.town);
    this.imageUrl = userProfile.photoURL;
  }

  public updateUserProfile() {
    const userData: User = {
      uid: this.profileForm.controls.uid.value,
      firstName: this.profileForm.controls.firstName.value,
      lastName: this.profileForm.controls.lastName.value,
      email: this.profileForm.controls.email.value,
      mobile: this.profileForm.controls.mobile.value,
      address: this.profileForm.controls.address.value,
      town: this.profileForm.controls.town.value,
      country: this.profileForm.controls.country.value,
      postcode: this.profileForm.controls.postcode.value,
      photoURL: this.imageUrl ? this.getImageUrl() : '',
    };

    this.loaderService.showLoader();
    this.authService
      .setUserData(userData)
      .then((success) => {
        localStorage.setItem('user', JSON.stringify(userData));
        this.loaderService.dismissLoader();
        this.alertService.showSuccess('Data Updated.');
      })
      .catch((error) => {
        this.alertService.showError(error?.message);
        this.loaderService.dismissLoader();
      });
  }

  public async takePicture() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

    this.imageUrl = image?.base64String;
    this.imageFormat = image?.format;
  }

  public getImageUrl() {
    const url = 'data:image/' + this.imageFormat + ';base64,' + this.imageUrl;
    return url;
  }
}

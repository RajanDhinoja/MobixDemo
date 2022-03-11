import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public auth: AngularFireAuth,
    private googlePlus: GooglePlus,
    public fStore: AngularFirestore
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  public isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  // Login in with email/password
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Login in with google
  loginWithGmail() {
    return this.googlePlus.login({});
  }

  // Register user with email/password
  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Logout with google
  logout() {
    return this.googlePlus.logout();
  }

  // Store user in store
  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.fStore.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
      merge: true,
    });
  }

  // Get userdata
  getUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.fStore.doc(
      `users/${user.uid}`
    );
    return userRef.valueChanges();
  }
}

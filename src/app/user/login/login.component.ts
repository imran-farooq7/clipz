import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait we are logging you in';
  constructor(public auth: AngularFireAuth) {}
  onSubmit = async () => {
    this.alertMessage = 'Please wait we are logging you in';
    this.showAlert = true;

    try {
      const isAuth = this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      console.log(error);
      this.alertColor = 'red';
      this.alertMessage = 'An error occurred';
      return;
    }
    this.alertColor = 'green';
    this.alertMessage = 'Login successfully';
    this.showAlert = true;
  };

  ngOnInit(): void {}
}

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}
  alertMessage = 'Please wait ';
  showAlert = false;
  isSubmission = false;
  alertColor = '';
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
    password: new FormControl('', [
      Validators.pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
      ),
      Validators.required,
    ]),
    confirmPassword: new FormControl('', [
      Validators.pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
      ),
      Validators.required,
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
    ]),
  });
  register = async () => {
    // console.log('submiited');
    this.showAlert = true;
    this.alertMessage = 'Your account has been successfully registered';
    this.alertColor = 'green';
    this.isSubmission = true;
    const { email, password, name, age, phoneNumber } = this.registerForm.value;
    try {
      this.auth.createUser(
        email as string,
        password as string,
        name as string,
        Number(age),
        phoneNumber as string
      );
    } catch (error) {
      this.alertMessage = 'error creating user';
      this.alertColor = 'red';
      this.isSubmission = false;
      return;
    }
    this.alertMessage = 'Your account has been successfully registered';
    this.alertColor = 'green';
  };
}

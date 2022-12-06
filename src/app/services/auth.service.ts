import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}
  public async createUser(
    email: string,
    password: string,
    name: string,
    age: string,
    phoneNumber: string
  ) {
    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );
      await this.db.collection('users').add({ name, age, phoneNumber, email });
    } catch {}
  }
}

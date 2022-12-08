import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
  }
  public async createUser(
    email: string,
    password: string,
    name: string,
    age: number,
    phoneNumber: string
  ) {
    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );
      await this.db
        .collection('users')
        .doc(userCred.user?.uid)
        .set({ name, age, phoneNumber, email });
      userCred.user?.updateProfile({
        displayName: name,
      });
    } catch {}
  }
}

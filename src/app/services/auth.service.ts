import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, filter } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.route.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe();
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
  public signOut = async ($event?: Event) => {
    if ($event) {
      $event.preventDefault();
    }
    await this.auth.signOut();
    await this.route.navigateByUrl('/');
  };
}

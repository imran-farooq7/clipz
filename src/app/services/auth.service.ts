import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  private redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.route.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.router.firstChild),
        switchMap((router) => router?.data!)
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
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
    if (this.redirect) {
      await this.route.navigateByUrl('/');
    }
  };
}

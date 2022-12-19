import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  constructor(
    public modal: ModalService,
    public userAuth: AuthService
  ) // private afauth: AngularFireAuth
  {
    userAuth.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  ngOnInit(): void {}
}

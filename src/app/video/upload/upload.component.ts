import { ClipService } from './../../services/clip.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait your clip is uploading';
  inSubmission = false;
  percentage = 0;
  user: firebase.User | null = null;
  uploadForm = new FormGroup({
    title: this.title,
  });
  isDragOver = false;
  file: File | null = null;
  nextStep = false;
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
  ) {
    this.auth.user.subscribe((user) => (this.user = user));
  }

  storeFile = (event: Event) => {
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.nextStep = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
  };

  uploadFile = () => {
    this.showAlert = true;
    this.alertMessage = 'Please wait your file is uploading';
    this.inSubmission = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    task
      .percentageChanges()
      .subscribe((progress) => (this.percentage = (progress as number) / 100));
    task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: (url) => {
          const clip = {
            uid: this.user?.uid,
            displayName: this.user?.displayName,
            title: this.title.value,
            clipFileName: `${clipFileName}.mp4`,
            url,
          };
          this.clipsService.createClip(clip);
          this.alertColor = 'green';
          this.alertMessage = 'Success your clip is ready';
        },
        error: (error) => {
          this.alertColor = 'red';
          this.alertMessage = 'Upload failed please try again later';
        },
      });
  };
  ngOnInit(): void {}
}

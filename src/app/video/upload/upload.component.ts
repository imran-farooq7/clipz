import { Router } from '@angular/router';
import { ClipService } from './../../services/clip.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
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
  task?: AngularFireUploadTask;
  uploadForm = new FormGroup({
    title: this.title,
  });
  isDragOver = false;
  file: File | null = null;
  nextStep = false;
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
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
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertMessage = 'Please wait your file is uploading';
    this.inSubmission = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    this.task
      .percentageChanges()
      .subscribe((progress) => (this.percentage = (progress as number) / 100));
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid,
            displayName: this.user?.displayName,
            title: this.title.value,
            clipFileName: `${clipFileName}.mp4`,
            url,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          const docRef = await this.clipsService.createClip(clip);
          this.alertColor = 'green';
          this.alertMessage = 'Success your clip is ready';
          setTimeout(() => {
            this.router.navigate(['clip', docRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMessage = 'Upload failed please try again later';
        },
      });
  };
  ngOnDestroy(): void {
    this.task?.cancel();
  }
}

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
import { FFMPEGService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  selectedScreenshot = '';
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait your clip is uploading';
  inSubmission = false;
  percentage = 0;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
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
    private router: Router,
    public ffmpegService: FFMPEGService
  ) {
    this.auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  storeFile = async (event: Event) => {
    if (this.ffmpegService.isRunning) {
      return;
    }
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.screenshots = await this.ffmpegService.getScreenShots(this.file);
    this.selectedScreenshot = this.screenshots[0];
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

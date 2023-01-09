import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FFMPEGService {
  isReady = false;
  private ffmpeg;
  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true,
    });
  }
  init = async () => {
    if (this.isReady) {
      return;
    }
    this.isReady = true;
    await this.ffmpeg.load();
  };
  getScreenShots = async (file: File) => {
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);
  };
}

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
    const seconds = [1, 2, 3];
    const commands: string[] = [];
    seconds.forEach((second) =>
      commands.push(
        '-i',
        file.name,
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        `output_1${second}.png`
      )
    );
    this.ffmpeg.run(...commands);
    const screenShots: string[] = [];
    seconds.forEach((second) => {
      const screenshotFile = this.ffmpeg.FS(
        'readFile',
        `output_1${second}.png`
      );
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });
      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenShots.push(screenshotURL);
    });
    return screenShots;
  };
}

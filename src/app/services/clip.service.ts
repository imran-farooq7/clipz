import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection;
  constructor(private db: AngularFirestore) {
    this.clipsCollection = db.collection('clips');
  }
  createClip = async (data: any) => {
    await this.clipsCollection.add(data);
  };
}

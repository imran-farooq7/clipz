import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection;
  constructor(private db: AngularFirestore) {
    this.clipsCollection = db.collection('clips');
  }
  createClip = (data: any): Promise<DocumentReference<typeof data>> => {
    return this.clipsCollection.add(data);
  };
}

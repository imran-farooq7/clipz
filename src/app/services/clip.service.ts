import { switchMap, of, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection;
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips');
  }
  createClip = (data: any): Promise<DocumentReference<typeof data>> => {
    return this.clipsCollection.add(data);
  };
  getUsersClips = () => {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        const query = this.clipsCollection.ref.where('uid', '==', user.uid);
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<any>).docs)
    );
  };
  updateClip = (id: string, title: string) => {
    // console.log('id', id);
    // console.log(this.clipsCollection.doc());
    return this.clipsCollection.doc(id).update({ title });
  };
  deleteClip = async (clip: any) => {
    console.log(clip.fileName);
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    await clipRef.delete();

    await this.clipsCollection.doc(clip.docID).delete();
  };
}

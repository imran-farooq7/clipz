import { switchMap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<any | null> {
  public clipsCollection!: AngularFirestoreCollection;
  pageClips: any[] = [];
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
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
  getClips = async () => {
    let query = this.clipsCollection.ref.orderBy('title', 'desc').limit(6);
    const { length } = this.pageClips;
    if (length) {
      const lastDocId = this.pageClips[length - 1].docId;
      console.log(lastDocId);
      const lastDoc = await this.clipsCollection
        .doc(lastDocId)
        .get()
        .toPromise();

      // console.log(lastDoc);
      query = query.startAfter(lastDoc);
    }
    const snapshot = await query.get();
    // console.log(query);

    snapshot.forEach((doc) => {
      this.pageClips.push({
        docId: doc.id,
        ...doc.data(),
      });
    });
    console.log(this.pageClips);
  };
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.db
      .doc(route.params.id)
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();
          if (!data) {
            this.router.navigate(['/']);
            return;
          }
          return data;
        })
      );
  }
}

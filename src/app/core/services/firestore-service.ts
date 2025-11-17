import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { 
  collection, collectionData, deleteDoc, doc, docData, DocumentReference, 
  Firestore, getDoc, setDoc, updateDoc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly firestore = inject(Firestore);

  constructor(private readonly injector: Injector) {}

  getDocument<tipo>(enlace: string) {
    const document = doc(this.firestore, enlace) as DocumentReference<tipo, any>;
    return getDoc<tipo, any>(document)
  }

  getDocumentChanges<tipo>(enlace: string) {
    return runInInjectionContext(this.injector, () => {
      const document = doc(this.firestore, enlace);
      return docData(document) as Observable<tipo>;
    });
  }

  getCollectionChanges<tipo>(path: string) {
    return runInInjectionContext(this.injector, () => {
      const col = collection(this.firestore, path);
      return collectionData(col, { idField: 'id' }) as Observable<tipo[]>;
    });
  }

  createDocument(data: any, enlace: string) {
    const document = doc(this.firestore, enlace);
    return setDoc(document, data);
  }

  createDocumentID(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  updateDocumentID(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(document, data)
  }

  updateDocument(data: any, enlace: string) {
    const document = doc(this.firestore, enlace);
    return updateDoc(document, data)
  }

  deleteDocumentID(enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document);
  }

  deleteDocFromRef(ref: any) {
    return deleteDoc(ref)
  }

  createIdDoc() {
    return uuidv4()
  }
}

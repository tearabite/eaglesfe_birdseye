import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Telemetry } from '../app/dataModels/telemetry';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  telemetryCollection: AngularFirestoreCollection<Telemetry>;
  telemetry: Observable<Telemetry[]>;
  telemetryDoc: AngularFirestoreDocument<Telemetry>;

  constructor(public afs: AngularFirestore) {

    this.telemetryCollection = this.afs.collection('telemetry', ref => ref.orderBy('timestamp', 'asc'));

    this.telemetry = this.telemetryCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Telemetry;
        data.id = a.payload.doc.id;
        return data;
      });
    })
    );
  }

  getTelemetry() {
    return this.telemetry;
  }

  addTelemetry(telemetry: Telemetry) {
    this.telemetryCollection.add(telemetry);
  }

}

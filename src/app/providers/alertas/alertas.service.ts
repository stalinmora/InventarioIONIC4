import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(
    public alert: AlertController
  ) { }

  show(text: string) {
    const alerta = this.alert.create({
      header: 'Alerta',
      subHeader: text,
      buttons: ['Ok']
    }).then(alerta => alerta.present());
  }
}

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  titulo: string;

  Json; any;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }
  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Nombre!',
      inputs: [
        {
          name: 'txtNombre',
          type: 'text',
          placeholder: 'Ingresa nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: ( data ) => { console.log(data);
                                 console.log('Confirm Ok');
                                 this.titulo = data.txtNombre;
                                 this.Json = JSON.stringify({Usuario: this.titulo, Password: this.titulo});
                                 console.log(this.Json);
          }
        }
      ]
    });

    await alert.present();
  }
}

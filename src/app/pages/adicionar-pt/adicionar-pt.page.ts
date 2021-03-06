import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLocalService } from '../../providers/data-local/data-local.service';
import {IonInfiniteScroll, LoadingController} from '@ionic/angular';
import { SqlService } from '../../providers/sql/sql.service';
import { KitsService } from '../../providers/kits/kits.service';
import { present } from '@ionic/core/dist/types/utils/overlays';

@Component({
  selector: 'app-adicionar-pt',
  templateUrl: './adicionar-pt.page.html',
  styleUrls: ['./adicionar-pt.page.scss'],
})
export class AdicionarPtPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public articulos: any;
  public q: any;
  public txtBuscar = '';
  constructor(
    public datalocal: DataLocalService,
    public sql: SqlService,
    private kit: KitsService,
    public Loading: LoadingController,
    ) {
      if (this.articulos === undefined || this.articulos === null) {
        console.log('No existe DaTA');
        setTimeout(() => {
          this.GetPTStorage();
        }, 500);
      }
      this.kit.deleteItems().then((data) => {
        console.log('DELETE ITEMS : ' + JSON.stringify(data));
      });
    }
  ngOnInit() {
  }

  GetPTStorage() {
    return new Promise((resolve, reject) => {
      this.datalocal.GetPT().then((data: any) => {
        this.articulos = data.values.pt;
      }).catch((error) => {
        console.log(JSON.stringify(error));
      });
    });
  }

  async CargaDatosPTS() {
    return new Promise(async (resolve, reject ) => {
      const loading = await this.Loading.create({
        message: 'Cargando Datos ... ',
        spinner: 'crescent',
      });
      loading.present().then(() => {
        this.sql.GetPts().then((data: any) => {
          console.log('RESPUESTA DESDE GetPts : ' + JSON.stringify(data.values));
          this.datalocal.SetDataPT(data.values).
            then((data2: any) => {
              console.log('DATA DESDE SETDAPT ' + JSON.stringify(data2.value));
              this.datalocal.GetPT().then((data3: any) => {
                console.log('DATA DE GETPT : ' + JSON.stringify(data3));
                console.log('DATA GetPT Data3 : ' + JSON.stringify(data3.values.pt));
                this.articulos = data3.values.pt;
              });
            }).catch((error2) => {
                console.log('Error en GETPT ' + JSON.stringify(error2));
            });
        }).catch((error) => {
          console.log('Error en GETPTS de SQL :' + JSON.stringify(error));
        });
        console.log('VALOR DE ARTICULOS : ' + JSON.stringify(this.articulos));
        setTimeout(() => {
          loading.dismiss().then((data) => {
            resolve({value: true, values: data});
          })
          .catch((error) => {
            reject({value: false, values: error});
          });
        }, 10000);
      });
    });
  }

  async btnCargar() {
    this.CargaDatosPTS();
    console.log('BTNCARGAR()');
    const b = await this.kit.getItems();
    console.log('DATA BTNCARGAR() : ' + JSON.stringify(b));
  }

  btnDelete() {
    this.datalocal.RemoveStorage('PT').then((data) => {
      console.log(JSON.stringify(data));
    }).catch((error) => {
      console.log(JSON.stringify(error));
    });
  }

  Buscar(event) {
    console.log(event);
    this.txtBuscar = event.detail.value;
  }

  LoadRegularizacion(event) {
    console.log(event);
    setTimeout(() => {
      console.log('Ingresando');
      event.target.disabled = true;
    }, 500);
  }

  async Calcular(dato: any) {
    console.log('Datos : ' + JSON.stringify(dato.CODARTICULO));
    const a = await this.kit.GetComponentes(dato.CODARTICULO);
    const b = await this.kit.getItems();
    console.log('VALOR DE B : ');
    console.log(b);
    b.forEach(a => {
      b.find(v => v.CODARTKIT == a.CODARTKIT).UNIDADES = a.UNIDADES * dato.UNIDADES;
      console.log('DATA CALCULADA DE : ' + a.CODARTKIT + ' UNIDADES : ' + a.UNIDADES);
    });
    console.log('VALOR DE B ACTUALIZADA : ');
    console.log(b);
    console.log('Tipo de Dato : ' + typeof(b));
    const t = await this.kit.SetArticulosKits(b);
    const f = await this.kit.DuplicateItemSum(b);
    const g = await this.kit.dedup_and_sum(b);
    this.kit.RemoveStorage().then((data) => {
      console.log('Data Eliminada');
    });
    const i = await this.kit.SetDataPt(g);
    console.log('SET ARTICULOS KITS : ' + JSON.stringify(i));
    const [a_, b_, c_] = await Promise.all([a, b, i]);
    console.log(a_, b_, c_);
  }



  async ShowMensaje(msg: string) {
    const toast = await this.Loading.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

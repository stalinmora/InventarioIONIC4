import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { query } from '@angular/core/src/render3';
import { DatabaseService } from '../database/database.service';

@Injectable(
)
export class DataLocalService {

  private globales: any;
  constructor(private storage: Storage, public dbcopy: SqliteDbCopy, public dbase: DatabaseService) {
    this.getDataSweet();
    this.dbcopy.copy('data.db', 0)
    .then((res) => {
      console.log('Copia DB' + JSON.stringify(res));
    })
    .catch((err) => {
      console.log('Error ' + JSON.stringify(err));
    });
  }


  getDataSweet() {
    return new Promise((resolve, rejecct) => {
      fetch('./assets/data/dataSweet.json').then(res => res.json())
      .then(json => {
        this.globales = json;
        this.SetDataGlobal(this.globales);
        resolve({ value: true });
      }).catch(() => {
        rejecct({ value: false});
      });
    });
  }

  setCerrarSesion(key: string) {
    this.storage.ready().then(() => {
        this.storage.remove(key);
    });
  }

  SetDataRegularizacion(obj: any) {
    return new Promise((resolve, reject) => {
      this.storage.ready().then((data) => {
        // console.log('ARTICULOS :' + obj[0].articulos);
        this.storage.set('REGULARIZACION', JSON.stringify(
          {
            regularizacion : obj
          }
          ));
        resolve({value: true, values: data});
      }).catch((error) => {
        reject({value: false, values: error});
      });
    });
  }


  SetDataGlobal(obj: any) {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        // console.log('ARTICULOS :' + obj[0].articulos);
        this.storage.set('USER', JSON.stringify(
          {
            articulos: obj[0].articulos,
            kits: obj[0].kits,
            almacenes: obj[0].almacenes,
            stocks: obj[0].stocks,
            regularizaciones: obj[0].regularizaciones,
            secciones: obj[0].secciones
          }
        ));
        resolve({value: true});
      }).catch(() => {
        reject({value: false});
      });
    });
  }
}

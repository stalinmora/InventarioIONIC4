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

  /**
   * @description: Obtiene Regularizacion 
   * @returns: Promise
   */
  GetRegularizacion() {
    return new Promise((resolve, reject) => {
      this.storage.get('REGULARIZACION').then((data) => {
        resolve({value: true, values: JSON.parse(data)});
      }).catch((error) => {
        reject({value: false, values: JSON.parse(error)});
      });
    });
  }

  SetComponentes(obj: any) {
    
  }

  GetDataRegularizacion(page: any) {
    let items;
    let pages;
    this.GetRegularizacion().then((data: any) => {
      items = data.values.regularizacion;
      pages = items.length / 30;
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

  SetDataRegularizacionBodega(bodega: string, obj: any) {
    return new Promise((resolve, reject) => {
      this.storage.ready().then((data) => {
        // console.log('ARTICULOS :' + obj[0].articulos);
        this.storage.set('REGULARIZACION' + bodega, JSON.stringify(
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

  GetRegularizacionBodega(bodega: string) {
    return new Promise((resolve, reject) => {
      this.storage.get('REGULARIZACION' + bodega).then((data) => {
        resolve({value: true, values: JSON.parse(data)});
      }).catch((error) => {
        reject({value: false, values: JSON.parse(error)});
      });
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

  RemoveStorageBodega(bodega: string) {
    return new Promise((resolve, reject) => {
      this.storage.keys().then((data) => {
        console.log('DATA KEYS : ' + JSON.stringify(data));
      });
      this.storage.ready().then(() => {
        this.storage.remove('REGULARIZACION' + bodega).then((data) => {
          console.log('Datos del Remove : ' + JSON.parse(data));
          resolve({value: true, values: data});
        }).catch((error) => {
          console.log('Error del remove : ' + JSON.stringify(error));
          reject({value: false, values: error});
        });
      }).catch(() => {});
    });
  }

  RemoveStorage(nombre: string) {
    return new Promise((resolve, reject) => {
      this.storage.keys().then((data) => {
        console.log('DATA KEYS : ' + JSON.stringify(data));
      });
      this.storage.ready().then(() => {
        this.storage.remove(nombre).then((data) => {
          console.log('Datos del Remove : ' + JSON.parse(data));
          resolve({value: true, values: data});
        }).catch((error) => {
          console.log('Error del remove : ' + JSON.stringify(error));
          reject({value: false, values: error});
        });
      }).catch(() => {});
    });
  }

  GetPT() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.storage.get('PT').
        then((data) => {
          console.log('EN GetPT en data-local-services');
          resolve({value: true, values: JSON.parse(data)});
        }).catch((error) => {
          reject({value: false, values: JSON.parse(error)});
        });
      }, 1000);
    });
  }

  SetDataPT(obj: any){
    return new Promise((resolve, reject) => {
      this.storage.ready().then((data) => {
        this.storage.set('PT', JSON.stringify(
          {
            pt : obj
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

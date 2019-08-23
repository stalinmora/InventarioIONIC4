import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SqlService } from '../../providers/sql/sql.service';
import { resolve } from 'url';
import { async } from '@angular/core/testing';

const ITEMS_KITS = 'mi_componentes_kits';
const KITS = 'kits_articulos';

@Injectable({
  providedIn: 'root'
})
export class KitsService {

  constructor(
    private storage: Storage,
    private sql: SqlService
    ) { }


  AddArticulos(obj: any) {
    const promise =  new Promise((resolve , reject) => {
      this.storage.get(ITEMS_KITS).then(async (data: any) => {
        if (data) {
          data.push(obj);
          this.storage.set(ITEMS_KITS, data).then((val) => {
            console.log('AddArticulos : ' + JSON.stringify(val));
            resolve(val);
          });
        } else {
          this.storage.set(ITEMS_KITS, obj).then((val) => {
            console.log('AddArticulos Obj : ' + JSON.stringify(val));
            resolve(val);
          });
        }
      });
    });
    return promise;
  }

  Add_Items_2(obj: any) {
    const promise = new Promise(function(resolve, reject) {
      this.storage.get(ITEMS_KITS).then((data) => {
        console.log('DATA : ' + data);
        if (data) {
          data.push(obj);
          this.storage.set(ITEMS_KITS, data).then((val) => {
            console.log('Val data: ' + JSON.stringify(val));
            resolve(val);
          });
        } else {
          this.storage.set(ITEMS_KITS, [obj]).then((val) => {
            console.log('Val obj: ' + JSON.stringify(val));
            resolve(val);
          });
        }
      });
    });
    return promise;
  }

  Add_Items(obj: any) {
    return new Promise (async (resolve, reject) => {
      await this.storage.get(ITEMS_KITS).then((data) => {
        console.log('DATA : ' + data);
        if (data) {
          data.push(obj);
          this.storage.set(ITEMS_KITS, data).then((val) => {
            console.log('Val data: ' + JSON.stringify(val));
            resolve(val);
          });
        } else {
          this.storage.set(ITEMS_KITS, [obj]).then((val) => {
            console.log('Val obj: ' + JSON.stringify(val));
            resolve(val);
          });
        }
      });
    });
  }

  SetArticulosKits(obj: any) {
    return this.storage.get(KITS).then((data) => {
      if (data) {
        obj.forEach(a => {
          data.push(a);
        });
        return this.storage.set(KITS, data);
      } else {
        return this.storage.set(KITS, obj);
      }
    });
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  Add_Articulos(item: any, unidades: any = 1) {
    console.log('VALOR DE ITEM en Add_Articulos : ' + item + ' , UNIDADES : ' + unidades);
    return this.storage.get(ITEMS_KITS).then((data) => {
      if (data) {
        data.push(item);
        console.log('DATA : Add_Articulos ' + data);
        return this.storage.set(ITEMS_KITS, data);
      } else {
        return this.storage.set(ITEMS_KITS, [item]);
      }
    });
  }

 GetArticulos() {
  this.storage.get(ITEMS_KITS).then((data) => {
    console.log('GetArticulos()');
    console.log(JSON.stringify(data));
  });
  this.storage.keys().then((data) => {
    console.log('DATA KEYS : ' + JSON.stringify(data));
  });
}

  getItems() {
    return this.storage.get(ITEMS_KITS);
  }

  ActualizaArticulos(obj: any, unidades: any) {
    let data: any[] = [];
    console.log('Actualizar Articulos');
    console.log(obj);
    console.log('Unidades : ' + unidades);
    obj.forEach(a => {
      const b = ({
        CODARTKIT: a.CODARTKIT,
        DESCRIPCION: a.DESCRIPCION,
        ESKIT: a.ESKIT,
        LINEAKIT: a.LINEAKIT,
        REFERENCIA: a.REFERENCIA,
        UDSELABORACION: a.UDSELABORACION,
        ULTIMOCOSTE: a.ULTIMOCOSTE,
        UNIDADES: ((a.UNIDADES / a.UDSELABORACION) * unidades),
        UNIDADMEDIDA: a.UNIDADMEDIDA,
        USASTOCKS: a.USASTOCKS
      });
      data.push(b);
    });
    return data;
  }

  async GetComponentes(codarticulo: number, obj: any = null, unidades: any = 1) {
    const data: any = await this.sql.GetPtsComponentes(codarticulo);
    console.log(data);
    const resultados = await this.ActualizaArticulos(data.values, unidades);
    console.log('Resultados Actualizar');
    console.log(resultados);
    if (resultados.length > 0) {
      for (let i = 0; i < resultados.length; i++) {
        console.log('VALOR : ' + i  + ' : ' + JSON.stringify(resultados[i]));
        if (resultados[i].ESKIT === 'F') {
          await this.Add_Articulos(resultados[i], resultados[i].UNIDADES).then((val) => {
            console.log('RESULTADO INSERT : ' + val);
          });
        } else {
          console.log(resultados[i].CODARTKIT + ' ES UN ARTICULO CON KIT ');
          await this.GetComponentes(resultados[i].CODARTKIT, resultados[i], unidades = resultados[i].UNIDADES);
        }
      }
    } else {
      console.log('ELSE GetComponente');
      await this.Add_Articulos(obj, unidades).then((val) => {
        console.log('RESULTADO INSERT NO : ' + val);
      });
    }
  }

 dedup_and_sum(arr: any) {
  let map = arr.reduce((prev, next) => {
    if(next.CODARTKIT in prev) {
      prev[next.CODARTKIT].UNIDADES += next.UNIDADES;
    } else {
      prev[next.CODARTKIT] = next;
    }
    return prev;
  }, {});
  return Object.keys(map).map(CODARTKIT => map[CODARTKIT]);
}

  DuplicateItemSum(obj: any) {
    let sum = {};
    obj.forEach(a => {
      sum[a.CODARTKIT] = sum[a.CODARTKIT] ?
          { CODARTKIT: a.CODARTKIT, UNIDADES:  sum[a.CODARTKIT].UNIDADES + Number(a.UNIDADES)} :
          { CODARTKIT: a.CODARTKIT, UNIDADES: Number(a.UNIDADES)}
    });
    return sum;
  }

  SetDataPt(obj: any) {
    return new Promise((resolve, reject) => {
      this.storage.ready().then((data) => {
        // console.log('ARTICULOS :' + obj[0].articulos);
        this.storage.set('PT_KITS', JSON.stringify(
          {
            pt_item : obj
          }
          ));
        resolve({value: true, values: data});
      }).catch((error) => {
        reject({value: false, values: error});
      });
    });
  }

  RemoveStorage() {
    return new Promise((resolve, reject) => {
      this.storage.keys().then((data) => {
        console.log('DATA KEYS : ' + JSON.stringify(data));
      });
      this.storage.remove('PT_KITS').then((data) => {
        console.log('Datos del Remove PT_KITS : ' + JSON.parse(data));
        resolve({ value: true, values: data });
      }).catch((error) => {
        console.log('Error del remove PT_KITS : ' + JSON.stringify(error));
        reject({ value: false, values: error });
      });
    });
  }

  ActualizaDuplicados(obj: any) {
    let result: any[] = [];
    obj.forEach(a => {
      if (!a.CODARTKIT) {
        a.CODARTKIT = {
          CODARTKIT: a.CODARTKIT,
          UNIDADES: 0
        };
        result.push(a.CODARTKIT);
      }
      a.CODARTKIT.UNIDADES += a.UNIDADES;
    }, Object.create(null));
    console.log(result);
  }

  updateItem(item: any): Promise<any> {
    return this.storage.get(ITEMS_KITS).then((data: any) => {
      if (!data || data.length === 0) {
        return null;
      }

      let newItems: any[] = [];
      for (let i of data) {
        if (i.CODARTICULO === item.CODARTICULO) {
          newItems.push(data);
        } else {
          newItems.push(i);
        }
      }
      return this.storage.set(ITEMS_KITS, newItems);
    });
  }

  deleteItems(): Promise<any> {
    return this.storage.remove(ITEMS_KITS).then((data) => {
      if (!data || data.length === 0) {
        return null;
      } else {
        return true;
      }
    });
  }

  deleteItem(CODARTICULO: number): Promise<any> {
    return this.storage.get(ITEMS_KITS).then((data) => {
      if ( !data || data.length === 0) {
        return null;
      }
      let toKeep: any[] = [];
      for (let i of data) {
        if (i.CODARTICULO !== CODARTICULO) {
          toKeep.push(i);
        }
      }
      return this.storage.set(ITEMS_KITS, toKeep);
    });
  }
}

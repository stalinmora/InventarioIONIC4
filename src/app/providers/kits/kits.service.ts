import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SqlService } from '../../providers/sql/sql.service';
import { resolve } from 'url';
import { async } from '@angular/core/testing';

const ITEMS_KITS = 'mi_componentes_kits';

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

  // tslint:disable-next-line: adjacent-overload-signatures
  Add_Articulos(item: any, unidades: any = 1) {
    console.log('VALOR DE ITEM en Add_Articulos : ' + item + ' , UNIDADES : ' + unidades);
    return this.storage.get(ITEMS_KITS).then((data) => {
      if (data) {
        const val = JSON.stringify(
          {
            CODARTKIT: item.CODARTKIT,
            DESCRIPCION: item.DESCRIPCION,
            ESKIT: item.ESKIT,
            LINEAKIT: item.LINEAKIT,
            REFERENCIA: item.REFERENCIA,
            UDSELABORACION: item.UDSELABORACION,
            ULTIMOCOSTE: item.ULTIMOCOSTE,
            UNIDADES: ((item.UNIDADES / item.UDSELABORACION) * unidades),
            UNIDADMEDIDA: item.UNIDADMEDIDA,
            USASTOCKS: item.USASTOCKS
          }
          );
        data.push(val);
        return this.storage.set(ITEMS_KITS, data);
      } else {
        const val = JSON.stringify(
          {
            CODARTKIT: item.CODARTKIT,
            DESCRIPCION: item.DESCRIPCION,
            ESKIT: item.ESKIT,
            LINEAKIT: item.LINEAKIT,
            REFERENCIA: item.REFERENCIA,
            UDSELABORACION: item.UDSELABORACION,
            ULTIMOCOSTE: item.ULTIMOCOSTE,
            UNIDADES: ((item.UNIDADES / item.UDSELABORACION) * unidades),
            UNIDADMEDIDA: item.UNIDADMEDIDA,
            USASTOCKS: item.USASTOCKS
          }
          );
        return this.storage.set(ITEMS_KITS, [val]);
      }
    });
  }


  async addItem(obj: any) {
    const data = await this.storage.get(ITEMS_KITS);
    console.log('DATA de get(ITEMS_KITS) : ' + JSON.stringify(data));
    if (data) {
      console.log('OBJ : ' + obj);
      data.push(obj);
      console.log('DATA en AddItem : ' + JSON.stringify(data));
      const a = await this.storage.set(ITEMS_KITS, data);
      console.log('VALOR A : ' + a );
    } else {
      const b = await this.storage.set(ITEMS_KITS, [obj]);
      console.log('VALOR B : ' + b );
    }
  }

  getItems() {
    return this.storage.get(ITEMS_KITS);
  }

  ActualizaArticulos(obj: any, unidades: any) {
    let data: any[] = [];
    console.log('Actualizar Articulos');
    console.log(obj);
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
    console.log('Data Obtenida de sql.GetPtsComponentes :' + JSON.stringify(data));
    if (data.values.length > 0) {
      for (let i = 0; i < data.values.length; i++) {
        console.log('VALOR : ' + i  + ' : ' + JSON.stringify(data.values[i]));
        if (data.values[i].ESKIT === 'F') {
          await this.Add_Articulos(data.values[i], data.values[i].UNIDADES).then((val) => {
            console.log('RESULTADO INSERT : ' + val);
          });
        } else {
          console.log(data.values[i].CODARTKIT + ' ES UN ARTICULO CON KIT ');
          await this.GetComponentes(data.values[i].CODARTKIT, data.values[i], unidades = data.values[i].UNIDADES);
        }
      }
    } else {
      console.log('ELSE GetComponente');
      await this.Add_Articulos(obj, unidades).then((val) => {
        console.log('RESULTADO INSERT NO : ' + val);
      });
    }
    /*
    if (data.values.length > 0 ) {
      data.values.forEach(async a => {
        if (a.ESKIT === 'F') {
          console.log('INSERTANDO en AddItem() ' + a.CODARTKIT);
          const result = await this.Add_Articulos(a);
          console.log('VAL ITEM : ' + result);
        } else {
          console.log(a.CODARTKIT + ' ES UN ARTICULO CON KIT ');
        }
      });
    } else {
      console.log('INSERTANDO en AddItem() ' + obj);
    }
    */
  }

  /*async GetComponentes(codarticulo: number, item: any = null): Promise<any> {
      console.log('DATO A OBTENER EN GETCOMPONENTES : ' + codarticulo);
      const data: any = await this.sql.GetPtsComponentes(codarticulo);
      console.log('VALOR DE sql.GetPtsComponentes: ' + JSON.stringify(data) + ' Del Articulo : ' + codarticulo);
      console.log(data);
      if (data.values.length > 0) {
        await data.values.forEach(async (a: any) => {
          if (a.ESKIT === 'F') {
            console.log('INSERTANDO en addItem() ' + a.CODARTKIT);
            const val_item: any = await this.AddArticulos(a);
            console.log('DATA DESDE ADD_ITEM() : ' + JSON.stringify(val_item));
          }
          else {
            console.log(a.CODARTKIT + ' ES UN ARTICULO CON KIT ');
            const data: any = await this.GetComponentes(a.CODARTKIT, a);
          }
        });
      } else {
        console.log('DEBE AGREGARSE EL ARTICULO CUANDO ESTA VACIO');
        const val_item = await this.AddArticulos(item);
      }
  }*/

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
  /*
  GetComponentes(codarticulo: number): Promise<any> {
    console.log('DATO A OBTENER EN GETCOMPONENTES : ' + codarticulo );
    return this.sql.GetPtsComponentes(codarticulo).then((data: any) => {
      console.log('VALOR DE sql.GetPtsComponentes: ' + JSON.stringify(data) + ' Del Articulo : ' + codarticulo);
      if (data.value) {
        data.values.forEach(a => {
          if (a.ESKIT === 'F') {
            this.addItem(a);
          } else {
            console.log(a.CODARTKIT + ' ES UN KIT ');
            this.sql.IsPt(a.CODARTKIT).then((data2: any) => {
              console.log('VALOR DE IsPt : ' + JSON.stringify(data2));
              if (data2.value) {
                console.log('Entra a Obtener sus subcomponentes : ' + a.CODARTKIT);
                this.GetComponentes(a.CODARTKIT).then((data3) => {
                  console.log('VALOR DE DATA3 ' + JSON.stringify(data3));
                  if (!data3 || data3 === null || data3 === undefined) {
                    this.addItem(a);
                  } else {
                    this.addItem(a);
                  }
                });
              } else {
                this.addItem(a);
              }
            }).catch((error) => {
              this.addItem(a);
              console.log('VALOR DE Q : ' + JSON.stringify(error));
            });
          }
        });
        //return null;
      } /* else {
        return this.getItems();
      }
    });
  }
  */

}

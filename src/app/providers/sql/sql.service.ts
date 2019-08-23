import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';


@Injectable({
  providedIn: 'root'
})
export class SqlService {

  constructor(
    public data: DatabaseService
  ) { }

  getArticulos(tableName: string) {
    return new Promise((resolve, reject) => {
      this.data.getAll(tableName)
     .then ((resul) => {
        resolve(resul);
      }).catch ((error) => {
        reject(error);
      });
    });
  }

  GetPtsComponentes(codarticulo: any) {
    return new Promise((resolve, reject) => {
      let q = 'SELECT K.LINEAKIT,K.CODARTKIT,A.DESCRIPCION,A.REFERENCIA,A.UDSELABORACION,A.UNIDADMEDIDA,A.ESKIT, ';
      q = q + 'A.ULTIMOCOSTE,A.USASTOCKS,K.UNIDADES';
      q = q + ' FROM KITS K LEFT JOIN ARTICULOS A ON K.CODARTKIT=A.CODARTICULO WHERE K.CODARTICULO= ' + codarticulo ;
      this.data.GetDataScript(q).then((data) => {
        console.log('VALOR DEVUELTO en GetPtsComponentes : ' + codarticulo + ' DATA : ' + JSON.stringify(data));
        resolve({value: true, values: data});
      }).
      catch((error) => {
        console.log('VALOR DEVUELTO con error en GetPtsComponentes : ' + JSON.stringify(error));
        reject({value: false, values: error});
      });
    });
  }

  IsPt(codarticulo: any) {
    return new Promise((resolve, reject) => {
      let q = 'SELECT DESCRIPCION, CODARTICULO, ESKIT FROM ARTICULOS WHERE CODARTICULO= ' + codarticulo;
      console.log('VALOR DEL SELECT IsPT : ' + q);
      this.data.GetDataScript(q).
        then((data) => {
          resolve({ value: true, values: data });
        }).catch((error) => {
          reject({ value: false, values: error });
        });
    });
  }

  GetPts() {
    return new Promise((resolve, reject) => {
      let q = 'SELECT A.CODARTICULO, A.DESCRIPCION, 0 AS UNIDADES FROM ARTICULOS a INNER JOIN SECCIONES S ';
      q = q + 'ON (a.SECCION = S.SECCION) WHERE S.SECCION IN (20,21,22,24, 30,31,32)';
      this.data.GetDataScript(q).
      then((data) => {
        resolve({value: true, values: data});
      }).catch((error) => {
        reject({value: false, values: error});
      });
    });
  }

  GetDuplicados(obj: any) {
    let _DB = this.data._DB;
    let q  = 'SELECT CODARTKIT, SUM(UNIDADES) AS UNIDADES FROM ? GROUP BY CODARTKIT';
    return _DB
        .executeSql(q, [obj])
        .then(response => {
          let tasks = [];
          // console.log("Data : " + JSON.stringify(response));
          for (let index = 0; index < response.rows.length; index++) {
            tasks.push(response.rows.item(index));
          }
          return Promise.resolve(tasks);
        })
        .catch(error => Promise.reject(error));
  }

  getRegularizacion(codalmacen: string, fecha: string) {
    return new Promise((resolve, reject) => {
      let q = 'SELECT A.DESCRIPCION, ST.CODALMACEN, A.CODARTICULO,A.SECCION,\'.\' AS TALLA,\'.\' AS COLOR ,0 AS UNIDADES,0 AS STOCKFINAL, ST.STOCK,' ;
      q = q + `0 AS FRACCION, 0 AS ADICIO, ST.STOCK AS DIFER, \'F\' AS CUADRADO ,A.ULTIMOCOSTE AS PRECIO, A.ULTIMOCOSTE AS PVP,1 AS CODMONEDAAPVP,\'${fecha}\' AS FECHA `;
      q = q + ` FROM ARTICULOS A LEFT JOIN STOCKS ST ON (A.CODARTICULO = ST.CODARTICULO) WHERE (ST.CODALMACEN=\'${codalmacen}\' OR ST.CODALMACEN IS NULL) AND A.USASTOCKS =\'T\'`;
      console.log('Entrando a GetArticulosInventario : ' + q);
      this.data.GetDataScript(q)
      .then((respon) => {
        // console.log('Respuesta de GetDataScript SQL SERVICE : ' + JSON.stringify(respon));
        resolve(respon);
      })
      .catch((error) => {
        // console.log('Error de GetDataScript SQL SERVICE : ' + JSON.stringify(error));
        reject(error);
      });
    });
  }

  getArticulosInventario(codArticulo: any) {
    return new Promise((resolve, reject) => {
      let q = 'SELECT A.DESCRIPCION, ST.CODALMACEN, A.CODARTICULO,A.SECCION,\'.\' AS TALLA,\'.\' AS COLOR ,0 AS UNIDADES,0 AS STOCKFINAL, ST.STOCK,';
      q = q + '0 AS FRACCION, 0 AS ADICIO, ST.STOCK AS DIFER, \'F\' AS CUADRADO ,A.ULTIMOCOSTE AS PRECIO, A.ULTIMOCOSTE AS PVP,1 AS CODMONEDAAPVP,\'20190722\' AS FECHA ';
      q = q + ' FROM ARTICULOS A LEFT JOIN STOCKS ST ON (A.CODARTICULO = ST.CODARTICULO) WHERE (ST.CODALMACEN=\'QA\' OR ST.CODALMACEN IS NULL) AND A.USASTOCKS =\'T\' ORDER BY A.DESCRIPCION';
      console.log('Entrando a GetArticulosInventario : ' + q);
      this.data.GetDataScript(q)
      .then((respon) => {
        resolve(respon);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}

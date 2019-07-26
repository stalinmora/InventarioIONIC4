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



  getArticulosInventario(codArticulo: any) {
    return new Promise((resolve, reject) =>{
      let q = 'SELECT A.DESCRIPCION, ST.CODALMACEN, A.CODARTICULO,A.SECCION,\'.\' AS TALLA,\'.\' AS COLOR ,0 AS UNIDADES,0 AS STOCKFINAL, ST.STOCK,';
      q = q + '0 AS FRACCION, 0 AS ADICIO, ST.STOCK AS DIFER, \'F\' AS CUADRADO ,A.ULTIMOCOSTE AS PRECIO, A.ULTIMOCOSTE AS PVP,1 AS CODMONEDAAPVP,\'20190722\' AS FECHA ';
      q = q + ' FROM ARTICULOS A LEFT JOIN STOCKS ST ON (A.CODARTICULO = ST.CODARTICULO) WHERE (ST.CODALMACEN=\'QA\' OR ST.CODALMACEN IS NULL) AND A.USASTOCKS =\'T\'';
      console.log('Entrando a GetArticulosInventario : ' + q);
      this.data.GetDataScript(q)
      .then((respon) => {
        // console.log('Respuesta de GetDataScript SQL SERVICE : ' + JSON.stringify(respon));
        resolve(respon);
      })
      .catch((error) =>{
        // console.log('Error de GetDataScript SQL SERVICE : ' + JSON.stringify(error));
        reject(error);
      });
    });
  }
}

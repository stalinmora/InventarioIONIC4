import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { resolve } from 'url';
import { reject } from 'q';
import { JsonpClientBackend } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  /**
   * @name _DB
   * @type {object}
   * @private
   * @description Define un objeto que interactue con el plugin de SQLite
   */
  public _DB: SQLiteObject;

  public _DB_NAME = 'data.db';

  generatedSqlQuery: string;

  constructor(
    public _PLAT: Platform,
    private _SQL: SQLite,
    private _PORTER: SQLitePorter
  ) {
    this.init();
  }

  /**
   * [createSqlQuery description]
   * @param  tableName [description]
   * @param  columns   [description]
   * @param  obj       [description]
   * @return           [description]
   */

  createSqlQuery(tableName: string, columns: string[], obj: any) {
    this.generatedSqlQuery = ` INSERT INTO ${tableName} `;
    let columnList = "";
    columnList = columnList + "(";
    for (let index = 0; index < columns.length; index++) {
      if (index == columns.length - 1) {
        columnList = columnList + columns[index];
      } else {
        columnList = columnList + columns[index] + ",";
      }
    }
    this.generatedSqlQuery = this.generatedSqlQuery + columnList + ") VALUES ";

    for (let index = 0; index < obj.length; index++) {
      let item = obj[index];

      if (index == columns.length - 1) {
        this.generatedSqlQuery = this.generatedSqlQuery + "(";
        for (var key in obj[index]) {
          if (obj[index].hasOwnProperty(key)) {
            var val = obj[index][key];
            this.generatedSqlQuery = this.generatedSqlQuery + val + ",";
          }
        }
        this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        this.generatedSqlQuery = this.generatedSqlQuery + ")";
        if (index == columns.length - 1) {
          this.generatedSqlQuery = this.generatedSqlQuery + ",";
        }
        if (obj.length == 1) {
          this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        }
      } else {
        this.generatedSqlQuery = this.generatedSqlQuery + "(";
        let length = 0;
        // tslint:disable-next-line: forin
        for (var key in obj[index]) {
          length++;
        }
        for (var key in obj[index]) {
          if (obj[index].hasOwnProperty(key)) {
            var val = obj[index][key];
            this.generatedSqlQuery = this.generatedSqlQuery + val + ",";
          }
        }
        this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        this.generatedSqlQuery = this.generatedSqlQuery + "),";
        if (obj.length == 1) {
          this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
        }
      }
    }
    if (obj.length > 1) {
      this.generatedSqlQuery = this.generatedSqlQuery.slice(0, -1);
    }
    console.log(this.generatedSqlQuery);
    return this.generatedSqlQuery;
  }

  CrearTabla(sql: string) {
    this._DB
      .executeSql(sql, [])
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        Promise.reject(error);
      });
  }

  CreateTableStock() {
    let sql =
      "CREATE TABLE IF NOT EXISTS STOCKS(CODARTICULO INTEGER NOT NULL,TALLA TEXT NOT NULL,COLOR TEXT NOT NULL,CODALMACEN TEXT NOT NULL,";
    sql =
      sql +
      " STOCK REAL NULL,PEDIDO REAL NULL,ASERVIR REAL NULL,PRESTADO REAL NULL,DEPOSITO REAL NULL,FABRICACION REAL NULL,";
    sql =
      sql +
      " MINIMO REAL NULL,FECHAMODIFICADO TEXT NULL,MAXIMO REAL NULL,UBICACION TEXT NULL)";
    this._DB
      .executeSql(sql, [])
      .then(response => {
        console.log("Creacion de Tabla Stock : " + JSON.stringify(response));
        return Promise.resolve(response);
      })
      .catch(error => {
        console.log(
          "Error al crear la tabla STOCKS : " + JSON.stringify(error)
        );
        Promise.reject(error);
      });
  }

  InsertStock(obj: any) {
    obj.forEach(a => {
      let sql =
        "INSERT INTO STOCKS (CODARTICULO,TALLA,COLOR,CODALMACEN,STOCK,PEDIDO,ASERVIR,PRESTADO, ";
      sql =
        sql +
        " DEPOSITO,FABRICACION,MINIMO,FECHAMODIFICADO,MAXIMO,UBICACION)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      this._DB
        .executeSql(sql, [
          a.CODARTICULO,
          a.TALLA,
          a.COLOR,
          a.CODALMACEN,
          a.STOCK,
          a.PEDIDO,
          a.ASERVIR,
          a.PRESTADO,
          a.DEPOSITO,
          a.FABRICACION,
          a.MINIMO,
          a.FECHAMODIFICADO,
          a.MAXIMO,
          a.UBICACION
        ])
        .then(response => {
          //console.log('RESPONSE INSERT STOCK : ' + JSON.stringify(response));
          return Promise.resolve(response);
        })
        .catch(error => {
          Promise.reject(error);
        });
    });
  }

  CreateTableArticulos() {
    let sql =
      "CREATE TABLE IF NOT EXISTS ARTICULOS (CODARTICULO	INTEGER NOT NULL,REFERENCIA	TEXT DEFAULT NULL,DESCRIPCION ";
    sql =
      sql +
      "TEXT DEFAULT NULL, SECCION	INTEGER,UNIDADES	REAL,ESKIT	TEXT,UNIDADMEDIDA	TEXT,UDSELABORACION	REAL, ";
    sql =
      sql +
      "ULTIMOCOSTE	REAL, USASTOCKS	TEXT,DESCATALOGADO	TEXT,PRIMARY KEY(CODARTICULO))";
    this._DB
      .executeSql(sql, [])
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        Promise.reject(error);
      });
  }

  InsertArticulos(obj: any) {
    obj.forEach(a => {
      let sql =
        "INSERT INTO ARTICULOS (CODARTICULO, REFERENCIA, DESCRIPCION, SECCION, UNIDADES, ESKIT, UNIDADMEDIDA, ";
      sql =
        sql +
        " UDSELABORACION, ULTIMOCOSTE, USASTOCKS,DESCATALOGADO) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      this._DB
        .executeSql(sql, [
          a.CODARTICULO,
          a.REFERENCIA,
          a.DESCRIPCION,
          a.SECCION,
          a.UNIDADES,
          a.ESKIT,
          a.UNIDADMEDIDA,
          a.UDSELABORACION,
          a.ULTIMOCOSTE,
          a.USASTOCKS,
          a.DESCATALOGADO
        ])
        .then(response => {
          //console.log('Response INSERT ARTICULOS : ' + JSON.stringify(response));
          return Promise.resolve(response);
        })
        .catch(error => {
          Promise.reject(error);
        });
    });
  }

  CreateTableKits() {
    let sql =
      "CREATE TABLE IF NOT EXISTS KITS (CODARTICULO INTEGER,CODARTKIT INTEGER,DESCRIPCIOKIT TEXT,LINEAKIT INTEGER,";
    sql =
      sql +
      " PRECIOUNIDAD REAL,REFERENCIA TEXT,REFERENCIAKIT TEXT,TOTALLINEA	REAL,UNIDADES REAL)";
    this._DB
      .executeSql(sql, [])
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        Promise.reject(error);
      });
  }

  InsertKits(obj: any) {
    obj.forEach(a => {
      let sql =
        "INSERT INTO KITS (CODARTICULO, CODARTKIT, DESCRIPCIOKIT, LINEAKIT, PRECIOUNIDAD, REFERENCIA,";
      sql =
        sql + " REFERENCIAKIT,TOTALLINEA,UNIDADES ) VALUES (?,?,?,?,?,?,?,?,?)";
      this._DB
        .executeSql(sql, [
          a.CODARTICULO,
          a.CODARTKIT,
          a.DESCRIPCIOKIT,
          a.LINEAKIT,
          a.PRECIOUNIDAD,
          a.REFERENCIA,
          a.REFERENCIAKIT,
          a.TOTALLINEA,
          a.UNIDADES
        ])
        .then(response => {
          //console.log('DESDE KITS INSERT : ' + JSON.stringify(response));
          return Promise.resolve(response);
        })
        .catch(error => {
          Promise.reject(error);
        });
    });
  }

  CreateTableSecciones() {
    let sql =
      "CREATE TABLE IF NOT EXISTS SECCIONES (SECCION INTEGER NOT NULL, DESCRIPCION	TEXT, DPTO INTEGER)";
    this._DB
      .executeSql(sql, [])
      .then(response => {
        return Promise.resolve(response);
      })
      .catch(error => {
        Promise.reject(error);
      });
  }

  InsertSecciones(obj: any) {
    obj.forEach(a => {
      // console.log(JSON.stringify(a));
      let sql =
        "INSERT INTO SECCIONES (SECCION,DESCRIPCION,DPTO) VALUES (?,?,?)";
      this._DB
        .executeSql(sql, [a.SECCION, a.DESCRIPCION, a.DPTO])
        .then(result => {
          //console.log('Resultado INSERT Secciones : ' + JSON.stringify(result));
        })
        .catch(err => {
          //console.log('Error Insertando : ' + JSON.stringify(err));
        });
    });
  }

  DeleteTables(tblName: string) {
    return new Promise((resolve, reject) => {
      let q = "DELETE FROM " + tblName;
      this._DB
        .executeSql(q, [])
        .then(data => {
          console.log("DELETE TABLE : " + JSON.stringify(data));
          resolve(data);
        })
        .catch(error => {
          console.log("Error DELETE : " + JSON.stringify(error));
          reject(error);
        });
    });
  }

  GetDataAll() {
    this._DB
      .executeSql("SELECT * FROM SECCIONES")
      .then(data => {
        console.log("Data : " + JSON.stringify(data));
      })
      .catch(error => {
        console.log("Eror : " + JSON.stringify(error));
      });
  }

  getAll(nombreTabla: string) {
    let sql = "SELECT * FROM " + nombreTabla;
    return this._DB
      .executeSql(sql, [])
      .then(response => {
        let tasks = [];
        console.log("Data : " + JSON.stringify(response));
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push(response.rows.item(index));
        }
        return Promise.resolve(tasks);
      })
      .catch(error => Promise.reject(error));
  }

  CheckTables() {
    this.CheckTableExist('ARTICULOS').then((data) => {
      console.log('TABLA CREADA ARTICULO : ' + JSON.stringify(data));
    }).catch((error) => {
      console.log('Error Check Table ARTICULO : ' + JSON.stringify(error));
    });
  }

  GetDataScript(name: string) {
    return this._DB
      .executeSql(name, [])
      .then(response => {
        let tasks = [];
        // console.log("Data : " + JSON.stringify(response));
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push(response.rows.item(index));
        }
        //console.log(tasks);
        return Promise.resolve(tasks);
      })
      .catch(error => Promise.reject(error));
  }

  CheckTableExist(name: string) {
    console.log("CheckTableExist() : " + name);
    return new Promise((resolve, reject) => {
      console.log("Linea 122");
      let sql = "SELECT count(*) AS CONT FROM " + name;
      console.log(sql);
      this._DB
        .executeSql(sql)
        .then((data: any) => {
          console.log("DATA CHECK TABLE : " + data);
          let numRows = data.rows.item(0).CONT;
          resolve(numRows);
        })
        .catch(e => {
          console.log(JSON.stringify(e));
          reject(e);
        });
    });
  }

  TablesDeletes() {
    console.log('Eliminando desde Database Services');
    this.DeleteTables('ARTICULOS');
    this.DeleteTables('KITS');
    this.DeleteTables('SECCIONES');
    this.DeleteTables('STOCKS');
  }

  init(): void {
    this._SQL
      .create({
        name: this._DB_NAME,
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        // Associate the database handler object with the _DB private property
        console.log(db);
        console.log('DATABASE open : ' + db);
        this._DB = db;
        //this.CheckTables();
        this.TablesDeletes();
      })
      .catch(e => {
        console.log(e);
      });
  }

  /**
   * [importSQL description]
   * @param  sql [description]
   * @return     [description]
   */
  importSQL(sql: any) {
    return new Promise((resolve, reject) => {
      this._PORTER
        .importSqlToDb(this._DB, sql)
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  exportAsSQL() {
    return new Promise((resolve, reject) => {
      this._PORTER
        .exportDbToSql(this._DB)
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  importJSON(json: any) {
    return new Promise((resolve, reject) => {
      this._PORTER
        .importJsonToDb(this._DB, json)
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
  
  /**
   *
   * @param jsonObj Objeto que se desea saber sus keys
   * @description Obtienes todos los keys de un Objeto
   * @returns Keys
   *
   */

  GetKeysObj(jsonObj: any) {
    return Object.keys(jsonObj);
  }
}

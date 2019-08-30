import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../providers/url/url.service';
import { ConexionService } from '../../providers/conexion/conexion.service';
import { HttpClient } from '@angular/common/http';
import { DataLocalService } from '../../providers/data-local/data-local.service';
import { DatabaseService } from '../../providers/database/database.service';
import { Storage } from '@ionic/storage';
import { Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { SqlService } from '../../providers/sql/sql.service';
import { load } from '@angular/core/src/render3';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertasService } from '../../providers/alertas/alertas.service';
import { async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { present } from '@ionic/core/dist/types/utils/overlays';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})



export class InicioPage implements OnInit {
  establecimientos: any;
  todosArticulos: any;
  todosArticulos2: any;
  articulos: any;
  kits: any;
  stocks: any;
  secciones: any;
  articulos2: any;
  idSeccion: any;
  idEstablecimiento: any;
  articulos3: any;
  txtFecha: any;
  flag: any;
  isBtnCargar: boolean = false;
  myGroup: FormGroup;
  fData = { 'datetime': '' };
  private timeoutTime = 10000;

  constructor(
    public storage: Storage,
    public url: UrlService,
    con: ConexionService,
    http: HttpClient,
    public datalocal: DataLocalService,
    public databaseService: DatabaseService,
    _PLAT: Platform,
    public sql: SqlService,
    public nav: NavController,
    public Loading: LoadingController,
    public alertas: AlertasService,
    public datepipe: DatePipe,
    public alertCtrl: AlertController
  ) {
    this.myGroup = new FormGroup({
      datetime: new FormControl('', [Validators.required]),
    });
    this.Inicio().then(() => {
      console.log('Carga Exitosa');
     }).catch((error) => {
       console.log('Error de carga : ' +JSON.parse(error) );
     });
  }

  async Inicio() {
    await this.databaseService.init().then((data: any) => {
      console.log('Retorno de INIT() : ' + JSON.stringify(data.value));
      this.CargarDatos().then(() => {
        console.log('data cargada');
      });
    });
    // }, 4000);
    await this.GetParametros().then((data: any) => {
      if (data.value == true) {
        console.log('PARAMETROS ENCONTRADOS');
      }
    });
  }

  getRegularizacion() {
    return new Promise((resolve, reject) => {
      if (this.articulos3 === undefined) {
        setTimeout(() => {
          this.storage.get('REGULARIZACION' + this.idEstablecimiento).then((data) => {
            const t = JSON.parse(data);
            this.articulos3 = t.regularizacion;
            this.todosArticulos = t.regularizacion;
            const idFilter = this.idSeccion;
            console.log('DATA CARGADA CORRECTAMENTE ');
            this.articulos3 = this.todosArticulos.filter(function (n) {
              return n.SECCION === idFilter;
            });
            resolve({ value: true, values: data });
          }).catch((error) => {
            reject({ value: false, values: error });
          });
        }, 500);
      }
    });
  }


  getArticulosAll() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.Loading.create({
        message: 'Cargando Datos desde Tablas ... ',
        spinner: 'lines',
      });
      loading.present().then(() => {
        this.sql.getArticulosInventario(3)
          .then((data) => {
            console.log('DATOS DE GETARTICULOSALL : ' + JSON.stringify(data));
            this.datalocal.SetDataRegularizacion(data);
          })
          .catch((error) => {
            console.log('ERROR getArticulosInventario Articulos 3 : ' + JSON.stringify(error));
          });
      });
      setTimeout(() => {
        loading.dismiss().then((data) => {
          resolve(data);
        })
          .catch((error) => {
            reject(error);
          });
      }, this.timeoutTime + 7000);
    });
  }

  ngOnInit() {
  }

  SeleccionaFecha() {
    console.log(this.txtFecha);
  }


  async InsertaTablas() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.Loading.create({
        message: 'Insertando Datos en Tablas ... ',
        spinner: 'crescent',
      });
      loading.present().then(async () => {
        console.log('INSERTANDO DATOS EN SQLITE');
        await this.databaseService.InsertArticulos(this.todosArticulos2);
        await this.databaseService.InsertStock(this.stocks);
        await this.databaseService.InsertSecciones(this.secciones);
        await this.databaseService.InsertKits(this.kits);
        console.log('TERMINADO SQLLITE');
        setTimeout(() => {
          loading.dismiss().then((data) => {
            console.log('INSERT COMPLETE');
            resolve(data);
          })
            .catch((error) => {
              reject(error);
            });
        }, this.timeoutTime + 1000);
      });
    });
  }

  async btnDeleteData() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      subHeader: 'Desea Limpiar la Regularizion del Dispositivo?',
      animated: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmando Cancelado');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.storage.remove('REGULARIZACION' + this.idEstablecimiento).then((data) => {
              console.log('Eliminando Regularizacion : ' + JSON.stringify(data));
              this.articulos3 = null;
            }).catch((error) => {
              console.log('Error eliminando : ' + JSON.stringify(error));
              this.articulos3 = null;
            });
            this.storage.remove('PARAM').then((data) => {
              console.log('Eliminando Regularizacion : ' + JSON.stringify(data));
              this.idEstablecimiento = null;
              this.txtFecha = null;
              this.isBtnCargar = false;
            }).catch((error) => {
              console.log('Error eliminando : ' + JSON.stringify(error));
            });
            this.storage.keys().then((val) => {
              console.log('DATA KEYS : ' + JSON.stringify(val));
            });
            this.articulos3 = null;
          }
        }
      ]
    });
    alert.present();
  }

  async CargarDatos() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.Loading.create({
        message: 'Cargando Datos ... ',
        spinner: 'circles',
      });
      loading.present().then(() => {
        console.log('Cargar Datos');
        this.storage.get('USER').then(async (val) => {
          const t = JSON.parse(val);
          this.todosArticulos2 = t.articulos;
          this.establecimientos = t.almacenes;
          this.kits = t.kits;
          this.stocks = t.stocks;
          this.secciones = t.secciones;
          this.idSeccion = this.secciones[0].SECCION;
          console.log('DATA CARGADA DE CargarDatos() : ' + JSON.stringify(this.secciones));
          await this.InsertaTablas().then((data) => {
            console.log('Valor de respuesta de Inserta Tablas :' + JSON.stringify(data));
          });
        });
        setTimeout(() => {
          loading.dismiss().then((data) => {
            resolve(data);
          })
            .catch((error) => {
              reject(error);
            });
        }, this.timeoutTime + 1000);
      });
    });
  }

  SetDatosParametros() {
    const data = JSON.stringify(
      {
        CODALMACEN: this.idEstablecimiento,
        FECHA: this.txtFecha,
      }
    );
    this.storage.set('PARAM', data ).then((val) => {
      console.log('Parametros Guardados : ' + JSON.stringify(val));
      this.isBtnCargar = true;
    }).catch((error) => {
      console.log('Error al Guardar Parametros : ' + JSON.stringify(error));
    });
    this.storage.keys().then((val) => {
      console.log('DATA KEYS : ' + JSON.stringify(val));
    });
  }

  GetParametros() {
    return new Promise((resolve, reject) => {
      this.storage.get('PARAM').then((val) => {
        console.log('DATA PARAM : ' + JSON.stringify(val));
        const t = JSON.parse(val);
        this.idEstablecimiento = t.CODALMACEN;
        console.log('CODALMACEN : ' + t.CODALMACEN);
        this.txtFecha = t.FECHA;
        console.log('CODALMACEN : ' + t.FECHA);
        resolve({value: true});
        this.isBtnCargar = true;
      }).catch((error) => {
        console.log('Error al obetner parametros.');
        reject({value: false});
      });
    });
  }

  VerificaRegularizacion() {
    return new Promise((resolve, reject) => {
      this.storage.get('REGULARIZACION' + this.idEstablecimiento).then((data) => {
        const t = JSON.parse(data);
        console.log('VALOR de t : ' + JSON.stringify(t));
        console.log('VALOR DE DATA : ' + JSON.stringify(data));
        const articulos3 = t.regularizacion;
        console.log('DATA t Articulos 3 : ' + articulos3);
        if (articulos3 != undefined || articulos3 != null) {
          resolve({ value: true });
        } else {
          reject({ value: false });
        }
      });
    });
  }

  BtnClickCargar() {
    if (this.articulos3 != undefined) {
      console.log('EXISTE DATA EN BTNCLICKCARGAR()');
      this.alertas.show('Ya se encuntra una data');
    } else {
      if (this.txtFecha === null || this.txtFecha === undefined) {
        this.alertas.show('Por favor debe ingresar una fecha. ');
      } else if (this.idEstablecimiento === null || this.idEstablecimiento === undefined) {
        this.alertas.show('Debe escoger un establecimiento valido');
      } else {
        this.txtFecha = this.datepipe.transform(this.txtFecha, 'yyyyMMdd');
        console.log('Fecha es : ' + this.txtFecha);
        this.sql.getRegularizacion(this.idEstablecimiento, this.txtFecha).then((data) => {
          console.log('DATA BTN CARGAR : ' + JSON.stringify(data));
          this.datalocal.SetDataRegularizacionBodega(this.idEstablecimiento, data).then(() => {
            console.log('Data extraida correctamente');
            this.getRegularizacion();
            this.SetDatosParametros();
          });
        });
      }
    }
  }

  ionViewDidLoad() {
  }

  SelectEstablecimiento() {
    const idfilter = this.idEstablecimiento;
    console.log(this.idEstablecimiento);
  }

  SelectSeccion() {
    const idFilter = this.idSeccion;
    if (this.articulos3 === undefined) {
      console.log('Entro a GetRegularizacion()');
      this.getRegularizacion().then((data) => {
        console.log('Dato Obtenido de true getRegularizacion() ' + JSON.stringify(data));
      }).catch((error) => {
        console.log('Dato obtenido de false getRegularizacion() ' + JSON.stringify(error));
      });
    }
    this.articulos3 = this.todosArticulos.filter((n) => {
      console.log('DATA DE SELECCION : ' + JSON.stringify(n));
      return n.SECCION === idFilter;
    });
  }

  RemoveStorage() {
    return new Promise((resolve, reject) => {
      this.storage.keys().then((data) => {
        console.log('DATA KEYS : ' + JSON.stringify(data));
      });
      this.storage.remove('regularizacion').then((data) => {
        console.log('Datos del Remove : ' + JSON.parse(data));
        resolve({ value: true, values: data });
      }).catch((error) => {
        console.log('Error del remove : ' + JSON.stringify(error));
        reject({ value: false, values: error });
      });
    });
  }

  Calcular(dato: any, opc: any) {
    if (opc === 1) {
      dato.FRACCION = dato.FRACCION / dato.UDSELABORACION;
    }
    this.flag = true;
    //dato.UNIDADES = dato.UNIDADES + 2;
    const suma = dato.FRACCION + dato.ADICIO;
    dato.DIFER = (dato.UNIDADES + suma) - dato.STOCK;
    this.RemoveStorage().then((data: any) => {
      console.log('Data Borrada : ' + JSON.stringify(data));
    });
    this.datalocal.SetDataRegularizacionBodega(this.idEstablecimiento, this.todosArticulos);
  }

  objectKeys(objeto: any) {
    const keys = Object.keys(objeto);
    console.log(keys);
    return keys;
  }
}

import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../providers/url/url.service';
import { ConexionService } from '../../providers/conexion/conexion.service';
import { HttpClient } from '@angular/common/http';
import { DataLocalService } from '../../providers/data-local/data-local.service';
import { DatabaseService } from '../../providers/database/database.service';
import { Storage } from '@ionic/storage';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { SqlService } from '../../providers/sql/sql.service';
import { load } from '@angular/core/src/render3';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertasService } from '../../providers/alertas/alertas.service';
import { async } from '@angular/core/testing';



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
  myGroup: FormGroup;
  fData = {'datetime': ''};
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
    public alertas: AlertasService
    ) {
      this.myGroup = new FormGroup({
        datetime: new FormControl('', [Validators.required]),
      });
      this.CargarDatos().then(() => {
        if (this.articulos3 === undefined) {
          this.getRegularizacion();
        }
      });
  }

  getRegularizacion() {
    return new Promise((resolve, reject) => {
      if (this.articulos3 === undefined) {
        this.storage.get('REGULARIZACION').then((data) => {
          const t = JSON.parse(data);
          this.articulos3 = t.regularizacion;
          this.todosArticulos = t.regularizacion;
          const idFilter = this.idSeccion;
          console.log('DATA CARGADA CORRECTAMENTE ');
          this.articulos3 = this.todosArticulos.filter(function (n) {
            return n.SECCION === idFilter;
          });
        });
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
      }, this.timeoutTime + 5000);
    });
  }

  async getArticulos() {
    const loading = await this.Loading.create({
      message: 'Cargando datos ... ',
      spinner: 'crescent',
    });
    loading.present().then(() => {
      this.sql.getArticulosInventario(3)
      .then((data) => {
        this.articulos3 = data;
        console.log('DATA DE REGULARIZACION :' + JSON.stringify(data));
        this.todosArticulos = data;
        console.log('VALOR DE IDSECCION : ' + this.idSeccion);
        const idFilter = this.idSeccion;
        console.log('DATA CARGADA CORRECTAMENTE ');
        this.articulos3 = this.todosArticulos.filter(function (n) {
          return n.SECCION === idFilter;
        });
      })
      .catch((error) => {
        console.log('ERROR getArticulosInventario Articulos 3 : ' + JSON.stringify(error));
      });
      loading.dismiss();
    });
  }
/*
  async showLoading(){
    const loading = await this.Loading.create({
        message: 'Cargando Datos...',
        spinner: 'circles'
    });
    loading.present();

    setTimeout(() => {
        loading.dismiss();
    }, this.timeoutTime);
  }
*/
  ngOnInit() {
    //this.getArticulos();
  }

  SeleccionaFecha() {
    console.log(this.txtFecha);
  }

  InsertTablas() {
    return new Promise((resolve, reject) => {
      console.log('INSERTANDO DATOS EN SQLITE');
      this.databaseService.InsertArticulos(this.todosArticulos2);
      this.databaseService.InsertStock(this.stocks);
      this.databaseService.InsertSecciones(this.secciones);
      this.databaseService.InsertKits(this.kits);
      console.log('TERMINADO SQLLITE');
      resolve(1);
    });
  }

  async InsertaTablas() {
    return new Promise(async (resolve, reject) =>{
      const loading = await this.Loading.create({
        message: 'Insertando Datos en Tablas ... ',
        spinner: 'circles',
      });
      loading.present().then(() => {
        console.log('INSERTANDO DATOS EN SQLITE');
        this.databaseService.InsertArticulos(this.todosArticulos2);
        this.databaseService.InsertStock(this.stocks);
        this.databaseService.InsertSecciones(this.secciones);
        this.databaseService.InsertKits(this.kits);
        console.log('TERMINADO SQLLITE');
        setTimeout(() => {
          loading.dismiss().then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
        }, this.timeoutTime + 5000);
      });
    });
  }

  async CargarDatos() {
    return new Promise(async (resolve, reject ) =>{
      const loading = await this.Loading.create({
        message: 'Cargando Datos ... ',
        spinner: 'circles',
      });
      loading.present().then(() => {
        console.log('Cargar Datos');
        this.storage.get('USER').then((val) => {
          const t = JSON.parse(val);
          this.todosArticulos2 = t.articulos;
          this.establecimientos = t.almacenes;
          this.kits = t.kits;
          this.stocks = t.stocks;
          this.secciones = t.secciones;
          this.idSeccion = this.secciones[0].SECCION;
          this.InsertaTablas().then((data) => {
            console.log('Valor de respuesta de Inserta Tablas :' + JSON.stringify(data));
            this.getArticulosAll();
          });
        });
        setTimeout(() => {
          loading.dismiss().then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
        }, this.timeoutTime + 5000);
      });
    });
  }

  BtnClickCargar() {
    //this.alertas.show('PRUEBA DESDE CLICK');
    if (this.txtFecha === null || this.txtFecha === undefined) {
      this.alertas.show('Debe Ingresar Fecha Valida');
    }
    /*
    this.storage.remove('REGULARIZACION').then((data) => {
      console.log('Datos del Remove : ' + JSON.parse(data));
    }).catch((error) => {
      console.log('Error del remove : ' + error);
    });
    */
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
      this.getRegularizacion();
    }
    this.articulos3 = this.todosArticulos.filter( (n) => {
      console.log('DATA DE SELECCION : ' + JSON.stringify(n));
      return n.SECCION === idFilter;
    });
  }

  Calcular(dato: any) {
    this.flag = true;
    //dato.UNIDADES = dato.UNIDADES + 2;
    const suma = dato.FRACCION + dato.ADICIO;
    dato.DIFER = dato.STOCK - dato.UNIDADES + suma;
  }

  objectKeys(objeto: any) {
    const keys = Object.keys(objeto);
    console.log(keys);
    return keys;
  }
}

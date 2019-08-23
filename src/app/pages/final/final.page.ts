import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { KitsService } from '../../providers/kits/kits.service';
import { File } from '@ionic-native/file/ngx';
import { PagerService } from '../../providers/pager/pager.service';

@Component({
  selector: 'app-final',
  templateUrl: './final.page.html',
  styleUrls: ['./final.page.scss'],
})
export class FinalPage implements OnInit {

  public articulos: any;
  public idEstablecimiento: any;
  public slice: number = 30;

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    private storage: Storage,
    private kit: KitsService,
    private file: File,
    private pagerService: PagerService) {
  }

  ngOnInit() {
    this.inicio();
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.GetPager(this.articulos.length, page);

    // get current page of items
    this.pagedItems = this.articulos.slice(this.pager.startIndex, this.pager.endIndex + 1);
}

  OrdenarDescripcion() {
    // this.articulos = this.sort_by_key(this.articulos, 'DESCRIPCION');
    // console.log(this.articulos);
    this.articulos.sort((a, b) => (a.DESCRIPCION > b.DESCRIPCION) ? 1 : ((b.DESCRIPCION > a.DESCRIPCION) ? -1 : 0));
    console.log(this.articulos);
  }

  sort_by_key(array, key) {
    return array.sort((a, b) => {
      let x = a[key]; let y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  async inicio() {
    const a = await this.GetParametros();
    const b = await this.GetArticulos();
    const c = await this.OrdenarDescripcion();
    const [a_, b_, c_] = await Promise.all([a, b, c]);
    console.log(a_, b_, c_);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {
        for (let i = 0; i < 50; i++) {
            this.articulos.push( this.articulos[length] );
        }
        console.log('Async operation has ended');
        infiniteScroll.complete();
    }, 500);
  }

  GetArticulos() {
    console.log('ID ESTABLECIMIENTOS : ' + this.idEstablecimiento);
    this.storage.get('REGULARIZACION' + this.idEstablecimiento).then((data) => {
      const t = JSON.parse(data);
      this.articulos = t.regularizacion;
      this.setPage(1);
      console.log(this.articulos);
      this.articulos.sort((a, b) => a.DESCRIPCION > b.DESCRIPCION);
      let c = this.articulos.sort((a, b) => {
        if (a.DESCRIPCION < b.DESCRIPCION) return -1;
        else if (a.DESCRIPCION > b.DESCRIPCION) return 1;
        else return 0;
      });
      console.log('MODIFICADO:');
      console.log(c);
    });
  }

  async actualizaFracciones() {
    const a = await this.storage.get('PT_KITS');
    console.log('VALOR A : ');
    console.log(a);
    if(a !== null ) {
      console.log('Entra si encuentra valores en a');
      const t = JSON.parse(a);
      let b = t.pt_item;
      console.log(b);
      b.forEach(c => {
        // tslint:disable-next-line: triple-equals
        this.articulos.find(v => v.CODARTICULO == c.CODARTKIT).FRACCION = c.UNIDADES;
      });
    }
    this.articulos.forEach(a => {
      const suma = a.FRACCION + a.ADICIO;
      if (a.FRACCION != 0) {
        console.log('VALOR DE A : ' + JSON.stringify(a));
      }
      this.articulos.find(v => v.CODARTICULO == a.CODARTICULO).DIFER = (a.UNIDADES + suma) -  a.STOCK ;
    });
    console.log(this.articulos);
    this.writeJSON('regularizacion.json', this.articulos).then((data) => {
      console.log('Creacion de File : ');
      console.log(data);
    });
  }

  writeJSON(filename, object) {
    return this.file.writeFile(this.file.externalApplicationStorageDirectory, filename, JSON.stringify(object), {replace: true});
    }

  GetParametros() {
    return new Promise((resolve, reject) => {
      this.storage.get('PARAM').then((val) => {
        console.log('DATA PARAM : ' + JSON.stringify(val));
        const t = JSON.parse(val);
        this.idEstablecimiento = t.CODALMACEN;
        console.log('CODALMACEN : ' + t.CODALMACEN);
        console.log('CODALMACEN : ' + t.FECHA);
        resolve({value: true});
      }).catch((error) => {
        console.log('Error al obetner parametros.');
        reject({value: false});
      });
    });
  }

  Calcular(dato: any) {

  }
}

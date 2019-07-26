import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private urlBase = 'http://localhost:50756/ApiInventario/';
  public url_locales = this.urlBase + 'TblDireccionLocales';
  public url_articulos = this.urlBase + 'Articulos';

  constructor() { }
}

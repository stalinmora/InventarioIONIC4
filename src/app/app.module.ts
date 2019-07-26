import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { ConexionService } from './providers/conexion/conexion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { DataLocalService } from './providers/data-local/data-local.service';
import { DatabaseService } from './providers/database/database.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { SqlService } from './providers/sql/sql.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,  ComponentsModule, HttpClientModule, IonicStorageModule.forRoot() ],
  providers: [
    StatusBar,
    SplashScreen,
    SqliteDbCopy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ConexionService, HttpClient, DataLocalService, DatabaseService,
    SqlService, SQLitePorter, SQLite
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public dbcopy: SqliteDbCopy) {
    /*
    this.dbcopy.remove('data.db',0).
    then((res) => {
      console.log('Borrando BD');
    })
    .catch((err) => {
      console.log('Error ' + JSON.stringify(err));
    });
    this.dbcopy.copy('data.db', 0)
    .then((res) => {
      console.log('Copia DB' + JSON.stringify(res));
    })
    .catch((err) => {
      console.log('Error ' + JSON.stringify(err));
    });
    */
  }
}

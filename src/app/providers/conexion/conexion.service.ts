import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable(
  )
export class ConexionService {

  constructor(private http: HttpClient) {
  }
  get(url: string) {
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  get2(url: string){
    let res = this.http.get(url).pipe();
    console.log(res);
    return res;
  }
}

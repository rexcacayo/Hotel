import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs/rxjs';
import { Extra } from '../clases/extra';
import { Room } from '../clases/room';

@Injectable()
export class ExtrasApiService{  
  constructor(private http: Http){}

  getExtras(apiUrl:string): Observable<Extra[]>{
    return this.http.get(this.getUrl(apiUrl, '')).map(this.getDatos).catch(this.error);
  }

  getExtra(apiUrl:string, id:number): Observable<Extra>{
    return this.http.get(this.getUrl(apiUrl, '/' + id)).map(this.getDato).catch(this.error);
  }

  addExtra(apiUrl:string, model: Extra): Observable<Extra[]>{
    return this.http.post(this.getUrl(apiUrl, ''),this.setDato(model)).map(this.getDatos).catch(this.error);
  }

  editExtra(apiUrl:string, model: Extra): Observable<Extra[]>{
    return this.http.put(this.getUrl(apiUrl, '/' + model.id),this.setDato(model)).map(this.getDatos).catch(this.error);
  }

  deleteExtra(apiUrl:string, model: Extra): Observable<Extra>{
    return this.http.delete(this.getUrl(apiUrl, '/' + model.id)).catch(this.error);
  }

  private error(error: any){
    console.log(error);
    let msg = (error.message) ? error.message : 'Error desconocido';
    console.error(msg);
    return Observable.throw(msg);
  }

  private getDatos(data: Response){
    let datos = data.json()['data'];
    let extras: Array<Extra> = [];
    for(var i = 0;i<datos.length;i++) { 
      let extra: Extra = new Extra(0,'','','','',Array<Room>(),false);
      extra.id = datos[i].id;
      extra.nombre = datos[i].nombre;
      extra.descripcion = datos[i].descripcion;
      extra.precio1 = datos[i].precio1;
      extra.precio2 = datos[i].precio2;
      extra.rooms = datos[i].rooms;
      extras.push(extra);
    } 
    return extras || [];
  }

  private getDato(data: Response){
    let datos = data.json()['data'];
    let extra: Extra = new Extra(0,'','','','',Array<Room>(),false);
    extra.id = datos.id;
    extra.nombre = datos.nombre;
    extra.descripcion = datos.descripcion;
    extra.precio1 = datos.precio1;
    extra.precio2 = datos.precio2;
    extra.rooms = datos.rooms;
    return extra;
  }

  private setDato(model: Extra){
    let datos: any = 
    {
      "nombre": model.nombre,
      "descripcion": model.descripcion,
      "precio1": model.precio1,
      "precio2": model.precio2,
      "rooms": model.rooms
    };
    console.log("SetDatos: " + datos);
    return datos;
  }

  private getUrl(apiUrl:string, modelo: String){
    console.log('getUrl: ' + apiUrl);
    return apiUrl + 'extras' + modelo;
  }
}
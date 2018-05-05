import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs/rxjs';
import { Season } from '../clases/season';

@Injectable()
export class SeasonsApiService{
    
    constructor(private http: Http){}

    getSeasons(apiUrl:string): Observable<Season[]>{
      return this.http.get(this.getUrl(apiUrl, '')).map(this.getDatos).catch(this.error);
    }

    getSeason(apiUrl:string, id:number): Observable<Season>{
      return this.http.get(this.getUrl(apiUrl, '/' + id)).map(this.getDato).catch(this.error);
    }

    addSeason(apiUrl:string, model: Season): Observable<Season[]>{
      return this.http.post(this.getUrl(apiUrl, ''),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    editSeason(apiUrl:string, model: Season): Observable<Season[]>{
      return this.http.put(this.getUrl(apiUrl, '/' + model.id),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    deleteSeason(apiUrl:string, model: Season): Observable<Season>{
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
      let seasons: Array<Season> = [];
      for(var i = 0;i<datos.length;i++) { 
        let season: Season = new Season(0,'');
        season.id = datos[i].id;
        season.fecha = datos[i].fecha;
        seasons.push(season);
      } 
      return seasons || [];
    }

    private getDato(data: Response){
      let datos = data.json()['data'];
      console.log('Datos: ');
      console.log(datos);
      let season: Season = new Season(0,'');
      season.id = datos.id;
      season.fecha = datos.fecha;
      return season;
    }

    private setDato(model: Season){
      let datos: any = 
      {
        "date": model.fecha
      };
      console.log("SetDatos: " + datos);
      return datos;
    }

    private getUrl(apiUrl:string, modelo: String){
      console.log('getUrl: ' + apiUrl);
      return apiUrl + 'seasons' + modelo;
    }

}
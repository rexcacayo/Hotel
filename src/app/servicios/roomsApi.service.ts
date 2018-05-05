import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs/rxjs';
import { Room } from '../clases/room';
import { Extra } from '../clases/extra';

@Injectable()
export class RoomsApiService{
    
    constructor(private http: Http){}

    getRooms(apiUrl:string): Observable<Room[]>{
        return this.http.get(this.getUrl(apiUrl, '')).map(this.getDatos).catch(this.error);
    }

    getRoom(apiUrl:string, id:number): Observable<Room>{
        return this.http.get(this.getUrl(apiUrl, '/' + id)).map(this.getDato).catch(this.error);
    }

    addRoom(apiUrl:string, model: Room): Observable<Room[]>{
        return this.http.post(this.getUrl(apiUrl, ''),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    editRoom(apiUrl:string, model: Room): Observable<Room[]>{
        return this.http.put(this.getUrl(apiUrl, '/' + model.id),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    deleteRoom(apiUrl:string, model: Room): Observable<Room>{
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
        let rooms: Array<Room> = [];
        for(var i = 0;i<datos.length;i++) { 
          let room: Room = new Room(0,'','','','','',Array<Extra>());
          room.id = datos[i].id;
          room.nombre = datos[i].nombre;
          room.descripcion = datos[i].descripcion;
          room.capacidad = datos[i].capacidad;
          room.precio1 = datos[i].precio1;
          room.precio2 = datos[i].precio2;
          room.extras = datos[i].extras;
          rooms.push(room);
        } 
        return rooms || [];
    }

    private getDato(data: Response){
        let datos = data.json()['data'];
        let room: Room = new Room(0,'','','','','',Array<Extra>());
        room.id = datos.id;
        room.nombre = datos.nombre;
        room.descripcion = datos.descripcion;
        room.capacidad = datos.capacidad;
        room.precio1 = datos.precio1;
        room.precio2 = datos.precio2;
        room.extras = datos.extras;
        return room;
    }

    private setDato(model: Room){
        let datos: any = 
        {
            "nombre": model.nombre,
            "descripcion": model.descripcion,
            "capacidad": model.capacidad,
            "precio1": model.precio1,
            "precio2": model.precio2,
            "extras": model.extras
        };
        console.log("SetDatos: " + datos);
        return datos;
    }

    private getUrl(apiUrl:string, modelo: String){
        console.log('getUrl: ' + apiUrl);
        return apiUrl + 'rooms' + modelo;
    }

}
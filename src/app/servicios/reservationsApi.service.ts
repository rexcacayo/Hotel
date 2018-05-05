import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs/rxjs';
import { Reservation } from '../clases/reservation';
import { Extra } from '../clases/extra';

@Injectable()
export class ReservationsApiService{
    
    constructor(private http: Http){}

    getReservations(apiUrl:string): Observable<Reservation[]>{
        return this.http.get(this.getUrl(apiUrl, '')).map(this.getDatos).catch(this.error);
    }

    addReservation(apiUrl:string, model: Reservation): Observable<Reservation[]>{
        return this.http.post(this.getUrl(apiUrl, ''),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    editReservation(apiUrl:string, model: Reservation): Observable<Reservation[]>{
        return this.http.put(this.getUrl(apiUrl, '/' + model.id),this.setDato(model)).map(this.getDatos).catch(this.error);
    }

    deleteReservation(apiUrl:string, model: Reservation): Observable<Reservation>{
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
        let reservations: Array<Reservation> = [];
        for(var i = 0;i<datos.length;i++) { 
          let reservation: Reservation = new Reservation(0,'','','','','',0);
          reservation.id = datos[i].id;
          reservation.nombre = datos[i].nombre;
          reservation.comentarios = datos[i].comentarios;
          reservation.fechaEntrada = datos[i].fecha_entrada;
          reservation.fechaSalida = datos[i].fecha_salida;
          reservation.precio = datos[i].precio;
          reservation.roomId = datos[i].room_id;
          reservations.push(reservation);
        } 
        return reservations || [];
    }

    private setDato(model: Reservation){
        let datos: any = 
        {
            "nombre": model.nombre,
            "comentarios": model.comentarios,
            "fecha_entrada": model.fechaEntrada,
            "fecha_salida": model.fechaSalida,
            "precio": model.precio,
            "room_id": model.roomId
        };
        console.log("SetDatos: " + datos);
        return datos;
    }

    private getUrl(apiUrl:string, modelo: String){
        console.log('getUrl: ' + apiUrl);
        return apiUrl + 'reservations' + modelo;
    }

}
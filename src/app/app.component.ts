import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Room } from './clases/room';
import { Extra } from './clases/extra';
import { Reservation } from './clases/reservation';
import { Season } from './clases/season';
import { RoomsApiService } from './servicios/roomsApi.service';
import { ReservationsApiService } from './servicios/reservationsApi.service';
import { SeasonsApiService } from './servicios/seasonsApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  nombreCliente:string;
  comentariosCliente:string;
  fechaEntrada: Date;
  fechaSalida: Date;
  rooms: Array<Room> = [];
  seasons: Array<Season> = [];
  reservations: Array<Reservation> = [];
  capacidades: Array<number> = [];
  apiUrl:string = '';
  roomId: string;
  room: Room = new Room(0,'','','','','',Array<Extra>());
  showRoomDetails: boolean = false;
  showPrecioReserva: boolean = false;
  extras: Array<Extra> = [];
  extrasAssigned: Array<Extra> = [];
  precioTB:string;
  precioTA:string;
  precioFinal:number;
  precioFinalPorPersona:number;
  precioFinalExtras:number;
  precioFinalHabitacion:number;
  capacidad:number;
  reservation: Reservation = new Reservation(0,'','','','','',0);

  constructor(
    private servicioRooms: RoomsApiService,
    private servicioReservations: ReservationsApiService,
    private servicioSeasons: SeasonsApiService,
    private http:Http
  ) {
  }

  ngOnInit() {
    this.http.get('assets/appConfig.json').subscribe(res => {
      this.apiUrl = res.json()[0]['apiUrl'];
      this.servicioRooms.getRooms(this.apiUrl).subscribe(data => {
        this.rooms = data;
        console.log(this.rooms);
      });
    });
  }

  showDetails(){
    //Se obtiene la habitación escogida
    this.room = this.rooms.filter(value => value.id === parseInt(this.roomId))[0];
    console.log(this.room);

    //Se muestran los precios
    this.precioTB = this.room.precio1;
    this.precioTA = this.room.precio2;

    //Se llena el combo de la capacidad
    this.capacidades = [];
    for (var index = 1; index <= parseInt(this.room.capacidad); index++) {
      this.capacidades.push(index); 
    }

    //Se muestran los extras de la habitación
    this.extras = this.room.extras;

    this.showRoomDetails = true;
  }

  asignarExtra(extra:Extra){
    console.log(extra);
    if(this.extrasAssigned.includes(extra)){
      this.extrasAssigned.splice(this.extrasAssigned.indexOf(extra), 1);
    }else{
      this.extrasAssigned.push(extra);
    }
  }

  buscarDisponibilidad(){
    this.showPrecioReserva = false;
    if(this.fechaEntrada > this.fechaSalida){
      console.log('rango incorrecto');
      alert('Rango de Fechas Incorrecto');
      return false;
    }

    console.log(this.fechaEntrada);
    console.log(this.fechaSalida);
    

    let fechaEntradaDate = new Date(this.fechaEntrada);
    let fechaSalidaDate = new Date(this.fechaSalida);    
    
    this.servicioReservations.getReservations(this.apiUrl).subscribe(data => {
      this.reservations = data;
      console.log(this.reservations);

      //Se valida que haya disponibilidad de habitación para el rango de fechas seleccionado
      this.reservations.forEach(reservation => {  
        console.log('Fecha Entrada Reservación: ' + reservation.fechaEntrada);
        let fechaEntradaReservationArray:string[] = reservation.fechaEntrada.split('/');
        let fechaEntradaReservationDate = new Date(Number.parseInt(fechaEntradaReservationArray[2]),Number.parseInt(fechaEntradaReservationArray[1])-1,Number.parseInt(fechaEntradaReservationArray[0]));
        console.log('Fecha Entrada Reservación Date: ' + fechaEntradaReservationDate);
        
        console.log('Fecha Salida Reservación: ' + reservation.fechaSalida);
        let fechaSalidaReservationArray:string[] = reservation.fechaSalida.split('/');
        let fechaSalidaReservationDate = new Date(Number.parseInt(fechaSalidaReservationArray[2]),Number.parseInt(fechaSalidaReservationArray[1])-1,Number.parseInt(fechaSalidaReservationArray[0]));
        console.log('Fecha Salida Reservación Date: ' + fechaSalidaReservationDate);
        
        console.log(this.room.id);
        console.log(reservation.roomId);
        console.log(this.fechaEntrada);
        console.log(fechaEntradaReservationDate);
        console.log(this.fechaSalida);
        console.log(fechaSalidaReservationDate);
        if((this.room.id == reservation.roomId) &&
          ((fechaEntradaDate > fechaEntradaReservationDate && fechaEntradaDate < fechaSalidaReservationDate) ||
          (fechaSalidaDate > fechaEntradaReservationDate && fechaSalidaDate < fechaSalidaReservationDate) ||
          (fechaEntradaDate < fechaEntradaReservationDate && fechaSalidaDate > fechaSalidaReservationDate))
        ){
          alert('No existe disponibilidad para el rango de fechas seleccionado');
          return false;
        }
      });

      //Se obtiene la cantidad de días de la reservación
      let diferencia = fechaSalidaDate.getTime() - fechaEntradaDate.getTime();
      let cantidad = diferencia/(1000*60*60*24) + 1;
      console.log(cantidad);

      //Hace la totalización para el cálculo del precio de la reserva
      this.servicioSeasons.getSeasons(this.apiUrl).subscribe(data => {
        this.seasons = data;
        console.log(this.seasons);
        
        let precioReserva = 0;
        let precioReservaHabitacion = 0
        let precioReservaExtras = 0

        //Se suman los días que están en temporada alta
        this.seasons.forEach(season => {
          console.log('Fecha Temporada Alta: ' + season.fecha);
          let fechaTemporadaAltaArray:string[] = season.fecha.split('/');
          let fechaTemporadaAltaDate = new Date(Number.parseInt(fechaTemporadaAltaArray[2]),Number.parseInt(fechaTemporadaAltaArray[1])-1,Number.parseInt(fechaTemporadaAltaArray[0]));
          console.log('Fecha Temporada Alta Date: ' + fechaTemporadaAltaDate);
          if(fechaTemporadaAltaDate >= fechaEntradaDate && fechaTemporadaAltaDate <= fechaSalidaDate){
            console.log('esta fecha está dentro del rango');
            //Se suma el precio de temporada alta de la habitación
            precioReserva += parseInt(this.room.precio2);
            precioReservaHabitacion += parseInt(this.room.precio2);

            //Se suma el precio de temporada alta de los extras escogidos
            this.extrasAssigned.forEach(extraAssigned => {
              precioReserva += parseInt(extraAssigned.precio2);
              precioReservaExtras += parseInt(extraAssigned.precio2);
            });

            //Le restamos un día a la cantidad de días de la reserva para efectos
            //de luego sumar el precio normal a los días restantes
            cantidad = cantidad - 1;
          }
        });

        //A continuación sumaremos los precios de los días de temporada baja junto con los extras escogidos
        for (var index = 1; index <= cantidad; index++) {
          precioReserva += parseInt(this.room.precio1);
          precioReservaHabitacion += parseInt(this.room.precio1);
          
          this.extrasAssigned.forEach(extraAssigned => {
            precioReserva += parseInt(extraAssigned.precio1);
            precioReservaExtras += parseInt(extraAssigned.precio1);
          });
        }

        console.log('Cantidad de Días restantes: ' + cantidad);
        console.log(precioReserva);
        this.showPrecioReserva = true;
        this.precioFinalHabitacion = precioReservaHabitacion;
        this.precioFinalExtras = precioReservaExtras;
        this.precioFinalPorPersona = precioReserva;
        let precioReservaFinal = precioReserva * this.capacidad;
        this.precioFinal = precioReservaFinal;
      });

      
    });
  }

  reservar(){
    if(!this.nombreCliente){
      alert('Debe ingresar su nombre');
      return false;
    }

    if(!this.comentariosCliente){
      alert('Debe ingresar un comentario');
      return false;
    }

    this.reservation.nombre = this.nombreCliente;
    this.reservation.comentarios = this.comentariosCliente;
    
    let fechaEntradaArray:string[] = this.fechaEntrada.toString().split('-');
    this.reservation.fechaEntrada = fechaEntradaArray[2] + '/' + fechaEntradaArray[1] + '/' + fechaEntradaArray[0];
    
    let fechaSalidaArray:string[] = this.fechaSalida.toString().split('-');
    this.reservation.fechaSalida = fechaSalidaArray[2] + '/' + fechaSalidaArray[1] + '/' + fechaSalidaArray[0];
    
    this.reservation.precio = this.precioFinal.toString();

    this.reservation.roomId = parseInt(this.roomId);

    console.log(this.reservation);
        
    this.servicioReservations.addReservation(this.apiUrl, this.reservation).subscribe(data => {
      console.log(data['data']);
      alert('La reservación se ejecutó con éxito');
    });
  }
}

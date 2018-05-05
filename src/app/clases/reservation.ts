import { Room } from './room'

export class Reservation{

    constructor(
        public id: number,
        public nombre: string,
        public comentarios: string,
        public fechaEntrada: string,
        public fechaSalida: string,
        public precio: string,
        public roomId: number
    ){

    }

}
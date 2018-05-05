import { Extra } from './extra'

export class Room{

    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public capacidad: string,
        public precio1: string,
        public precio2: string,
        public extras: Extra[]
    ){

    }

}
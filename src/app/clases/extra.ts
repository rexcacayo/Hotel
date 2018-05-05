import { Room } from './room'

export class Extra{

    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public precio1: string,
        public precio2: string,
        public rooms: Room[],
        public isChecked: boolean
    ){

    }

}
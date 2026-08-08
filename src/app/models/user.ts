import { Ubicacion } from "./ubicacion";
export class User {

  constructor(
    public first_name: string,
    public last_name: string,
    public numdoc: string,
    public telefono: string,
    public email: string,
    public activo: boolean,
    public terminos: boolean,
    public ubicacionId?: Ubicacion,
    public password?: string,
    public google?: boolean,
    public role?: 'PROPIETARIO' | 'ADMIN' | 'GUARDIA' | 'VISITA' |'EMPLEADO' ,
    public uid?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ){}

}

export class Role {
  id: number;
  name: string;
  }

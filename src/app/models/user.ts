

export class User {


  constructor(
    public username: string,
    public first_name: string,
    public last_name: string,
    public numdoc: string,
    public telefono: string,
    public email: string,
    public terminos: boolean,
    public password?: string,
    public google?: boolean,
    public role?: 'PROPIETARIO' | 'ADMIN' | 'GUARDIA' | 'VISITA' ,
    public uid?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ){}

}

export class Role {
  id: number;
  name: string;
  }

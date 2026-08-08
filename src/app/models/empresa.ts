import { Pais } from "./pais.model";
//padre
export class Empresa {
  _id?: string;          
  nombre: string;
  rif_nit?: string;
  pais: Pais;   
  telefono: string;   
  direccion: string;   
  tipo: 'EMPRESA' | 'RESIDENCIAL';   
  status: 'ACTIVO' | 'SUSPENDIDO';   
  createdAt?: string | Date; 
}

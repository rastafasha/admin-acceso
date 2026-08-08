import { Empresa } from "./empresa";

export class Ubicacion {
  _id?: string;          
  empresaId: Empresa;
  bloque_torre?: string;
  numero_identificador: string;  
  createdAt?: string | Date; 
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa';
const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor(
    private http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  getEmpresas() {
    const url = `${base_url}/empresa`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, empresas: Empresa }) => resp.empresas)
      )
  }

  getEmpresaById(_id: string) {
    const url = `${base_url}/empresa/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, empresa: Empresa }) => resp.empresa)
      );
  }

  createEmpresa(empresa: Empresa) {
    const url = `${base_url}/empresa/`;
    return this.http.post(url, empresa, this.headers);
  }

  updateEmpresa(empresa: Empresa) {
    const url = `${base_url}/empresa/${empresa._id}`;
    return this.http.put(url, empresa, this.headers);
  }

  deleteEmpresa(_id: string) {
    const url = `${base_url}/empresa/${_id}`;
    return this.http.delete(url, this.headers);
  }


}

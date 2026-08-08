import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ubicacion } from '../models/ubicacion';
const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
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


  getUbicaciones() {

    const url = `${base_url}/ubicacion`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, ubicaciones: Ubicacion }) => resp.ubicaciones)
      )
  }

  getUbicacionById(_id: string) {
    const url = `${base_url}/ubicacion/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, ubicacion: Ubicacion }) => resp.ubicacion)
      );
  }

  createUbicacion(ubicacion: Ubicacion) {
    const url = `${base_url}/ubicacion/`;
    return this.http.post(url, ubicacion, this.headers);
  }

  updateUbicacion(ubicacion: Ubicacion) {
    const url = `${base_url}/ubicacion/${ubicacion._id}`;
    return this.http.put(url, ubicacion, this.headers);
  }

  deleteUbicacion(_id: string) {
    const url = `${base_url}/ubicacion/${_id}`;
    return this.http.delete(url, this.headers);
  }

}

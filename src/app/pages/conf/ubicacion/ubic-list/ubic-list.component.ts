import { HttpClient, HttpBackend } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Empresa } from 'src/app/models/empresa';
import { Ubicacion } from 'src/app/models/ubicacion';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ubic-list',
  standalone: false,
  templateUrl: './ubic-list.component.html',
  styleUrl: './ubic-list.component.css'
})
export class UbicListComponent {
  @Input() displaycomponent: string = 'block';
  title = "Ubicaciones"
  ubicaciones: Ubicacion;
  user: User;
  p: number = 1;
  count: number = 8;
  error: string;
  msm_error: string;
  loading = false;
  selectedUbicacion: Ubicacion;

  query: string = '';

  constructor(
    private http: HttpClient,
    private ubicacionService: UbicacionService,
    handler: HttpBackend,
    private busquedasService: BusquedasService,

  ) {
    this.http = new HttpClient(handler);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getUbicaciones();
    this.getUser();
    this.closeMenu();
  }

  getUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getUbicaciones(): void {
    this.ubicacionService.getUbicaciones().subscribe(
      res => {
        this.ubicaciones = res;
        error => this.error = error
      }
    );
  }

  PageSize() {
    this.getUbicaciones();

  }

  closeMenu() {
    var menuLateral = document.getElementsByClassName("sidebar");
    for (var i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");

    }
  }

  eliminarUbicacion(_id: string) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ubicacionService.deleteUbicacion(_id).subscribe(
          response => {
            this.getUbicaciones();
          }
        );
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }


  // goBack() {
  //   this.location.back(); // <-- go back to previous location on cancel
  // }

  search() {
    if (!this.query) {
      this.ngOnInit();
    } else {
      return this.busquedasService.searchGlobal(this.query).subscribe(
        (resp: any) => {
          this.ubicaciones = resp.empresas;

        }
      )
    }
  }

  openCrearModal(): void {
    this.selectedUbicacion = null;
  }
  openEditModal(ubicacion:Ubicacion): void {
    this.selectedUbicacion = ubicacion;
  }

  onCloseModal(): void {
    this.selectedUbicacion = null;
  }

}

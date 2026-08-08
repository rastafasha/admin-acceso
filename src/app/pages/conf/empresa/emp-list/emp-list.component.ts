import { HttpClient, HttpBackend } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Empresa } from 'src/app/models/empresa';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emp-list',
  standalone: false,
  templateUrl: './emp-list.component.html',
  styleUrl: './emp-list.component.css'
})
export class EmpListComponent {
  @Input() displaycomponent: string = 'block';
  title = "Empresas"
  empresas: Empresa;
  user: User;
  p: number = 1;
  count: number = 8;
  error: string;
  msm_error: string;
  loading = false;
  selectedEmpresa: Empresa;

  query: string = '';

  constructor(
    private http: HttpClient,
    private empresaService: EmpresaService,
    handler: HttpBackend,
    private busquedasService: BusquedasService,

  ) {
    this.http = new HttpClient(handler);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getEmpresas();
    this.getUser();
    this.closeMenu();
  }

  getUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(
      res => {
        this.empresas = res;
        error => this.error = error
      }
    );
  }

  PageSize() {
    this.getEmpresas();

  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }

  eliminarCategory(_id: string) {
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
        this.empresaService.deleteEmpresa(_id).subscribe(
          response => {
            this.getEmpresas();
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
          this.empresas = resp.empresas;

        }
      )
    }
  }

  openCrearModal(): void {
      this.selectedEmpresa = null;
    }
    openEditModal(empresa:Empresa): void {
      this.selectedEmpresa = empresa;
    }
  
    onCloseModal(): void {
      this.selectedEmpresa = null;
    }

}

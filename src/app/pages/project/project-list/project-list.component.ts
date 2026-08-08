import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/models/property';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: false
})
export class ProjectListComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  @Input() limit!: number;
  @Input() userprofile!: User;

  selectedType: string = '';
  selectedEstado: string = '';

  title: string = 'Propiedades';
  projects: Property[];
  query: string = '';
  p: number = 1;
  count: number = 6;
  loading: boolean = false;
  selectedProject: Property;
  usuario: any;
  usuario_id: any;

  constructor(
    private projectService: PropertyService,
    private busquedasService: BusquedasService,
    private activatedRoute: ActivatedRoute,

  ) {
    let USER = localStorage.getItem('usuario');
    this.usuario = JSON.parse(USER ? USER : '');
  }



  ngOnInit(): void {
    this.activatedRoute.params.subscribe((resp: any) => {
      this.usuario_id = resp.id;
    })
    this.getProjects();
  }

  getProjects() {
    this.loading = true;
    this.projectService.getProperties().subscribe((resp: any) => {
      this.projects = resp;
      this.loading = false;
    })
  }



  onEditProject(project: Property) {
    this.selectedProject = project;
  }

  onDeleteProject(project: Property) {
    this.selectedProject = project;

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
        this.projectService.deleteProperty(project._id).subscribe((resp: any) => {
          this.getProjects();
        })
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }

  search() {
    // // CASO 1: No hay término de búsqueda escrito en el input
    // if (!this.query || this.query.trim() === '') {

    //   // Subcaso A: Seleccionó una categoría (con o sin estado)
    //   if (this.selectedType) {
    //     return this.projectService.getProjectsByCategory(this.selectedType, this.selectedEstado)
    //       .subscribe((resp: any) => {
    //         this.projects = resp;
    //         this.projectService.emitFilteredProjects(resp);
    //       });
    //   }
    //   // Subcaso B: NO hay categoría, pero SÍ hay un estado seleccionado (Usa el nuevo método seguro)
    //   else if (this.selectedEstado) {
    //     return this.busquedasService.searchByCollection('portafolios', '', this.selectedEstado)
    //       .subscribe((resp: any) => {
    //         this.projects = resp.resultados || [];
    //         this.projectService.emitFilteredProjects(this.projects);
    //       });
    //   }
    //   // Subcaso C: Sin filtros seleccionados
    //   else {
    //     this.ngOnInit();
    //     return;
    //   }
    // }

    // // CASO 2: Sí hay un término de búsqueda en el input de texto
    // else {
    //   return this.busquedasService.searchGlobal(this.query, this.selectedEstado)
    //     .subscribe((resp: any) => {
    //       let filteredProjects = resp.projects || [];

    //       if (this.selectedType) {
    //         filteredProjects = filteredProjects.filter(
    //           (project: any) => project.category?.nombre === this.selectedType
    //         );
    //       }

    //       this.projects = filteredProjects;
    //       this.projectService.emitFilteredProjects(filteredProjects);
    //     });
    // }
  }






  PageSize() {
    this.query = '';
    this.selectedType = '';
    this.selectedEstado = '';
    this.ngOnInit();

  }
  openEditModal(): void {
    this.selectedProject = null;
  }

  onCloseModal(): void {
    this.selectedProject = null;
  }

}


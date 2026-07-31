import { Component, Input, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.css'],
    standalone: false
})
export class DashboardAdminComponent implements OnInit {
  @Input() projects: Property[] = [];

  title = 'Panel Administrativo';
  public user: any;
  public profile: User;
  displaycomponent: string = 'none';
  limit = 3;

  error: string;
  uid:string;

  usuarios: User;
  usuario: User;
  query:string ='';
  selectedProject:Property;
  projectSeleccionado:Property;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private projectService: PropertyService,
    

  ) {
    this.user = authService.getLocalStorage();
  }

  ngOnInit(): void {

    window.scrollTo(0,0);
    this.authService.closeMenu();
    this.uid = this.user.uid;
    this.getProjectsData();
    this.subscribeToFilteredProjects();
  }

  getProjectsData(){
    this.projectService.getProperties().subscribe((resp:any)=>{
      this.projects = resp;
    })
  }

  onEditProject(project: Property) {
    this.selectedProject = project;
  }
  onDeleteProject(project: Property) {
    this.selectedProject = project;
  }

  subscribeToFilteredProjects() {
    this.projectService.filteredProjects$.subscribe((filteredProjects: Property[]) => {
      if (filteredProjects && filteredProjects.length > 0) {
        this.projects = filteredProjects;
      } else {
        this.getProjectsData();
      }
    });
  }


  openEditModal(): void {
    this.selectedProject = null;
  }

  onCloseModal(): void {
    this.projectSeleccionado = null;
  }

  PageSize() {
    this.getProjectsData();

  }
  
}

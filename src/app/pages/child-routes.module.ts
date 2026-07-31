import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionesComponent } from './conf/configuraciones/configuraciones.component';
import { RolesViewComponent } from './conf/roles/roles-view/roles-view.component';

//pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';
import { AuthGuard } from '../guards/auth.guard';
// import { CondicionesComponent } from './condiciones/condiciones.component';




const childRoutes: Routes = [

    // 1. Redirección inicial: Si entran a '', los manda a /dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 2. Ruta real: Aquí es donde verdaderamente se protege y se carga el componente
  { path: '', component: DashboardComponent,  data: { title: 'Dashboard' } },

  // 3. Comodín: Cualquier ruta inválida también va al Dashboard (debe ir al final)
  { path: '**', redirectTo: 'dashboard' },
    //auth

    //configuraciones
    { path: 'configuraciones',  component: ConfiguracionesComponent, data:{title:'Configuraciones'} },
    { path: 'buscar', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'buscar/:termino', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'rolesconf', component: RolesViewComponent, data:{title:'Planes'} },
    
    { path: 'projects', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'projects/:id', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'project/crear', component: ProjectEditComponent, data:{title:'Crear Proyecto'} },
    { path: 'project/edit/:id', component: ProjectEditComponent, data:{title:'Editar Proyecto'} },
    
    
  
    //user
    { path: 'users', component: UsersComponent, data:{title:'Usuarios'} },

    { path: 'search/:searchItem', component: UsersComponent, data:{title:'Buscar'} },
    
   

    





]

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoute),
    RouterModule.forChild(childRoutes),
  ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }

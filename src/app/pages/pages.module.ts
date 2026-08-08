import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//modulos

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//helpers
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import {PagesComponent} from './pages.component';
import { ConfModule } from './conf/conf.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';

// paginacion
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

//componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { UsersComponent } from './users/users.component';

import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProjectModule } from './project/project.module';
import { ProfileComponent } from './users/profile/profile.component';
import { ProfileEditComponent } from './users/profile-edit/profile-edit.component';

@NgModule({ declarations: [
        DashboardComponent,
        DashboardAdminComponent,
        PagesComponent,
        UsersComponent,
        ProfileComponent,
        ProfileEditComponent,
        DashboardUserComponent,
        PagesComponent,
        BusquedaComponent
    ],
    exports: [
        DashboardComponent,
        DashboardAdminComponent,
        PagesComponent,
        UsersComponent,
         ProfileComponent,
        ProfileEditComponent,
        DashboardUserComponent,
        PagesComponent,
        BusquedaComponent
    ], imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        PipesModule,
        ConfModule,
        ComponentsModule,
        NgxPaginationModule,
        ProjectModule,
    ], providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class PagesModule { }

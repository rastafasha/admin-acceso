import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Angular plugin.
import { NgxPaginationModule } from 'ngx-pagination';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsuariosRecientesComponent } from './usuarios-recientes/usuarios-recientes.component';
import {PipesModule} from '../pipes/pipes.module';
import { ModalCondicionesComponent } from './modal-condiciones/modal-condiciones.component';
import { ProjectitemComponent } from './projectitem/projectitem.component';
import { ConfModule } from '../pages/conf/conf.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({ 
    declarations: [
        UsuariosRecientesComponent,
        ModalCondicionesComponent,
        ProjectitemComponent,
    ],
    exports: [
        UsuariosRecientesComponent,
        ModalCondicionesComponent,
        ProjectitemComponent,
    ], 
    imports: [CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule,
        NgxPaginationModule,
        ConfModule,
        SharedModule
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ComponentsModule { }

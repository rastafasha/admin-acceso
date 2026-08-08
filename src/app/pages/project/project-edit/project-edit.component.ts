import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Empresa } from 'src/app/models/empresa';
import { Property } from 'src/app/models/property';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: false
})
export class ProjectEditComponent implements OnInit, OnChanges {
  @Input() projectSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  projectForm: FormGroup;
  title: string;
  usuario: any;
  partners: User[];
  project: Property;
  id: string;

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;
  projectExiste: boolean = false;
  empresas:Empresa;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private projectService: PropertyService,
    private empresaService: EmpresaService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
    this.getUEmpresas();
  }

  getUEmpresas() {
    this.empresaService.getEmpresas().subscribe((resp: any) => {
      this.empresas = resp;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.projectSeleccionado)
    if (
      changes['projectSeleccionado'] &&
      changes['projectSeleccionado'].currentValue
    ) {
      this.title = 'Editando Portafolio';
      const project = changes['projectSeleccionado'].currentValue;
      
      this.projectForm.patchValue({
        id: project._id,
        numeroCasa: project.numeroCasa,
        calleOBloque: project.calleOBloque,
        propietarioId: project.propietarioId,
        empresaId: project.empresaId?._id || null,
        
      });
      this.projectSeleccionado = project;
      this.title = 'Editando Portafolio';
    } else {
      this.title = 'Editando Portafolio';
    }

  }


 


  validarFormulario() {
    this.projectForm = this.fb.group({
      numeroCasa: [''],
      calleOBloque: [''],
      propietarioId: [''],
      empresaId: [''],
    });
  }


  onClose() {
    this.projectSeleccionado = null;
    this.currentStep = 1;
    this.projectForm.reset();
    this.title = 'Creando Proyecto';
    // Also reset default values if needed
    this.projectForm.patchValue({
      numeroCasa: null,
      calleOBloque: null,
      propietarioId: null,
      empresaId: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable
    

     // Close modal programmatically
        const modalElement = document.getElementById('editProject');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshProjectList.emit();
        this.closeModal.emit();
        this.ngOnInit()
  }

  




  handleSubmit() {
    if (!this.projectForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { title } = this.projectForm.value;

    const dataToSend = {
      ...this.projectForm.value,
    };

    if (this.projectSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.projectSeleccionado._id,
      };
      this.projectService.updateProperty(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${title}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editProject');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshProjectList.emit();
        this.ngOnInit()
      });
    } else {
      //crear
      this.projectService.createProperty(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.projectSeleccionado = resp;
        Swal.fire('¡Paso 1 completado!', 'Tienda creada. Ahora Agrega la info para el menu y sube la imagen.', 'success');
        this.currentStep = 2;
      });
    }
  }


}

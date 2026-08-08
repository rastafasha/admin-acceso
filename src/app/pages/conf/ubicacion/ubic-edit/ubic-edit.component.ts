import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa';
import { Ubicacion } from 'src/app/models/ubicacion';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-ubic-edit',
  standalone: false,
  templateUrl: './ubic-edit.component.html',
  styleUrl: './ubic-edit.component.css'
})
export class UbicEditComponent {

  @Input() ubicacionSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  ubicacionForm: FormGroup;
  title: string;
  usuario: any;
  empresa: Ubicacion;
  id: string;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;
  projectExiste: boolean = false;
  empresas: Empresa[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ubicacionService: UbicacionService,
    private empresaService: EmpresaService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
    this.getEmpresas();
  }

  getEmpresas() {
    this.empresaService.getEmpresas().subscribe((resp: any) => {
      this.empresas = resp;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (
      changes['ubicacionSeleccionado'] &&
      changes['ubicacionSeleccionado'].currentValue
    ) {
      this.title = 'Editando Ubicación';
      const ubicacion = changes['ubicacionSeleccionado'].currentValue;

      this.ubicacionForm.patchValue({
        id: ubicacion._id,
        numero_identificador: ubicacion.numero_identificador,
        bloque_torre: ubicacion.bloque_torre,
        empresaId: ubicacion.empresaId._id,

      });
      this.ubicacionSeleccionado = ubicacion;
      this.title = 'Editando Ubicación';
    } else {
      this.title = 'Editando Ubicación';
    }

  }

  validarFormulario() {
    this.ubicacionForm = this.fb.group({
      numero_identificador: ['', Validators.required],
      bloque_torre: [''],
      empresaId: ['', Validators.required],
    });
  }


  onClose() {
    this.ubicacionSeleccionado = null;
    this.ubicacionForm.reset();
    this.title = 'Creando Ubicación';
    // Also reset default values if needed
    this.ubicacionForm.patchValue({
      numero_identificador: null,
      bloque_torre: null,
      empresaId: null,
    });
    // Emit event to parent to reset the empresaSeleccionado variable
    // Close modal programmatically
    const modalElement = document.getElementById('editUbicacion');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();

    }
    // Emit event to refresh empresa list
    this.refreshProjectList.emit();
    this.closeModal.emit();
    this.ngOnInit()
  }


  handleSubmit() {
    if (!this.ubicacionForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.ubicacionForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { title } = this.ubicacionForm.value;

    const dataToSend = {
      ...this.ubicacionForm.value,
    };

    if (this.ubicacionSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.ubicacionSeleccionado._id,
      };
      this.ubicacionService.updateUbicacion(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${title}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editUbicacion');
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
      this.ubicacionService.createUbicacion(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.ubicacionSeleccionado = resp;
        Swal.fire('¡Creado!', 'Creado satisfactoriamente.', 'success');
        // Close modal programmatically
        const modalElement = document.getElementById('editUbicacion');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();

        }
        // Emit event to refresh project list
        this.refreshProjectList.emit();
        this.ngOnInit()
      });
    }
  }


}

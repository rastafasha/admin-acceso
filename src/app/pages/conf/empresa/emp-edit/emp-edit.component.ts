import {  Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa';
import { Pais } from 'src/app/models/pais.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PaisService } from 'src/app/services/pais.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-emp-edit',
  standalone: false,
  templateUrl: './emp-edit.component.html',
  styleUrl: './emp-edit.component.css'
})
export class EmpEditComponent {

  @Input() empresaSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  empresaForm: FormGroup;
  title: string;
  usuario: any;
  empresa: Empresa;
  id: string;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;
  projectExiste: boolean = false;
   paises: Pais;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private paisService: PaisService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
    this.getPaises();
  }

  getPaises() {
    this.paisService.getPaises().subscribe((resp: any) => {
      this.paises = resp;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['empresaSeleccionado'] &&
      changes['empresaSeleccionado'].currentValue
    ) {
      this.title = 'Editando Empresa';
      const empresa = changes['empresaSeleccionado'].currentValue;
      
      this.empresaForm.patchValue({
        id: empresa._id,
        nombre: empresa.nombre,
        rif_nit: empresa.rif_nit,
        pais: empresa.pais._id,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
        tipo: empresa.tipo,
        status: empresa.status,
        
      });
      this.empresaSeleccionado = empresa;
      this.title = 'Editando Empresa';
    } else {
      this.title = 'Editando Empresa';
    }

  }

  validarFormulario() {
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      rif_nit: [''],
      pais: ['' ,Validators.required],
      telefono: ['',Validators.required],
      tipo: ['',Validators.required],
      status: ['',Validators.required],
      direccion: [''],
    });
  }


  onClose() {
    this.empresaSeleccionado = null;
    this.currentStep = 1;
    this.empresaForm.reset();
    this.title = 'Creando Empresa';
    // Also reset default values if needed
    this.empresaForm.patchValue({
      nombre: null,
      rif_nit: null,
      pais: null,
      telefono: null,
      direccion: null,
      tipo: null,
      status: null,
    });
    // Emit event to parent to reset the empresaSeleccionado variable
     // Close modal programmatically
        const modalElement = document.getElementById('editEmpresa');
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
    if (!this.empresaForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.empresaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { title } = this.empresaForm.value;

    const dataToSend = {
      ...this.empresaForm.value,
    };

    if (this.empresaSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.empresaSeleccionado._id,
      };
      this.empresaService.updateEmpresa(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${title}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editEmpresa');
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
      this.empresaService.createEmpresa(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.empresaSeleccionado = resp;
        Swal.fire('¡Creado!', 'Creado satisfactoriamente.', 'success');
        // Close modal programmatically
        const modalElement = document.getElementById('editEmpresa');
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

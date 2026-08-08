import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'src/app/models/empresa';
import { Pais } from 'src/app/models/pais.model';
import { Ubicacion } from 'src/app/models/ubicacion';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PaisService } from 'src/app/services/pais.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-profile-edit',
  standalone: false,
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {


  @Input() profileSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  perfilForm: FormGroup;
  title: string;
  usuario: any;
  user: User;
  id: string;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;
  projectExiste: boolean = false;
  ubicaciones:Ubicacion;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private ubicacionService: UbicacionService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
    this.getUbicaciones();
  }

  getUbicaciones() {
    this.ubicacionService.getUbicaciones().subscribe((resp: any) => {
      this.ubicaciones = resp;
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.profileSeleccionado)
    if (
      changes['profileSeleccionado'] &&
      changes['profileSeleccionado'].currentValue
    ) {
      this.title = 'Editando Perfil';
      const profile = changes['profileSeleccionado'].currentValue;
      
      this.perfilForm.patchValue({
        id: profile._id,
        ubicacionId: profile.ubicacionId?._id || null,
        first_name: profile.first_name,
        last_name: profile.last_name,
        numdoc: profile.numdoc,
        telefono: profile.telefono,
        email: profile.email,
        activo: profile.activo,
        role: profile.role,
        
      });
      this.profileSeleccionado = profile;
      this.title = 'Editando Perfil';
    } else {
      this.title = 'Editando Perfil';
    }

  }

  validarFormulario() {
    this.perfilForm = this.fb.group({
      username: ['', Validators.required],
      ubicacionId: [''],
      first_name: ['' ,Validators.required],
      last_name: ['',Validators.required],
      numdoc: ['',Validators.required],
      telefono: ['',Validators.required],
      activo: ['', Validators.required],
      email: [''],
      password: [''],
      role: [''],
    });
  }


  onClose() {
    this.profileSeleccionado = null;
    this.currentStep = 1;
    this.perfilForm.reset();
    this.title = 'Creando Perfil';
    // Also reset default values if needed
    this.perfilForm.patchValue({
      username: null,
      ubicacionId: null,
      first_name: null,
      last_name: null,
      numdoc: null,
      telefono: null,
      email: null,
      role: null,
      activo: false,
    });
    // Emit event to parent to reset the profileSeleccionado variable
     // Close modal programmatically
        const modalElement = document.getElementById('editProfile');
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
    if (!this.perfilForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.perfilForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.isLoading = true;
    const { title } = this.perfilForm.value;

    const dataToSend = {
      ...this.perfilForm.value,
    };

    if (this.profileSeleccionado) {
      //actualizar
      const data = {
        ...dataToSend,
        _id: this.profileSeleccionado._id,
      };
      this.userService.update(data).subscribe((resp) => {
        this.isLoading = false;
        Swal.fire(
          'Actualizado',
          `${title}  actualizado correctamente`,
          'success'
        );

        // Close modal programmatically
        const modalElement = document.getElementById('editProfile');
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
      this.userService.cargarUsuarios(dataToSend).subscribe((resp: any) => {
        this.isLoading = false;
        this.profileSeleccionado = resp;
        Swal.fire('¡Creado!', 'Creado satisfactoriamente.', 'success');
        // Close modal programmatically
        const modalElement = document.getElementById('editProfile');
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

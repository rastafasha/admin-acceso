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
import { Property } from 'src/app/models/property';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
  public imagenSubir!: File;
  public imgTemp: any = null;
  public FILE_AVATAR: any;
  public IMAGE_PREVISUALIZA: any = 'assets/img/user-06.jpg';

  isLoading: boolean = false;
  currentStep = 1;
  cargandoImagen = false;
  projectExiste: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private authService: AuthService,
    private projectService: PropertyService,
    private fileUploadService: FileUploadService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['projectSeleccionado'] &&
      changes['projectSeleccionado'].currentValue
    ) {
      this.title = 'Editando Portafolio';
      const project = changes['projectSeleccionado'].currentValue;
      
      this.projectForm.patchValue({
        id: project._id,
        title: project.title,
        description: project.description,
        introhome: project.introhome,
        popup: project.popup,
        slug: project.slug,
        url: project.url,
        category: project.category._id,
        youtubeurl: project.youtubeurl,
        isFeatured: project.isFeatured,
        status: project.status,
        
      });
      this.projectSeleccionado = project;
      this.title = 'Editando Portafolio';
    } else {
      this.title = 'Editando Portafolio';
    }

  }


 


  validarFormulario() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      introhome: [''],
      category: [''],
      slug: ['',],
      url: ['',],
      popup: ['', Validators.required],
      youtubeurl: [''],
      isFeatured: [''],
      status: ['PENDING'],
      // img: [''],
      id: [''],
    });
  }


  onClose() {
    this.projectSeleccionado = null;
    this.currentStep = 1;
    this.projectForm.reset();
    this.title = 'Creando Proyecto';
    // Also reset default values if needed
    this.projectForm.patchValue({
      title: null,
      description: null,
      introhome: null,
      category: null,
      slug: null,
      url: null,
      popup: null,
      youtubeurl: null,
      isFeatured: null,
      status: ['PENDING'],
      img: null,
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

  nextStep() {
    const title = this.projectForm.get('title');
    const description = this.projectForm.get('description');
    const introhome = this.projectForm.get('introhome');
    const category = this.projectForm.get('category');
    const popup = this.projectForm.get('popup');

    if (title?.invalid || description?.invalid ||
      introhome?.invalid || 
      category?.invalid ||
      popup?.invalid

    ) {
      title?.markAsTouched();
      description?.markAsTouched();
      introhome?.markAsTouched();
      category?.markAsTouched();
      popup?.markAsTouched();
      this.projectForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;


  }

 
  prevStep() {
    this.currentStep = 1;
  }
  prevStep2() {
    this.currentStep = 2;
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

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.cargandoImagen = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'portafolios', this.projectSeleccionado._id)
      .then(img => {
        this.projectSeleccionado.img = img;
        this.cargandoImagen = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        this.cargandoImagen = false;
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

}

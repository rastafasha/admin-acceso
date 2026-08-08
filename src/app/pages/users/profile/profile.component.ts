import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  @Input() userSeleccionado;
  @Output() refreshProjectList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  title: string;
  usuario: any;
  id: string;

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.getLocalStorage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.userSeleccionado)
    
    if (
      changes['userSeleccionado'] &&
      changes['userSeleccionado'].currentValue
    ) {
      this.title = 'Viendo Usuario';
      const user = changes['userSeleccionado'].currentValue;
      this.userSeleccionado = user;
    } 

  }

  

  onClose() {
    this.userSeleccionado = null;
    // Emit event to parent to reset the empresaSeleccionado variable
    // Close modal programmatically
    const modalElement = document.getElementById('viewUser');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();

    }
    // Emit event to refresh empresa list
    this.refreshProjectList.emit();
    this.closeModal.emit();
    this.ngOnInit()
  }



}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';

@Component({
    selector: 'app-projectitem',
    templateUrl: './projectitem.component.html',
    styleUrls: ['./projectitem.component.css'],
    standalone: false
})
export class ProjectitemComponent implements OnInit {

  @Input() project: Property;
  @Input() showAdminControls: boolean = false;

  @Output() onTogglePresentation = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<Property>();
  @Output() onEditProject = new EventEmitter<Property>();
  @Output() selectedProject: Property;

 
  ngOnInit(): void {
  }

  togglePresentation() {
    this.onTogglePresentation.emit(this.project._id);
  }

  editProject() {
    this.onEdit.emit(this.project._id);
  }

  deleteProject() {
    this.onDelete.emit(this.project);

  }

  openEditModal(project: Property): void {
    this.onEditProject.emit(project);
  }

  openPaymentsModal(project: Property): void {
    this.selectedProject = project;
    // console.log(project);
  }
}

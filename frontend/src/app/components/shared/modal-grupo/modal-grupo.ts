import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormTextarea } from '../form-textarea/form-textarea';

@Component({
  selector: 'app-modal-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, FormInput, FormTextarea],
  templateUrl: './modal-grupo.html',
  styleUrl: './modal-grupo.scss',
})
export class ModalGrupo implements OnInit, OnChanges {
  @Input() visible = false;
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["visible"] && this.visible) {
      this.resetearFormulario();
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ["", Validators.required],
      direccion: [""],
      descripcion: [""],
    });
  }

  private resetearFormulario(): void {
    this.formulario.reset({
      nombre: "",
      direccion: "",
      descripcion: "",
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGuardar(): void {
    if (this.formulario.valid) {
      this.guardar.emit(this.formulario.value);
    }
  }

  onClickFondo(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCerrar();
    }
  }
}

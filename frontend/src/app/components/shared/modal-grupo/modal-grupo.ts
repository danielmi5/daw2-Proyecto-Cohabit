import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormTextarea } from '../form-textarea/form-textarea';

// Modal para crear grupo con formulario (nombre, dirección, descripción)
@Component({
  selector: 'app-modal-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, FormInput, FormTextarea],
  templateUrl: './modal-grupo.html',
  styleUrls: ['./modal-grupo.scss'],
})
export class ModalGrupo implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  formulario!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Inicializa el formulario.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Resetea el formulario cuando se abre el modal.
   * 
   * @param changes - Cambios detectados en las propiedades Input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["visible"] && this.visible) {
      this.resetearFormulario();
    }
  }

  /**
   * Crea el formulario con sus validadores.
   */
  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ["", Validators.required],
      direccion: [""],
      descripcion: [""],
    });
  }

  /**
   * Resetea todos los campos del formulario a sus valores por defecto.
   */
  private resetearFormulario(): void {
    this.formulario.reset({
      nombre: "",
      direccion: "",
      descripcion: "",
    });
  }

  /**
   * Emite evento de cierre.
   */
  onCerrar(): void {
    this.cerrar.emit();
  }

  /**
   * Valida y emite los datos del formulario.
   */
  onGuardar(): void {
    if (this.formulario.valid) {
      this.guardar.emit(this.formulario.value);
    }
  }

  /**
   * Cierra el modal al hacer clic en el fondo (backdrop).
   * 
   * @param event - Evento click del mouse
   */
  onClickFondo(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCerrar();
    }
  }
}

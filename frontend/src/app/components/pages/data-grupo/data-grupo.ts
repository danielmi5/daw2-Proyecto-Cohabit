import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoResponse } from '../../../models/grupo.model';
import { FormInput } from '../../shared/form-input/form-input';
import { FormTextarea } from '../../shared/form-textarea/form-textarea';
import { Button } from '../../shared/button/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-data-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormTextarea, Button],
  templateUrl: './data-grupo.html',
  styleUrl: './data-grupo.scss',
})
export class DataGrupo implements OnChanges {
  @Input() grupo: GrupoResponse | null = null;

  @Output() actualizar = new EventEmitter<GrupoResponse>();
  @Output() subirFoto = new EventEmitter<File>();
  @Output() eliminarFoto = new EventEmitter<void>();

  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre: [''],
      direccion: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupo']) {
      this.formulario.patchValue({
        nombre: this.grupo?.nombre ?? '',
        direccion: this.grupo?.direccion ?? ''
      });
    }
  }

  onGuardar(): void {
    if (this.formulario.invalid) return;
    const valores = this.formulario.value;
    const actualizado: GrupoResponse = {
      ...this.grupo,
      nombre: valores.nombre,
      direccion: valores.direccion
    };
    this.actualizar.emit(actualizado);
  }

  onSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.subirFoto.emit(file);
  }

  onEliminarFoto(): void {
    this.eliminarFoto.emit();
  }
}

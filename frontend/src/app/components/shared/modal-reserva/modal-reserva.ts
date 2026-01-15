import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormSelect } from '../form-select/form-select';
import { ReservaResponse, RecursoResponse } from '../../../models';

@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, FormInput, FormSelect],
  templateUrl: './modal-reserva.html',
  styleUrl: './modal-reserva.scss',
})
export class ModalReserva implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() modoEdicion = false;
  @Input() reserva: ReservaResponse | null = null;
  @Input() recursos: RecursoResponse[] = [];
  
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
    if (changes['reserva'] && this.reserva && this.modoEdicion) {
      this.cargarDatosReserva();
    } else if (changes['visible'] && this.visible && !this.modoEdicion) {
      this.resetearFormulario();
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      recursoId: [null, Validators.required],
      repeticion: ['no-repetir', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  private cargarDatosReserva(): void {
    if (this.reserva) {
      this.formulario.patchValue({
        recursoId: this.reserva.recursoId,
        repeticion: 'no-repetir',
        fecha: this.reserva.fecha,
        horaInicio: this.reserva.horaInicio,
        horaFin: this.reserva.horaFin,
      });
    }
  }

  private resetearFormulario(): void {
    this.formulario.reset({
      repeticion: 'no-repetir'
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

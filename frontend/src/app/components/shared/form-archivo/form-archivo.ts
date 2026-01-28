import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from "../button/button";
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

// Upload de archivos con drag & drop y preview. Implementa ControlValueAccessor
@Component({
  selector: 'app-form-archivo',
  standalone: true,
  imports: [CommonModule, Button, FeatherIconDirective],
  templateUrl: './form-archivo.html',
  styleUrls: ['./form-archivo.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormArchivo),
      multi: true
    }
  ]
})
export class FormArchivo implements ControlValueAccessor {
  @Input() accept = 'image/*';
  @Input() mostrarRequisitos = true;
  @Output() archivoSeleccionado = new EventEmitter<File>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragOver = false;

  private onChange: (file: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Escribe un valor en el componente (parte de ControlValueAccessor).
   * 
   * @param file - Archivo a establecer o null
   */
  writeValue(file: File | null): void {
    this.selectedFile = file;
    if (file) {
      this.createPreview(file);
    } else {
      this.previewUrl = null;
    }
    this.cdr.detectChanges();
  }

  /**
   * Registra la función callback para cambios de valor.
   * 
   * @param fn - Función a llamar cuando el archivo cambie
   */
  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra la función callback para el evento touched.
   * 
   * @param fn - Función a llamar cuando el campo sea tocado
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Maneja la selección de archivo mediante el input.
   * 
   * @param event - Evento change del input file
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  /**
   * Maneja el evento dragover (usuario arrastrando sobre el componente).
   * 
   * @param event - Evento dragover
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Maneja el evento dragleave (usuario sale del área de drop).
   * 
   * @param event - Evento dragleave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Maneja el evento drop (usuario suelta un archivo).
   * 
   * @param event - Evento drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  /**
   * Procesa el archivo seleccionado.
   * 
   * @param file - Archivo a procesar
   */
  private handleFile(file: File): void {

    this.selectedFile = file;
    this.createPreview(file);
    this.onChange(file);
    this.onTouched();
    this.archivoSeleccionado.emit(file);
    this.cdr.detectChanges();
  }

  /**
   * Crea una previsualización de la imagen.
   * 
   * @param file - Archivo de imagen
   */
  private createPreview(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    this.cdr.detectChanges();
  }

  /**
   * Elimina el archivo seleccionado.
   */
  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.onChange(null);
    this.onTouched();
    this.cdr.detectChanges();
  }

  /**
   * Activa el input de archivo para que el usuario seleccione un archivo.
   */
  triggerFileInput(): void {
    const input = document.querySelector('.subida-archivo__entrada') as HTMLInputElement;
    input?.click();
  }
}

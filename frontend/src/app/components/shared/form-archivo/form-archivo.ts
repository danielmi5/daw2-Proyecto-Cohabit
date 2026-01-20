import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from "../button/button";
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-form-archivo',
  standalone: true,
  imports: [CommonModule, Button, FeatherIconDirective],
  templateUrl: './form-archivo.html',
  styleUrl: './form-archivo.scss',
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

  writeValue(file: File | null): void {
    this.selectedFile = file;
    if (file) {
      this.createPreview(file);
    } else {
      this.previewUrl = null;
    }
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {

    this.selectedFile = file;
    this.createPreview(file);
    this.onChange(file);
    this.onTouched();
    this.archivoSeleccionado.emit(file);
  }

  private createPreview(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.onChange(null);
    this.onTouched();
  }

  triggerFileInput(): void {
    const input = document.querySelector('.subida-archivo__entrada') as HTMLInputElement;
    input?.click();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-subir-pdf',
  standalone: true,
  imports: [CommonModule, MatIconModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './subir-pdf.component.html',
  styleUrls: ['./subir-pdf.component.css']
})
export class SubirPdfComponent {
  archivo: File | null = null;
  isHovering = false;
  cargando = false;
  constructor(private http: HttpClient) { }

  // ✅ Selección por input file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivo = file;
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  }

  // ✅ Drag & Drop: arrastrar encima
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  // ✅ Drag & Drop: salir del área
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  // ✅ Drag & Drop: soltar archivo
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        this.archivo = file;
      } else {
        alert('Solo se permiten archivos PDF.');
      }
    }
  }

  // ✅ Enviar archivo al backend
  enviarPDF() {
    if (!this.archivo) return;

    this.cargando = true;

    const formData = new FormData();
    formData.append('file', this.archivo);

    this.http.post('http://contador-pdf-production.up.railway.app/api/contar-numerar', formData, {
      responseType: 'blob'
    }).subscribe(blob => {
      this.cargando = false;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pdf_numerado.pdf';
      a.click();
    }, error => {
      this.cargando = false;
      alert('Hubo un error al procesar el PDF.');
    });
  }
}
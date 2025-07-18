import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

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

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivo = file;
    } else {
      Swal.fire('Archivo inválido', 'Por favor selecciona un archivo PDF válido.', 'error');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        this.archivo = file;
      } else {
        Swal.fire('Archivo inválido', 'Solo se permiten archivos PDF.', 'warning');
      }
    }
  }

  enviarPDF() {
    if (!this.archivo) return;

    this.cargando = true;

    Swal.fire({
      title: 'Procesando...',
      text: 'Estamos enumerando tu documento. Esto puede tardar un momento.',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    const formData = new FormData();
    formData.append('file', this.archivo);

    this.http.post('https://contador-pdf-production.up.railway.app/api/contar-numerar', formData, {
      responseType: 'blob'
    }).subscribe(blob => {
      this.cargando = false;
      Swal.close();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pdf_numerado.pdf';
      a.click();

      Swal.fire('Completado', 'Tu archivo ha sido descargado con éxito.', 'success');
    }, error => {
      this.cargando = false;
      Swal.close();
      Swal.fire('Error', 'Hubo un problema al procesar el PDF.', 'error');
    });
  }
}

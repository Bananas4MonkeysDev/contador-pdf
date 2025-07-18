package com.example.contadorpdfbackend.controller;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // permite conexión desde Angular
public class PdfController {

    @PostMapping("/contar-numerar")
    public ResponseEntity<Resource> procesarPDF(@RequestParam("file") MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            int numPages = document.getNumberOfPages();
            int maxDigits = String.valueOf(numPages).length();
            int fixedLength = Math.max(5, maxDigits); // mínimo 5 dígitos como 00001

            for (int i = 0; i < numPages; i++) {
                PDPage page = document.getPage(i);
                PDRectangle mediaBox = page.getMediaBox();

                // Texto como 00001, 00002, ...
                String pageNumber = String.format("%0" + fixedLength + "d", i + 1);

                // Coordenadas: top-right con margen de 40 unidades
                float margin = 40;
                float x = mediaBox.getUpperRightX() - margin;
                float y = mediaBox.getUpperRightY() - margin;

                // Dibujar el número
                try (PDPageContentStream contentStream = new PDPageContentStream(
                        document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {

                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
                    contentStream.setLeading(14.5f);

                    // Ajuste para que el texto quede alineado a la derecha
                    float textWidth = PDType1Font.HELVETICA_BOLD.getStringWidth(pageNumber) / 1000 * 10;
                    contentStream.newLineAtOffset(x - textWidth, y);

                    contentStream.showText(pageNumber);
                    contentStream.endText();
                }
            }

            // Guardar en memoria
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            ByteArrayResource resource = new ByteArrayResource(out.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pdf_numerado.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (IOException e) {
            e.printStackTrace(); // Opcional: imprimir error en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
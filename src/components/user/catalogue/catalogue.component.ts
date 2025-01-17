import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-catalogue',
  imports: [
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  animations: [fadeAnimation],
})
export class CatalogueComponent {
  compressedImage!: string;

  constructor(
    private http: HttpClient,
    private imageCompress: NgxImageCompressService
  ) {}

  compressImage(imagePath: string) {
    this.http.get(imagePath, { responseType: 'blob' }).subscribe((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageCompress
          .compressFile(reader.result as string, -1, 50, 50)
          .then((compressed) => {
            this.compressedImage = compressed;
          });
      };
      reader.readAsDataURL(blob);
    });
  }

  onPreview() {
    window.open('assets/catalogues/Test.pdf', '_blank');
  }

  onDownload() {
    const fileUrl = 'assets/catalogues/Test.pdf';
    const fileName = 'download.pdf';
    const link = document.createElement('a');
    link.download = fileName;
    link.href = fileUrl;
    link.click();
  }
}

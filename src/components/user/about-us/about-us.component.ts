import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-us',
  imports: [MatButtonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  animations: [fadeAnimation],
})
export class AboutUsComponent implements OnInit {
  tileBgImg: string = '/assets/images/tile.jpg';
  certificateImages: WritableSignal<Array<any>> = signal([]);
  downloadCatalogueBgImg: string = '/assets/images/bg-4-1.jpg';

  ngOnInit(): void {
    this.certificateImages.set([
      {
        name: 'GST',
        img: '/assets/images/certificates/gst.png',
      },
      {
        name: 'ISO Certificate',
        img: '/assets/images/certificates/iso.png',
      },
      {
        name: 'UDYAM',
        img: '/assets/images/certificates/udyam.png',
      },
      {
        name: 'Award',
        img: '/assets/images/certificates/award.png',
      },
      {
        name: 'Catalogue',
        img: '/assets/images/certificates/catalogue.png',
      },
    ]);
  }
}

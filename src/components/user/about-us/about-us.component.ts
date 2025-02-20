import {
  Component,
  computed,
  HostListener,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  animations: [fadeAnimation],
})
export class AboutUsComponent implements OnInit {
  tileBgImg: string = '/assets/images/tile.jpg';
  certificateImages: WritableSignal<Array<any>> = signal([]);
  downloadCatalogueBgImg: Signal<string> = computed(() => {
    return this.isMobileView()
      ? '/assets/images/bg-4-2.jpg'
      : '/assets/images/bg-4-1.jpg';
  });
  isMobileView: WritableSignal<boolean> = signal(window.innerWidth < 1024);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView.set(window.innerWidth < 1024);
  }

  constructor(private router: Router) {}

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

  navigateToContactus = () => {
    this.router.navigate(['/contact-us']);
  };
}

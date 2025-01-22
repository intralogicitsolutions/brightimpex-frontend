import {
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeAnimation],
})
export class HomeComponent implements OnInit {
  title = 'Bright Impex';
  images: WritableSignal<Array<any>> = signal([]);
  catalogueImages: WritableSignal<Array<any>> = signal([]);
  currentSlideIndex: WritableSignal<number> = signal(0);
  currentSlide: Signal<any> = computed(
    () => this.images()?.[this.currentSlideIndex()]
  );
  currentTranslate: Signal<number> = computed(
    () => -this.currentSlideIndex() * 100
  );

  ngOnInit(): void {
    this.images.set([
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'WALL COLLECTION',
        sizes: ['12X18 mm', '12X24 mm'],
      },
      {
        img: '/assets/images/home/home-2.jpg',
        name: 'KITCHEN COLLECTION',
        sizes: ['12X24 mm', '12X18 mm'],
      },
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'BATHROOM COLLECTION',
        sizes: ['24X12 mm', '18X12 mm'],
      },
    ]);

    this.catalogueImages.set([
      {
        name: 'Bathroom Walls',
        img: '/assets/images/catalogues/1.jpg',
      },
      {
        name: 'Living-room Walls',
        img: '/assets/images/catalogues/2.jpg',
      },
      {
        name: 'Outdoor Walls',
        img: '/assets/images/catalogues/3.jpg',
      },
      {
        name: 'Commercial Walls',
        img: '/assets/images/catalogues/4.jpg',
      },
      {
        name: 'Waterproof Walls',
        img: '/assets/images/catalogues/5.jpg',
      },
    ]);
  }

  nextSlide() {
    if (this.currentSlideIndex() < this.images().length - 1) {
      this.currentSlideIndex.update((index) => index + 1);
    } else {
      this.currentSlideIndex.set(0); // Loop back to the first image
    }
  }

  prevSlide() {
    if (this.currentSlideIndex() > 0) {
      this.currentSlideIndex.update((index) => index - 1);
    } else {
      this.currentSlideIndex.set(this.images().length - 1); // Loop to the last image
    }
  }
}

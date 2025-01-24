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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeAnimation],
})
export class HomeComponent implements OnInit {
  title = 'Bright Impex';
  images: WritableSignal<Array<any>> = signal([]);
  trendingImages: WritableSignal<Array<any>> = signal([]);
  catalogueImages: WritableSignal<Array<any>> = signal([]);
  productImages: WritableSignal<Array<any>> = signal([]);

  // Main Slider
  currentSlideIndex: WritableSignal<number> = signal(0);
  currentSlide: Signal<any> = computed(
    () => this.images()?.[this.currentSlideIndex()]
  );
  currentTranslate: Signal<number> = computed(
    () => -this.currentSlideIndex() * 100
  );

  // Trending Slider
  currentTrendingSlideIndex: WritableSignal<number> = signal(0);
  currentTrendingSlide: Signal<any> = computed(
    () => this.trendingImages()?.[this.currentTrendingSlideIndex()]
  );
  currentTrendingSlideTranslate: Signal<number> = computed(
    () => -this.currentTrendingSlideIndex() * 100
  );

  locationBgImg: string = '/assets/images/bg-2.jpg';
  catalogueBgImg: string = '/assets/images/bg.png';

  ngOnInit(): void {
    this.images.set([
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'WALL COLLECTION',
        sizes: ['12X18 mm', '12X24 mm'],
        category: 'wall-collection'
      },
      {
        img: '/assets/images/home/home-2.jpg',
        name: 'FLOOR COLLECTION',
        sizes: ['12X24 mm', '12X18 mm'],
        category: 'floor-collection'
      },
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'PARKING COLLECTION',
        sizes: ['24X12 mm', '18X12 mm'],
        category: 'parking-collection'
      },
    ]);

    this.trendingImages.set([
      {
        img: '/assets/images/home/home-4.jpg',
        name: 'BATHROOM FLOOR',
      },
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'KITCHEN FLOOR',
      },
      {
        img: '/assets/images/home/home-2.jpg',
        name: 'BATHROOM FLOOR',
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

    this.productImages.set([
      {
        name: 'The Ultima - 12X24 mm',
        img: '/assets/images/catalogues/6.jpg',
        desc: 'The Ultima, an extra-large Vitrified Slabs by Kajaria, is bigger than your dreams. While their large size exuberates the grandeur of real marble, their stunning looks charm connoisseurs across the globe.',
      },
      {
        name: 'DuRock - 40X40 mm',
        img: '/assets/images/catalogues/7.jpg',
        desc: 'DuRock - Outdoor Ceramic Floor Tiles can be safely used in all internal and external spaces that are exposed to high load and DuRock - Outdoor Ceramic Floor Tiles can be safely used in all internal and external.',
      },
      {
        name: 'Step Stone',
        img: '/assets/images/catalogues/8.jpg',
        desc: 'Ready to Install Vitrified Steps: Stairs and staircases are not defined by their functionality alone. These practical units are also interesting from a design perspective. Ready to Install Vitrified Steps.',
      },
      {
        name: 'Vitronite',
        img: '/assets/images/catalogues/3.jpg',
        desc: 'New Age Modern Counter Tops: The incredible range of slabs are designed for modern application and to create a chic and urban aura for a space. New Age Modern Counter Tops.',
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

  nextTrendingSlide() {
    if (this.currentTrendingSlideIndex() < this.trendingImages().length - 1) {
      this.currentTrendingSlideIndex.update((index) => index + 1);
    } else {
      this.currentTrendingSlideIndex.set(0); // Loop back to the first image
    }
  }

  prevTrendingSlide() {
    if (this.currentTrendingSlideIndex() > 0) {
      this.currentTrendingSlideIndex.update((index) => index - 1);
    } else {
      this.currentTrendingSlideIndex.set(this.trendingImages().length - 1); // Loop to the last image
    }
  }
}

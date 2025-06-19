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
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { IResponse } from '../../../shared/interfaces/response-i';
import { LoaderService } from '../../../shared/services/loader.service';

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
  floorImages: WritableSignal<Array<any>> = signal([]);
  catalogueImages: WritableSignal<Array<any>> = signal([]);
  productImages: WritableSignal<Array<any>> = signal([]);
  isMobileView: WritableSignal<boolean> = signal(window.innerWidth < 1024);

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
    () => this.floorImages()?.[this.currentTrendingSlideIndex()]
  );
  currentTrendingSlideTranslate: Signal<number> = computed(
    () => -this.currentTrendingSlideIndex() * 100
  );

  locationBgImg: string = '/assets/images/bg-2.jpg';
  catalogueBgImg: string = '/assets/images/bg.png';

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView.set(window.innerWidth < 1024);
  }

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.images.set([
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'WALL COLLECTION',
        sizes: ['300X450 mm', '300X600 mm', '600X1200 mm'],
        category: '679302f17665aeadd2a0a1a4',
      },
      {
        img: '/assets/images/home/home-2.jpg',
        name: 'FLOOR COLLECTION',
        sizes: ['600X600 mm', '600X1200 mm', '800X1600 mm', '1200X1800 mm'],
        category: '679303037665aeadd2a0a1a6',
      },
      {
        img: '/assets/images/home/home-4.jpg',
        name: 'PARKING COLLECTION',
        sizes: ['400X400 mm', '600X600 mm'],
        category: '6793031e7665aeadd2a0a1aa',
      },
    ]);

    this.floorImages.set([
      {
        img: '/assets/images/home/home-4.jpg',
        name: 'BATHROOM FLOOR',
      },
      {
        img: '/assets/images/home/home-1.jpg',
        name: 'KITCHEN FLOOR',
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
        name: 'Commercial Walls',
        img: '/assets/images/catalogues/4.jpg',
      },
      {
        name: 'Walls',
        img: '/assets/images/catalogues/5.jpg',
      },
      {
        name: 'Outdoor Parking',
        img: '/assets/images/catalogues/3.jpg',
      },
    ]);

    this.productImages.set([
      {
        name: '600x1200/1200x2400 ',
        img: '/assets/images/catalogues/6.jpg',
        desc: "Elevate your space with our premium 600x1200 mm tiles perfectly designed for those who appreciate modern luxury and bold design. These large format tiles offer a seamless, spacious look, ideal for both walls and floors in residential and commercial settings. Available in a variety of elegant finishes matte, glossy or textured they bring sophistication and durability together in perfect harmony. Crafted with precision and tested for quality, our 600x1200 mm tiles are more than a surface they're a statement.",
      },
      {
        name: '400x400/600x6000 ',
        img: '/assets/images/catalogues/7.jpg',
        desc: 'Designed to withstand the elements, our 400x400 mm outdoor tiles are the perfect blend of durability and style. Ideal for patios, pathways, balconies, and garden areas, these tiles are built to handle heavy foot traffic and changing weather conditions without compromising on appearance. With anti-slip surfaces, weather-resistant finishes, and a variety of earthy textures and tones, they offer a safe and stylish solution for any outdoor space. Rugged, reliable, and refined these tiles are made to last.',
      },
      {
        name: '800x2400/800x3200',
        img: '/assets/images/catalogues/8.jpg',
        desc: "Transform your spaces with our premium 800 x 2400 mm to 800x3200 slab tiles, the perfect fusion of style, durability, and modern sophistication. Whether you're designing a sleek, contemporary home or a high-end commercial space, these large-format porcelain tiles bring a seamless, luxurious aesthetic to any environment. With their minimal grout lines, these tiles create a flawless, expansive look that enhances any room be it a living room, bathroom, kitchen, or retail space.",
      },
      {
        name: '300x300',
        img: '/assets/images/catalogues/3.jpg',
        desc: "Our 300 x 300 mm tiles are the perfect blend of style, functionality, and affordability, making them ideal for a wide range of applications. Whether you're renovating a kitchen, bathroom, or outdoor area, this tiles offer the ideal solution for residential and commercial spaces alike. With a wide selection of finishes, including matte, glossy, textured, and patterned designs, these tiles can seamlessly fit into any design aesthetic",
      },
    ]);

    // this.updateCatalogue();
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
    if (this.currentTrendingSlideIndex() < this.floorImages().length - 1) {
      this.currentTrendingSlideIndex.update((index) => index + 1);
    } else {
      this.currentTrendingSlideIndex.set(0); // Loop back to the first image
    }
  }

  prevTrendingSlide() {
    if (this.currentTrendingSlideIndex() > 0) {
      this.currentTrendingSlideIndex.update((index) => index - 1);
    } else {
      this.currentTrendingSlideIndex.set(this.floorImages().length - 1); // Loop to the last image
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  // updateCatalogue() {
  //   this.loaderService.showLoader();
  //   this.commonService.getCatalogues().subscribe({
  //     next: (response: IResponse<any>) => {
  //       if (response?.success == 1) {
  //         this.images.update((imgs: any[]) => {
  //           // Return the updated array
  //           return imgs.map((catalogueImg: any) => {
  //             const filteredCategory = response.body.filter((cat: any) => {
  //               return cat.category_id._id == catalogueImg.category;
  //             });

  //             // Take the first two categories, if available
  //             const twoCategory = filteredCategory.slice(0, 2);

  //             // Extract sizes
  //             const sizes = twoCategory.map((category: any) => {
  //               return {
  //                 name: `${category?.size_id?.height}X${category?.size_id?.width} ${category?.size_id?.unit}`,
  //                 size_id: category?.size_id?._id, // Assigning _id to the key 'size_id'
  //               };
  //             });

  //             // Attach sizes to the catalogue image
  //             catalogueImg.sizes = sizes;

  //             return catalogueImg; // Return the modified catalogueImg
  //           });
  //         });
  //       }
  //       this.loaderService.hideLoader();
  //     },
  //     error: (err) => {
  //       this.loaderService.hideLoader();
  //       console.error('Error fetching catalogues:', err);
  //     },
  //   });
  // }
}

import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
  effect,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { fadeAnimation } from '../../../shared/animations/route-animations';

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
export class CatalogueComponent implements OnInit {
  compressedImage!: string;
  catalogueCatagory: WritableSignal<string> = signal('');
  catalogueCatagories: WritableSignal<any[]> = signal([]);
  catalogues: WritableSignal<any[]> = signal([]);
  filteredCatalogues: Signal<any[]> = computed(() => {
    if (this.catalogueCatagory() == 'all') {
      return this.catalogues();
    }
    return this.catalogues().filter(
      (e) => e?.category == this.catalogueCatagory()
    );
  });

  constructor(
    private http: HttpClient,
    private imageCompress: NgxImageCompressService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.catalogueCatagory.set(params?.get('id') || '');
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const stateData: any = navigation.extras.state;
      if (stateData?.filters) {
        console.log({ filters: stateData?.filters });
      }
    }
  }

  ngOnInit(): void {
    this.catalogueCatagories.set([
      {
        name: 'All',
        id: 'all',
      },
      {
        name: 'Wall Collection',
        id: 'wall-collection',
      },
      {
        name: 'Floor Collection',
        id: 'floor-collection',
      },
      {
        name: 'Wooden Plank',
        id: 'wooden-plank',
      },
      {
        name: 'Parking Collection',
        id: 'parking-collection',
      },
      {
        name: 'Slab Collection',
        id: 'slab-collection',
      },
      {
        name: 'Step Raiser',
        id: 'step-raiser',
      },
    ]);

    this.catalogues.set([
      {
        img: 'assets/images/catalogues/1.jpg',
        name: 'Wall Collection',
        desc: '200 X 1200 mm - GVT',
        category: 'wall-collection',
        id: '1',
      },
      {
        img: 'assets/images/catalogues/2.jpg',
        name: 'Floor Collection',
        desc: '1000 X 1000 mm - Full Body',
        category: 'floor-collection',
        id: '2',
      },
      {
        img: 'assets/images/catalogues/3.jpg',
        name: 'Slab Collection',
        desc: '800 X 1600 mm - PGVT',
        category: 'slab-collection',
        id: '3',
      },
      {
        img: 'assets/images/catalogues/4.jpg',
        name: 'Wooden Plank',
        desc: '1200 X 1200 mm - Nano',
        category: 'wooden-plank',
        id: '4',
      },
      {
        img: 'assets/images/catalogues/5.jpg',
        name: 'Step Raiser',
        desc: '800 X 800 mm - Charge',
        category: 'step-raiser',
        id: '5',
      },
      {
        img: 'assets/images/catalogues/6.jpg',
        name: 'Wall Collection',
        desc: '200 X 1200 mm - GVT',
        category: 'wall-collection',
        id: '6',
      },
      {
        img: 'assets/images/catalogues/7.jpg',
        name: 'Floor Collection',
        desc: '1000 X 1000 mm - Full Body',
        category: 'floor-collection',
        id: '7',
      },
      {
        img: 'assets/images/catalogues/8.jpg',
        name: 'Slab Collection',
        desc: '800 X 1600 mm - PGVT',
        category: 'slab-collection',
        id: '8',
      },
      {
        img: 'assets/images/catalogues/1.jpg',
        name: 'Wooden Plank',
        desc: '1200 X 1200 mm - Nano',
        category: 'wooden-plank',
        id: '9',
      },
      {
        img: 'assets/images/catalogues/2.jpg',
        name: 'Wall Collection',
        desc: '200 X 1200 mm - GVT',
        category: 'wall-collection',
        id: '10',
      },
      {
        img: 'assets/images/catalogues/3.jpg',
        name: 'Parking Collection',
        desc: '200 X 1200 mm - GVT',
        category: 'parking-collection',
        id: '11',
      },
    ]);
  }

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

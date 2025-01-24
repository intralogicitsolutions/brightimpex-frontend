import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { environment } from '../../../environments/environment';
import { IResponse } from '../../../shared/interfaces/response-i';

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
  catalogueCatagoryId: WritableSignal<string> = signal('');
  catalogueCatagories: WritableSignal<any[]> = signal([]);
  catalogues: WritableSignal<any[]> = signal([]);
  serverUrl: string = `${environment.apiRoot}/`;
  catalogueSizes: WritableSignal<any> = signal([]);

  filteredCatalogues: Signal<any[]> = computed(() => {
    if (this.catalogueCatagoryId() == 'all') {
      return this.catalogues();
    }
    return this.catalogues().filter(
      (e) => e?.category_id?._id == this.catalogueCatagoryId()
    );
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.catalogueCatagoryId.set(params?.get('id') || '');
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
    this.loadCatalogueCatagories();
    this.loadCatalogues();
    this.loadCatalogueSizes();
  }

  loadCatalogues() {
    this.commonService.getCatalogues().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (response?.body?.length) {
            this.catalogues.set(
              response?.body?.map((e: any) => {
                e[
                  'sizeSeries'
                ] = `${e?.size_id?.height}X${e?.size_id?.width} ${e?.size_id?.unit}`;
                return e;
              })
            );
          }
        } else {
          console.error(response?.msg);
        }
      },
      error: (err) => {},
    });
  }

  loadCatalogueCatagories() {
    this.commonService.getCatalogueCatagories().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          const categories = [
            {
              name: 'All',
              _id: 'all',
            },
            ...(response?.body || []),
          ];
          this.catalogueCatagories.set(categories);
        } else {
          console.error(response?.msg);
        }
      },
      error: (err) => {},
    });
  }

  loadCatalogueSizes() {
    this.commonService.getCatalogueSizes().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this.catalogueSizes.set(response?.body || []);
        } else {
          console.error(response?.msg);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
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

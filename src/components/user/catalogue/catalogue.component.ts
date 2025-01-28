import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { IResponse } from '../../../shared/interfaces/response-i';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-catalogue',
  imports: [
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  animations: [fadeAnimation],
})
export class CatalogueComponent implements OnInit {
  isMobileView: boolean = window.innerWidth < 1024;

  catalogueCatagoryId: WritableSignal<string> = signal('');
  catalogueCatagories: WritableSignal<any[]> = signal([]);
  catalogues: WritableSignal<any[]> = signal([]);
  serverUrl: string = `${environment.apiRoot}/`;
  catalogueSizes: WritableSignal<any> = signal([]);

  catalogueSeries: WritableSignal<any> = signal([]);

  catalogueSizeIds: WritableSignal<string[]> = signal([]);
  catalogueSeriesIds: WritableSignal<string[]> = signal([]);
  selectedCatalogueSizes: WritableSignal<any[]> = signal([]);
  selectedCatalogueSeries: WritableSignal<any[]> = signal([]);

  filteredCatalogueSizes: Signal<any> = computed(() => {
    const cataloguesSizeIds = this.catalogueSizeIds();
    return this.catalogueSizes()?.map((e: any) => {
      if (cataloguesSizeIds?.includes(e?._id)) {
        e['disabled'] = false;
      } else {
        e['disabled'] = true;
        e['checked'] = false;
      }
      return e;
    });
  });

  filteredCatalogueSeries: Signal<any> = computed(() => {
    const cataloguesSeriesIds = this.catalogueSeriesIds();
    return this.catalogueSeries()?.map((e: any) => {
      if (cataloguesSeriesIds?.includes(e?._id)) {
        e['disabled'] = false;
      } else {
        e['disabled'] = true;
        e['checked'] = false;
      }
      return e;
    });
  });

  filteredCatalogues: Signal<any[]> = computed(() => {
    let catalogues;

    // CATEGORY FILTER
    if (this.catalogueCatagoryId() == 'all') {
      catalogues = [...this.catalogues()];
    } else {
      catalogues = this.catalogues().filter(
        (e) => e?.category_id?._id == this.catalogueCatagoryId()
      );
    }

    // SIZE AND SERIES FILTER
    const selectedSizes =
      this.selectedCatalogueSizes()?.map((e) => e?._id) || [];
    const selectedSeries =
      this.selectedCatalogueSeries()?.map((e) => e?._id) || [];

    catalogues?.forEach((catalogue) => {
      catalogue['isHiddenBySize'] = false;
      catalogue['isHiddenBySeries'] = false;

      if (selectedSizes?.length || selectedSeries?.length) {
        if (
          selectedSizes?.length &&
          !selectedSizes?.includes(catalogue?.size_id?._id)
        ) {
          catalogue['isHiddenBySize'] = true;
        }

        if (
          selectedSeries?.length &&
          !selectedSeries?.includes(catalogue?.series_id?._id)
        ) {
          catalogue['isHiddenBySeries'] = true;
        }
      }
    });

    return catalogues;
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

    effect(() => {
      const catalogues = this.filteredCatalogues();

      this.catalogueSizeIds.set(
        catalogues
          ?.filter((e) => !e?.isHiddenBySeries)
          ?.map((e: any) => e?.size_id?._id)
      );

      this.catalogueSeriesIds.set(
        catalogues
          ?.filter((e) => !e?.isHiddenBySize)
          ?.map((e: any) => e?.series_id?._id)
      );
    });
  }

  ngOnInit(): void {
    this.loadCatalogueCatagories();
    this.loadCatalogueSizes();
    this.loadCatalogueSeries();
    this.loadCatalogues();
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

  loadCatalogueSeries() {
    this.commonService.getCatalogueSeries().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this.catalogueSeries.set(response?.body || []);
        } else {
          console.error(response?.msg);
        }
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  changeSize() {
    const selectedCatalogues = this.filteredCatalogueSizes()?.filter(
      (e: any) => e?.checked
    );
    this.selectedCatalogueSizes.set(selectedCatalogues);
  }

  changeSeries() {
    const selectedCatalogues = this.filteredCatalogueSeries()?.filter(
      (e: any) => e?.checked
    );
    this.selectedCatalogueSeries.set(selectedCatalogues);
  }

  onPreview(doc_url: string) {
    window.open(`${this.serverUrl}${doc_url}`, '_blank');
  }

  onDownload(doc_url: string, catalogueName: string) {
    const fileUrl = `${this.serverUrl}${doc_url}`;
    const fileName = `${catalogueName}.pdf`;

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error downloading the file');
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(objectUrl);
      })
      .catch((error) => {
        console.error('Error downloading the file:', error);
      });
  }
}

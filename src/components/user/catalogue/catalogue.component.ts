import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  HostListener,
  OnInit,
  Signal,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-catalogue',
  imports: [
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  animations: [fadeAnimation],
})
export class CatalogueComponent implements OnInit {
  @ViewChild('CategoryTemplate') CategoryTemplate!: TemplateRef<any>;
  @ViewChild('SizeTemplate') SizeTemplate!: TemplateRef<any>;
  @ViewChild('SeriesTemplate') SeriesTemplate!: TemplateRef<any>;
  isFilterOpened: boolean = false;
  isCategorySelected: boolean = true;
  selectedCategoryIndex: number = 0;
  serverUrl: string = `${environment.apiRoot}/`;

  categoryForm!: FormGroup;
  sizeForm!: FormGroup;
  seriesForm!: FormGroup;

  categoryDialogRef!: MatDialogRef<any>;
  sizeDialogRef!: MatDialogRef<any>;
  seriesDialogRef!: MatDialogRef<any>;

  isMobileView: WritableSignal<boolean> = signal(window.innerWidth < 1024);
  catalogueCatagoryId: WritableSignal<string> = signal('');
  catalogueCatagories: WritableSignal<any[]> = signal([]);
  catalogues: WritableSignal<any[]> = signal([]);
  catalogueSizes: WritableSignal<any> = signal([]);
  catalogueSeries: WritableSignal<any> = signal([]);
  catalogueSizeIds: WritableSignal<string[]> = signal([]);
  catalogueSeriesIds: WritableSignal<string[]> = signal([]);
  selectedCatalogueSizes: WritableSignal<any[]> = signal([]);
  selectedCatalogueSeries: WritableSignal<any[]> = signal([]);
  loadedCataloguesCount: WritableSignal<number> = signal(8);

  selectedCategory: WritableSignal<any> = signal(null);
  selectedSize: WritableSignal<any> = signal(null);
  selectedSeries: WritableSignal<any> = signal(null);

  isAdmin: WritableSignal<boolean> = signal(true);

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
    private commonService: CommonService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _snackbar: SnackbarService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.catalogueCatagoryId.set(params?.get('id') || '');
      if (this.isMobileView()) {
        const categoryIndex = this.catalogueCatagories()?.findIndex(
          (e: any) => e?._id == this.catalogueCatagoryId()
        );
        if (categoryIndex !== -1) {
          this.selectedCategoryIndex = categoryIndex;
        } else {
          this.selectedCategoryIndex = 0;
        }
      }
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

      if (!this.isMobileView()) {
        this.loadedCataloguesCount.set(this.filteredCatalogues()?.length);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView.set(window.innerWidth < 1024);
    if (!this.isMobileView()) {
      this.loadedCataloguesCount.set(this.filteredCatalogues()?.length);
    } else {
      this.loadedCataloguesCount.set(8);
    }
  }

  get catalogueProductLength(): number {
    return this.filteredCatalogues()?.filter(
      (e) => !e?.isHiddenBySize && !e?.isHiddenBySeries
    )?.length;
  }

  ngOnInit(): void {
    this.loadCatalogueCatagories();
    this.loadCatalogueSizes();
    this.loadCatalogueSeries();
    this.loadCatalogues();

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });

    this.sizeForm = this.fb.group({
      height: ['', [Validators.required]],
      width: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });

    this.seriesForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  loadCatalogues() {
    this.commonService.getCatalogues().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (response?.body?.length) {
            this.catalogues.set(
              response?.body?.map((e: any) => {
                e[
                  'size'
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
          if (this.isMobileView()) {
            const categoryIndex = this.catalogueCatagories()?.findIndex(
              (e: any) => e?._id == this.catalogueCatagoryId()
            );
            if (categoryIndex !== -1) {
              this.selectedCategoryIndex = categoryIndex;
            } else {
              this.selectedCategoryIndex = 0;
            }
            this.isCategorySelected = false;
          }
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

  toggleFilter() {
    this.isFilterOpened = !this.isFilterOpened;
  }

  onCategoryChange(index: number) {
    if (!this.isCategorySelected) {
      const currentTab = this.catalogueCatagories()?.[index];
      if (currentTab) {
        this.router.navigate([`catalogue/${currentTab?._id}`]);
      }
    }
  }

  loadMoreCatalogues() {
    this.loadedCataloguesCount.update((count) => count + 8);
  }

  openCategoryDialog(category = null) {
    this.selectedCategory.set(category);
    this.categoryForm.reset();
    this.categoryForm.patchValue(category || {});

    this.categoryDialogRef = this.dialog.open(this.CategoryTemplate, {
      height: '400px',
      width: '700px',
      maxWidth: '100vw',
      autoFocus: false,
    });

    this.categoryDialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.loadCatalogueCatagories();
      }
    });
  }

  openSizeDialog(size = null) {
    this.selectedSize.set(size);
    this.sizeForm.reset();
    this.sizeForm.patchValue(size || {});

    this.sizeDialogRef = this.dialog.open(this.SizeTemplate, {
      height: '385px',
      width: '700px',
      maxWidth: '100vw',
      autoFocus: false,
    });

    this.sizeDialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.loadCatalogueSizes();
      }
    });
  }

  openSeriesDialog(series = null) {
    this.selectedSeries.set(series);
    this.seriesForm.reset();
    this.seriesForm.patchValue(series || {});

    this.seriesDialogRef = this.dialog.open(this.SeriesTemplate, {
      height: '385px',
      width: '700px',
      maxWidth: '100vw',
      autoFocus: false,
    });

    this.seriesDialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.loadCatalogueSeries();
      }
    });
  }

  addCatalogue() {
    const dialogRef = this.dialog.open(this.CategoryTemplate, {
      height: '70vh',
      width: '70vw',
      maxWidth: '70vw',
    });
  }

  onSubmitCategory() {
    const categoryData = this.categoryForm.value;
    if (this.selectedCategory()) {
      categoryData['_id'] = this.selectedCategory()?._id;
    }

    let addUpdateCategoryMehod: 'createCategory' | 'updateCategory' =
      categoryData?._id ? 'updateCategory' : 'createCategory';

    this.commonService[addUpdateCategoryMehod](categoryData).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (categoryData?._id) {
            this._snackbar.success(
              `Category '${categoryData?.name}' updated successfully`
            );
          } else {
            this._snackbar.success(
              `Category '${categoryData?.name}' created successfully`
            );
          }
        } else {
          this._snackbar.error(response?.msg);
        }

        this.categoryDialogRef.close('refresh');
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg || 'Something went wrong, please try again later'
        );
        this.categoryDialogRef.close('refresh');
      },
    });
  }

  onSubmitSize() {
    const sizeData = this.sizeForm.value;
    if (this.selectedSize()) {
      sizeData['_id'] = this.selectedSize()?._id;
    }

    let addUpdateSizeMehod: 'createSize' | 'updateSize' = sizeData?._id
      ? 'updateSize'
      : 'createSize';

    this.commonService[addUpdateSizeMehod](sizeData).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (sizeData?._id) {
            this._snackbar.success(`Size updated successfully`);
          } else {
            this._snackbar.success(`Size created successfully`);
          }
        } else {
          this._snackbar.error(response?.msg);
        }

        this.sizeDialogRef.close('refresh');
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg || 'Something went wrong, please try again later'
        );
        this.sizeDialogRef.close('refresh');
      },
    });
  }

  deleteCategory() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: '200px',
      width: '350px',
      maxWidth: '100vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.commonService
          .deleteCategory(this.selectedCategory()?._id)
          .subscribe({
            next: (response: IResponse<any>) => {
              if (response?.success == 1) {
                this._snackbar.success(
                  `Category '${
                    this.selectedCategory()?.name
                  }' deleted successfully`
                );
              } else {
                this._snackbar.error(response?.msg);
              }

              this.categoryDialogRef.close('refresh');
            },
            error: (err) => {
              this._snackbar.error(
                err?.msg || 'Something went wrong, please try again later'
              );
              this.categoryDialogRef.close('refresh');
            },
          });
      }
    });
  }

  deleteSize() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: '200px',
      width: '350px',
      maxWidth: '100vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.commonService.deleteSize(this.selectedSize()?._id).subscribe({
          next: (response: IResponse<any>) => {
            if (response?.success == 1) {
              this._snackbar.success(`Size deleted successfully`);
            } else {
              this._snackbar.error(response?.msg);
            }

            this.sizeDialogRef.close('refresh');
          },
          error: (err: any) => {
            this._snackbar.error(
              err?.msg || 'Something went wrong, please try again later'
            );
            this.sizeDialogRef.close('refresh');
          },
        });
      }
    });
  }
}

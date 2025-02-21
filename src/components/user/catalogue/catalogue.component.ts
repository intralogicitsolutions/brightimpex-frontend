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
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { DeleteConfirmationComponent } from '../../../shared/components/delete-confirmation/delete-confirmation.component';
import { IResponse } from '../../../shared/interfaces/response-i';
import { CommonService } from '../../../shared/services/common.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

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
    MatSelectModule,
    RouterLink,
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
  @ViewChild('CatalogueTemplate') CatalogueTemplate!: TemplateRef<any>;
  isFilterOpened: boolean = false;
  isCategorySelected: boolean = true;
  selectedCategoryIndex: number = 0;
  serverUrl: string = `${environment.apiRoot}/`;
  stateData: any;

  categoryForm!: FormGroup;
  sizeForm!: FormGroup;
  seriesForm!: FormGroup;
  catalogueForm!: FormGroup;

  categoryDialogRef!: MatDialogRef<any>;
  sizeDialogRef!: MatDialogRef<any>;
  seriesDialogRef!: MatDialogRef<any>;
  catalogueDialogRef!: MatDialogRef<any>;

  isMobileView: WritableSignal<boolean> = signal(window.innerWidth < 1024);
  isCategoryLoaded: WritableSignal<boolean> = signal(false);
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
  selectedCatalogue: WritableSignal<any> = signal(null);

  isAdmin: WritableSignal<boolean> = signal(false);

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
      const categoryIndex = this.catalogueCatagories()?.findIndex(
        (e: any) => e?._id == this.catalogueCatagoryId()
      );
      if (categoryIndex !== -1) {
        this.selectedCategoryIndex = categoryIndex;
      } else {
        this.selectedCategoryIndex = 0;
      }
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.stateData = navigation.extras.state;
      if (this.stateData?.filters) {
        console.log({ filters: this.stateData?.filters });
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
    this.isAdmin = this.commonService.isAdmin;

    this.loadCatalogueCatagories();
    this.loadCatalogueSeries();
    this.loadCatalogues();
    this.loadCatalogueSizes();

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

    this.catalogueForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      image_name: ['', [Validators.required]],
      image_path: ['', [Validators.required]],
      catalogue_doc_name: ['', [Validators.required]],
      catalogue_doc_path: ['', [Validators.required]],
      size_id: ['', [Validators.required]],
      series_id: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
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
          const categoryIndex = this.catalogueCatagories()?.findIndex(
            (e: any) => e?._id == this.catalogueCatagoryId()
          );
          if (categoryIndex !== -1) {
            this.selectedCategoryIndex = categoryIndex;
          } else {
            this.selectedCategoryIndex = 0;
          }
          this.isCategorySelected = false;
          this.isCategoryLoaded.set(true);
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
          if (this.stateData?.filters?.size) {
            const sizeId = this.stateData?.filters?.size;
            this.catalogueSizes.update((sizes) => {
              const index = sizes.findIndex((e: any) => e?._id === sizeId);

              if (index !== -1) {
                sizes[index]['checked'] = true;
                this.selectedCatalogueSizes.set([sizes[index]]);
              }
              return sizes;
            });
          }
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

  onCategoryChange(index: any) {
    if (!this.isCategorySelected) {
      const currentTab = this.catalogueCatagories()?.[index];
      if (currentTab) {
        this.router.navigate([`catalogue/${currentTab?._id}`]);
        this.selectedCatalogueSizes.set([]);
        this.selectedCatalogueSeries.set([]);
        this.catalogueSizes.update((sizes) => {
          return sizes.map((e: any) => {
            e['checked'] = false;
            return e;
          });
        });
        this.catalogueSeries.update((series) => {
          return series.map((e: any) => {
            e['checked'] = false;
            return e;
          });
        });
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
      maxWidth: '95vw',
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
      height: '390px',
      width: '700px',
      maxWidth: '95vw',
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
      height: '400px',
      width: '700px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    this.seriesDialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.loadCatalogueSeries();
      }
    });
  }

  openCatalogueDialog(catalogue = null) {
    const catalogueData = JSON.parse(JSON.stringify(catalogue));
    if (catalogueData) {
      catalogueData['category_id'] = catalogueData['category_id']['_id'];
      catalogueData['size_id'] = catalogueData['size_id']['_id'];
      catalogueData['series_id'] = catalogueData['series_id']['_id'];
    }
    this.selectedCatalogue.set(catalogueData);
    this.catalogueForm.reset();
    this.catalogueForm.patchValue(catalogueData || {});

    this.catalogueDialogRef = this.dialog.open(this.CatalogueTemplate, {
      height: '520px',
      width: '700px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    this.catalogueDialogRef.afterClosed().subscribe((result) => {
      if (result == 'refresh') {
        this.loadCatalogues();
      }
    });
  }

  onSubmitCategory() {
    const categoryData = this.categoryForm.value;
    if (this.selectedCategory()) {
      categoryData['_id'] = this.selectedCategory()?._id;
    }

    let addUpdateCategoryMethod: 'createCategory' | 'updateCategory' =
      categoryData?._id ? 'updateCategory' : 'createCategory';

    this.commonService[addUpdateCategoryMethod](categoryData).subscribe({
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
          err?.msg ||
            err?.message ||
            'Something went wrong, please try again later'
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

    let addUpdateSizeMethod: 'createSize' | 'updateSize' = sizeData?._id
      ? 'updateSize'
      : 'createSize';

    this.commonService[addUpdateSizeMethod](sizeData).subscribe({
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
          err?.msg ||
            err?.message ||
            'Something went wrong, please try again later'
        );
        this.sizeDialogRef.close('refresh');
      },
    });
  }

  onSubmitSeries() {
    const seriesData = this.seriesForm.value;
    if (this.selectedSeries()) {
      seriesData['_id'] = this.selectedSeries()?._id;
    }

    let addUpdateSeriesMethod: 'createSeries' | 'updateSeries' = seriesData?._id
      ? 'updateSeries'
      : 'createSeries';

    this.commonService[addUpdateSeriesMethod](seriesData).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (seriesData?._id) {
            this._snackbar.success(`Series updated successfully`);
          } else {
            this._snackbar.success(`Series created successfully`);
          }
        } else {
          this._snackbar.error(response?.msg);
        }

        this.seriesDialogRef.close('refresh');
      },
      error: (err: any) => {
        this._snackbar.error(
          err?.msg ||
            err?.message ||
            'Something went wrong, please try again later'
        );
        this.seriesDialogRef.close('refresh');
      },
    });
  }

  onSubmitCatalogue() {
    const catalogueData = this.catalogueForm.getRawValue();

    if (this.selectedCatalogue()) {
      catalogueData['_id'] = this.selectedCatalogue()?._id;
    }

    let addUpdateCatalogueMethod: 'createCatalogue' | 'updateCatalogue' =
      catalogueData?._id ? 'updateCatalogue' : 'createCatalogue';

    this.commonService[addUpdateCatalogueMethod](catalogueData).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          if (catalogueData?._id) {
            this._snackbar.success(`Catalogue updated successfully`);
          } else {
            this._snackbar.success(`Catalogue created successfully`);
          }
        } else {
          this._snackbar.error(response?.msg);
        }

        this.catalogueDialogRef.close('refresh');
      },
      error: (err: any) => {
        this._snackbar.error(
          err?.msg ||
            err?.message ||
            err?.message ||
            'Something went wrong, please try again later'
        );
        this.catalogueDialogRef.close('refresh');
      },
    });
  }

  deleteCategory() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: '200px',
      width: '350px',
      maxWidth: '95vw',
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
                err?.msg ||
                  err?.message ||
                  'Something went wrong, please try again later'
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
      maxWidth: '95vw',
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
              err?.msg ||
                err?.message ||
                'Something went wrong, please try again later'
            );
            this.sizeDialogRef.close('refresh');
          },
        });
      }
    });
  }

  deleteSeries() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: '200px',
      width: '350px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.commonService.deleteSeries(this.selectedSeries()?._id).subscribe({
          next: (response: IResponse<any>) => {
            if (response?.success == 1) {
              this._snackbar.success(`Series deleted successfully`);
            } else {
              this._snackbar.error(response?.msg);
            }

            this.seriesDialogRef.close('refresh');
          },
          error: (err: any) => {
            this._snackbar.error(
              err?.msg ||
                err?.message ||
                'Something went wrong, please try again later'
            );
            this.seriesDialogRef.close('refresh');
          },
        });
      }
    });
  }

  deleteCatalogue() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: '200px',
      width: '350px',
      maxWidth: '95vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.commonService
          .deleteCatalogue(this.selectedCatalogue()?._id)
          .subscribe({
            next: (response: IResponse<any>) => {
              if (response?.success == 1) {
                this._snackbar.success(`Catalogue deleted successfully`);
              } else {
                this._snackbar.error(response?.msg);
              }

              this.catalogueDialogRef.close('refresh');
            },
            error: (err: any) => {
              this._snackbar.error(
                err?.msg ||
                  err?.message ||
                  'Something went wrong, please try again later'
              );
              this.catalogueDialogRef.close('refresh');
            },
          });
      }
    });
  }

  onCatalogueImageUpload(event: any) {
    const image = event?.target?.files[0];

    if (image) {
      this.commonService.uploadImage(image).subscribe({
        next: (response: IResponse<any>) => {
          if (response?.success == 1) {
            const { fileName, filePath } = response?.body;
            this.catalogueForm.get('image_name')?.setValue(fileName);
            this.catalogueForm.get('image_path')?.setValue(filePath);
          } else {
            this._snackbar.error(response?.msg);
          }
        },
        error: (err) => {
          this._snackbar.error(
            err?.msg ||
              err?.message ||
              'Something went wrong, please try again later'
          );
        },
      });
    }
  }

  onCatalogueDocumentUpload(event: any) {
    const document = event?.target?.files[0];

    if (document) {
      this.commonService.uploadDocument(document).subscribe({
        next: (response: IResponse<any>) => {
          if (response?.success == 1) {
            const { fileName, filePath } = response?.body;
            this.catalogueForm.get('catalogue_doc_name')?.setValue(fileName);
            this.catalogueForm.get('catalogue_doc_path')?.setValue(filePath);
          } else {
            this._snackbar.error(response?.msg);
          }
        },
        error: (err) => {
          this._snackbar.error(
            err?.msg ||
              err?.message ||
              'Something went wrong, please try again later'
          );
        },
      });
    }
  }
}

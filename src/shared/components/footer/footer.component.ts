import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { IResponse } from '../../interfaces/response-i';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  copyrightText: string = '@2024 All Rights Reserved. Bright Impex.';
  phone: string = '1800 309 309';
  email: string = 'connect@brightimpex.com';

  selectedCategory: string = '';

  catalogueCatagories: WritableSignal<any> = signal([]);
  catalogueCatagoryId: WritableSignal<string> = signal('');

  constructor(
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.catalogueCatagoryId.set(params?.get('id') || '');
    });

    this.loadCatalogueCatagories();
  }

  loadCatalogueCatagories() {
    this.commonService.getCatalogueCatagories().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this.catalogueCatagories.set(response?.body || []);
          const categoryIndex = this.catalogueCatagories()?.findIndex(
            (e: any) => e?._id == this.catalogueCatagoryId()
          );
          if (categoryIndex !== -1) {
            this.selectedCategory = this.catalogueCatagories()[categoryIndex];
          } else {
            this.selectedCategory = '';
          }
        } else {
          console.error(response?.msg);
        }
      },
      error: (err) => {},
    });
  }
}

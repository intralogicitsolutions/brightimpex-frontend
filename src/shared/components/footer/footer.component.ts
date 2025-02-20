import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { IResponse } from '../../interfaces/response-i';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  copyrightText: string = '@2024 All Rights Reserved. Bright Impex.';
  phone: string = environment?.phone;
  email: string = environment?.mail;

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

  moveToSocial(name: string) {
    if (name == 'fb') {
      window.open('https://www.facebook.com/', '_blank');
    } else if (name == 'in') {
      window.open('https://www.instagram.com/', '_blank');
    } else if (name == 'yt') {
      window.open('https://www.youtube.com/', '_blank');
    }
  }
}

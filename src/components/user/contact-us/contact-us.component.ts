import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { fadeAnimation } from '../../../shared/animations/route-animations';

import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IResponse } from '../../../shared/interfaces/response-i';
import { CommonService } from '../../../shared/services/common.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  animations: [fadeAnimation],
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  phone: string = environment.phone;
  mail: string = environment.mail;
  location: string = environment.location;

  countries: WritableSignal<any> = signal([]);
  cities: WritableSignal<any> = signal([]);

  filteredCountries!: Observable<any> | undefined;
  filteredCities!: Observable<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private _snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.loadCountries();
  }

  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue) {
      return this.countries().filter((country: any) =>
        country?.name?.toLowerCase().includes(filterValue)
      );
    } else {
      return this.countries();
    }
  }

  private _filterCity(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue) {
      return this.cities().filter((city: any) =>
        city?.name?.toLowerCase().includes(filterValue)
      );
    } else {
      return this.cities();
    }
  }

  loadCountries() {
    this.commonService.getCountries().subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this.countries.set(response?.body || []);

          this.filteredCountries = this.contactUsForm
            ?.get('country')
            ?.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterCountry(value || ''))
            );
        } else {
          console.error(response?.msg);
        }
      },
      error: (err) => {},
    });
  }

  loadCities(countryCode: string) {
    this.commonService.getCities(countryCode).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this.cities.set(response?.body || []);

          this.filteredCities = this.contactUsForm
            ?.get('city')
            ?.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterCity(value || ''))
            );
        } else {
          console.error(response?.msg);
        }
      },
      error: (err) => {},
    });
  }

  onCountryChange(event: MatAutocompleteSelectedEvent) {
    const selectedCountry = event?.option?.value;
    const countryCode = this.countries().find(
      (country: any) => country?.name == selectedCountry
    )?.code;

    this.loadCities(countryCode);
  }

  submitContactusDetails = () => {
    console.log(this.contactUsForm.value);
    this.commonService.contactus(this.contactUsForm.value).subscribe({
      next: (response: IResponse<any>) => {
        if (response?.success == 1) {
          this._snackbar.success('Contact query sent successfully.');
        } else {
          this._snackbar.error(response?.msg);
        }
      },
      error: (err) => {
        this._snackbar.error(
          err?.msg ||
            err?.message ||
            'Something went wrong, please try again later.'
        );
      },
    });
  };
}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  copyrightText: string = "@2024 All Rights Reserved. Bright Impex."
  phone: string = '1800 309 309';
  email: string = 'connect@brightimpex.com';
}

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  menus = [
    {
      name: 'Home',
      link: '/home',
    },
    {
      name: 'Products',
      link: '/catalogue',
    },
    {
      name: 'About Bright Impex',
      link: '/about-us',
    },
    {
      name: 'Contact Us',
      link: '/contact-us',
    },
  ];
}

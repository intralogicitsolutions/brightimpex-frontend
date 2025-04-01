import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  animations: [
    trigger('menuAnimation', [
      state('closed', style({ transform: 'translateY(-100%)', opacity: 0 })),
      state('open', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('200ms ease-in')]),
    ]),
  ],
})
export class NavBarComponent {
  isMenuOpen: boolean = false;
  isMobileView: WritableSignal<boolean> = signal(window.innerWidth < 1023);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  moveToSocial(name: string) {
    if (name == 'fb') {
      window.open('https://www.facebook.com/', '_blank');
    } else if (name == 'ig') {
      window.open('https://www.instagram.com/', '_blank');
    } else if (name == 'yt') {
      window.open('https://www.youtube.com/', '_blank');
    } else if (name == 'li') {
      window.open('https://in.linkedin.com/', '_blank');
    }
  }
}

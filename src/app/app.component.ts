import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { fadeAnimation } from '../shared/animations/route-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeAnimation],
})
export class AppComponent {
  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.altKey) {
      if (this.router.url.includes('/admin')) {
        this.router.navigate(['/home']);
        localStorage.removeItem('user_details');
        localStorage.removeItem('token');
      } else {
        this.router.navigate(['/admin/signin']);
      }
    }

    if (event.key == 'Escape') {
      if (this.router.url.includes('/admin/signin')) {
        this.router.navigate(['/home']);
        localStorage.removeItem('user_details');
        localStorage.removeItem('token');
      }
    }
  }
}

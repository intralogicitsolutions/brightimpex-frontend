import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { fadeAnimation } from '../shared/animations/route-animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../shared/services/loader.service';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeAnimation],
})
export class AppComponent {
  isLoaderVisible: WritableSignal<boolean> = signal(false);

  constructor(private router: Router, private loaderService: LoaderService, private commonService: CommonService) {
    this.isLoaderVisible = this.loaderService.isLoaderVisible;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.altKey) {
      if (this.router.url.includes('/admin')) {
        this.router.navigate(['/home']);
        localStorage.removeItem('user_details');
        localStorage.removeItem('token');
        this.commonService.updateAdmin();
      } else {
        this.router.navigate(['/admin/signin']);
      }
    }

    if (this.router.url.includes('/admin/signin')) {
      if (event.key == 'Escape') {
        this.router.navigate(['/home']);
        localStorage.removeItem('user_details');
        localStorage.removeItem('token');
        this.commonService.updateAdmin();
      }
    }
  }
}

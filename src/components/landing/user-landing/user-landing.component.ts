import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-landing',
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
})
export class UserLandingComponent implements OnInit{
constructor(private router: Router){

}

  ngOnInit(): void {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => this.scrollToTop());

  }

  scrollToTop() {
    const container = document.getElementById('scrollable-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

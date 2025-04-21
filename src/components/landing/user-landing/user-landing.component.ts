import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-landing',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, MatIconModule],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
})
export class UserLandingComponent implements OnInit {
  showWhatsappChat: boolean = false;
  exportContact = environment.exportContact;
  domesticContact = environment.domesticContact;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.scrollToTop());
  }

  scrollToTop() {
    const container = document.getElementById('scrollable-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openDialer(phone: any) {
    // window.location.href = `tel:${phone}`;

    const formattedPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${formattedPhone}`;
    window.open(whatsappUrl, '_blank');
  }

  openGmailCompose(){
    const to = environment.mail
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}`
    window.open(gmailUrl, '_blank');
  }

  openInstagramProfile(){
    const userName = environment.instaUser;
    const url = `https://www.instagram.com/${userName}/`;
    window.open(url, '_blank');
  }
}

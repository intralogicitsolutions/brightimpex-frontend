import { Component } from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-us',
  imports: [MatButtonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  animations: [fadeAnimation],
})
export class AboutUsComponent {
  tileBgImg: string = '/assets/images/tile.jpg';
}

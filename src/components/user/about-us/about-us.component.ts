import { Component } from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  animations: [fadeAnimation],
})
export class AboutUsComponent {}

import { Component } from '@angular/core';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeAnimation],
})
export class HomeComponent {
  title = 'Bright Impex';
}

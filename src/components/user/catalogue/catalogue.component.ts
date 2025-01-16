import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { fadeAnimation } from '../../../shared/animations/route-animations';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  imports: [MatIconModule, MatCheckboxModule, RouterLink, RouterLinkActive],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  animations: [fadeAnimation],
})
export class CatalogueComponent {}

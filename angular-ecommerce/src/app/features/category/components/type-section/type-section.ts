import { Component,Input } from '@angular/core';
import { Type } from '../../../../shared/models/type.model';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-type-section',
  imports: [TitleCasePipe, CommonModule, RouterLink],
  templateUrl: './type-section.html',
  styleUrl: './type-section.css',
})
export class TypeSection {
   @Input() types: Type[] = [];
   @Input () category = '';
   @Input() categorySlug = 'laptop';
}

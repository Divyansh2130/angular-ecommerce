import { Component,Input } from '@angular/core';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-panel',
  imports: [],
  templateUrl: './category-panel.html',
  styleUrl: './category-panel.css',
})
export class CategoryPanel {
  @Input() categories:Category[]=[];
}

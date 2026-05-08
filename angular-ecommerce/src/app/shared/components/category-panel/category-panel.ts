import { Component,Input } from '@angular/core';
import { Category } from '../../models/category.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-panel',
  imports: [RouterLink],
  templateUrl: './category-panel.html',
  styleUrl: './category-panel.css',
})
export class CategoryPanel {
  @Input() categories:Category[]=[];
}

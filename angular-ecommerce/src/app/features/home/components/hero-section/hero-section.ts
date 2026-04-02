import { Component, inject } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { CategoryService } from '../../../../core/services/category.service';

interface Category {
  name: string;
  image?: string;
}

@Component({
  selector: 'app-hero-section',
  imports: [Navbar],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  private categoryServices= inject(CategoryService);
  categories: Category[] =this.categoryServices.getCategories();
}

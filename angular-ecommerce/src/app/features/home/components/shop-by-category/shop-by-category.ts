import { Component } from '@angular/core';
import { Category } from '../../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-shop-by-category',
  imports: [CommonModule, SectionHeader],
  templateUrl: './shop-by-category.html',
  styleUrl: './shop-by-category.css',
})
export class ShopByCategory {
  categories: Category[] = [
    {
      id: 1,
      name: 'Camera',
      slug: 'camera',
      image: 'assets/images/home/category/camera.png',
    },
    {
      id: 2,
      name: 'Smart watch',
      slug: 'smart-watch',
      image: 'assets/images/home/category/smartwatch.png',
    },
    {
      id: 3,
      name: 'Smart phone',
      slug: 'smart-phone',
      image: 'assets/images/home/category/smartphone.png',
    },
    {
      id: 4,
      name: 'Headphones',
      slug: 'headphones',
      image: 'assets/images/home/category/headphone.png',
    },
    {
      id: 5,
      name: 'Laptop',
      slug: 'laptop',
      image: 'assets/images/home/category/laptop.png',
    },
    {
      id: 6,
      name: 'Speaker',
      slug: 'speaker',
      image: 'assets/images/home/category/speaker.png',
    },
  ];
}

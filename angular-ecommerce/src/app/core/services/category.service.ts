import { Injectable } from '@angular/core';
import { Category } from '../../shared/models/category.model';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
   private categories: Category[] = [
    { id: 1, name: 'Computers', slug: 'computers', image: '/assets/images/home/category_strip/computers.png' },
    { id: 2, name: 'Smart phone', slug: 'smart-phone', image: '/assets/images/home/category_strip/mobiles.png' },
    { id: 3, name: 'TV', slug: 'tv',image: '/assets/images/home/category_strip/desktop.png' },
    { id: 4, name: 'Kitchen', slug: 'kitchen' , image: '/assets/images/home/category_strip/fridge.png'},
    { id: 5, name: 'Gaming', slug: 'gaming' , image: '/assets/images/home/category_strip/gaming.png'},
    { id: 6, name: 'Smart watch', slug: 'smart-watch' , image: '/assets/images/home/category_strip/watch.png'},
    { id: 7, name: 'Headphones', slug: 'headphones', image: '/assets/images/home/category_strip/headphone.png' },
    { id: 8, name: 'Household', slug: 'household' , image: '/assets/images/home/category_strip/household.png'},
    { id: 9, name: 'Accessories', slug: 'accessories', image: '/assets/images/home/category_strip/mouse.png' },
    { id: 10, name: 'Camera', slug: 'camera' , image: '/assets/images/home/category_strip/camera.png'},
    { id: 11, name: 'Deals', slug: 'deal' , image: '/assets/images/home/category_strip/deals.png'}
  ];

  getCategories(): Category[] {
    return this.categories;
  }

}

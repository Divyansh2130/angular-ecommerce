import { Component, Input } from '@angular/core';
import { Type } from '../../shared/models/type.model';
import { CommonModule } from '@angular/common';
import { TypeSection } from './components/type-section/type-section';
import { ActivatedRoute } from '@angular/router';
import { LaptopBrands } from "./components/laptop-brands/laptop-brands";
import { FeatureStrip, FeatureStripItem } from '../../shared/components/feature-strip/feature-strip';
import { OurBestLaptopDeals } from './components/our-best-laptop-deals/our-best-laptop-deals';
import { TrendingNow } from './components/trending-now/trending-now';
import { FaqSection } from "./components/faq-section/faq-section";
import { CategoryBlog } from './components/category-blog/category-blog';
@Component({
  selector: 'app-category',
  imports: [CommonModule, TypeSection, LaptopBrands, FeatureStrip, OurBestLaptopDeals, TrendingNow, FaqSection, CategoryBlog],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
   types: Type[] = [];
   category = '';
   features: FeatureStripItem[] = [
    {
      icon: '/assets/images/home/features/truck.png',
      title: 'Free shipping',
      description: 'On orders over €50'
    },
    {
      icon: '/assets/images/home/features/refresh.png',
      title: 'Easy returns',
      description: 'Free within 30 days'
    },
    {
      icon: '/assets/images/home/features/gift.png',
      title: 'Special gifts',
      description: 'Free with select orders.'
    },
    {
      icon: '/assets/images/home/features/support.png',
      title: 'Support 24/7',
      description: 'Help when you need it'
    },
    {
      icon: '/assets/images/home/features/secure_wallet.png',
      title: 'Secured payment',
      description: '100% safe'
    }
   ];

constructor(private route: ActivatedRoute) {}

ngOnInit() {
  
  const category = this.route.snapshot.paramMap.get('name');
  this.category = category || '';
  //Temporary for now will replace with API call later
  if (category === 'laptops') {
    this.types = [
      { id: '1', name: 'Windows Laptops', image: 'assets/images/category_page/type-section/windows.png' },
      { id: '2', name: 'Apple MacBooks', image: 'assets/images/category_page/type-section/macbook.png' },
      { id: '3', name: 'Gaming Laptop', image: 'assets/images/category_page/type-section/gaming.png' },
      { id: '4', name: 'Chromebooks', image: 'assets/images/category_page/type-section/chromebook.png' },
      { id: '5', name: 'Laptop deals', image: 'assets/images/category_page/type-section/deals.png' },
      { id: '6', name: 'All laptops', image: 'assets/images/category_page/type-section/all.png' }
    ];
  }
}

}

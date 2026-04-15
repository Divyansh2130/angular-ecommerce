import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-our-best-laptop-deals',
  standalone: true,
  imports: [CommonModule, Carousel, ProductCard, SectionHeader],
  templateUrl: './our-best-laptop-deals.html',
  styleUrl: './our-best-laptop-deals.css',
})
export class OurBestLaptopDeals {

  // Temporary hardcoded products for demonstration purposes. Replace with API call in the future.
  products: Product[] = [
    {
      title: 'HP EliteBook 665 G11',
      image: '/assets/images/home/elitebook.png',
      price: 840,
      originalPrice: 1200,
      discount: '30%',
      rating: 4.5,
      reviews: 42,
      tag: 'Deal'
    },
    {
      title: 'Apple MacBook Pro 14-inch',
      image: '/assets/images/home/promo/macbookPro.jpg',
      price: 1799,
      originalPrice: 2099,
      discount: '14%',
      rating: 4.8,
      reviews: 312,
      tag: 'Top Pick'
    },
    {
      title: 'Gaming Laptop RTX Series',
      image: '/assets/images/category_page/type-section/gaming.png',
      price: 1299,
      originalPrice: 1499,
      discount: '13%',
      rating: 4.4,
      reviews: 188
    },
    {
      title: 'Everyday Chromebook',
      image: '/assets/images/category_page/type-section/chromebook.png',
      price: 399,
      originalPrice: 499,
      discount: '20%',
      rating: 4.2,
      reviews: 96
    }
  ];
}

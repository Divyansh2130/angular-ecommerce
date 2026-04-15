import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-trending-now',
  standalone: true,
  imports: [CommonModule, Carousel, ProductCard, SectionHeader],
  templateUrl: './trending-now.html',
  styleUrl: './trending-now.css',
})
export class TrendingNow {

  //Temporary data for now, will replace with API call later
  products: Product[] = [
    {
      title: 'Meta Quest 3S 256GB',
      image: '/assets/images/home/metaQuest.png',
      price: 479,
      originalPrice: 599,
      discount: '20%',
      rating: 4.8,
      reviews: 120,
      tag: 'Trending'
    },
    {
      title: 'Apple iPhone 16 Pro Max',
      image: '/assets/images/home/iphone.png',
      price: 1399,
      originalPrice: 1749,
      discount: '20%',
      rating: 4.6,
      reviews: 636,
      tag: 'Hot'
    },
    {
      title: 'Apple AirPods (3rd generation)',
      image: '/assets/images/home/airpods.png',
      price: 197,
      originalPrice: 219,
      discount: '10%',
      rating: 4.33,
      reviews: 235
    },
    {
      title: 'Sony WH-1000XM5 Black',
      image: '/assets/images/home/best_seller/heaphones.png',
      price: 399,
      originalPrice: 499,
      discount: '20%',
      rating: 4.5,
      reviews: 411
    }
  ];
}

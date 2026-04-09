import { Component } from '@angular/core';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
@Component({
  selector: 'app-best-sellers',
  imports: [Carousel,ProductCard,CommonModule, SectionHeader],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.css',
})
export class BestSellers {
  products: Product[] = [
  {
    title: "Phillips Airfryer XL",
    description: "High performance air fryer for healthier cooking.",
    price: 98,
    originalPrice: 140,
    rating: 4.89,
    image: "assets/images/home/best_seller/airfryer.png",
    category: "Kitchen",
    discount: "30%",
    tag: "Best Seller",
    reviews: 426
  },
  {
    title: "Xiaomi Redmi Watch 4 Reim Milanese",
    description: "Smart watch with sleek design and advanced tracking.",
    price: 99,
    originalPrice: 99,
    rating: 4.23,
    image: "assets/images/home/best_seller/smartwatch.png",
    category: "Wearables",
    tag: "Best Seller",
    reviews: 749
  },
  {
    title: "Apple iPhone 15 128GB",
    description: "Latest Apple smartphone with powerful performance.",
    price: 999,
    originalPrice: 999,
    rating: 4.53,
    image: "assets/images/home/best_seller/iPhone.png",
    category: "Mobile",
    tag: "Best Seller",
    reviews: 721
  },
  {
    title: "Sony WH 100xm5 Black",
    description: "Premium noise-cancelling wireless headphones.",
    price: 399,
    originalPrice: 399,
    rating: 3.98,
    image: "assets/images/home/best_seller/heaphones.png",
    category: "Audio",
    tag: "Best Seller",
    reviews: 503
  }
];

}

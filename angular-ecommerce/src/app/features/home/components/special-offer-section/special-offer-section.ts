import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Carousel } from '../../../../shared/components/carousel/carousel';
@Component({
  selector: 'app-special-offer-section',
  standalone: true,
  imports: [ProductCard,CommonModule,Carousel],
  templateUrl: './special-offer-section.html',
  styleUrl: './special-offer-section.css'
})
export class SpecialOfferSectionComponent {
     products: Product[] = [
    {
      title: 'Iphone 16 Pro Max 256GB (Natural Titanium)',
      image: '/assets/images/home/iphone.png',
      price: 1399,
      originalPrice: 1749,
      discount: '20%',
      rating: 4.6,
      reviews: 636
    },
    {
      title: 'HP EliteBook 665 G11',
      image: '/assets/images/home/elitebook.png',
      price: 840,
      originalPrice: 1200,
      discount: '30%',
      rating: 4.5,
      reviews: 42,
      tag: 'Today Only!'
    },
    {
      title: 'Apple Airpods (3rd generation)',
      image: '/assets/images/home/airpods.png',
      price: 197,
      originalPrice: 219,
      discount: '10%',
      rating: 4.33,
      reviews: 235
    },
    {
      title: 'Meta Quest 3S 256GB',
      image: '/assets/images/home/metaQuest.png',
      price: 479,
      originalPrice: 599,
      discount: '20%',
      rating: 4.8,
      reviews: 120
    }
  ];
    features = [
  {
    icon: "/assets/images/home/features/truck.png",
    title: "Free shipping",
    description: "On orders over €50"
  },
  {
    icon: "/assets/images/home/features/refresh.png",
    title: "Easy returns",
    description: "Free within 30 days"
  },
  {
    icon: "/assets/images/home/features/gift.png",
    title: "Special gifts",
    description: "Free with select orders."
  },
  {
    icon: "/assets/images/home/features/support.png",
    title: "Support 24/7",
    description: "Help when you need it"
  },
  {
    icon: "/assets/images/home/features/secure_wallet.png",
    title: "Secured payment",
    description: "100% safe"
  }
];
}
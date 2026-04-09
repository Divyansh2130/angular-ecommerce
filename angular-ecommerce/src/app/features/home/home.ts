import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { HeroSection } from './components/hero-section/hero-section';
import { SpecialOfferSectionComponent } from './components/special-offer-section/special-offer-section';
import { ShopByCategory } from './components/shop-by-category/shop-by-category';
import { PromoLayout } from './components/promo-layout/promo-layout';
import { BestSellers } from "./components/best-sellers/best-sellers";
import { TopBrands } from './components/top-brands/top-brands';
import { Blog } from './components/blog/blog';
@Component({
  selector: 'app-home',
  imports: [CommonModule, Blog, TopBrands, HeroSection, SpecialOfferSectionComponent, ShopByCategory, PromoLayout, BestSellers],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private productService=inject(ProductService);
  products:Product[]=[];
  ngOnInit(){
    this.productService.getProduct().subscribe(data=>{
      this.products=data;
      console.log(this.products);
    })
  }
}

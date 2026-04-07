import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { HeroSection } from './components/hero-section/hero-section';
import { SpecialOfferSectionComponent } from './components/special-offer-section/special-offer-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule,HeroSection, SpecialOfferSectionComponent],
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

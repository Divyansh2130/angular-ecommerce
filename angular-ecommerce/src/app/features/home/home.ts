import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { HeroSection } from './components/hero-section/hero-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule,HeroSection],
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

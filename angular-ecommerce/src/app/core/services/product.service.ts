import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http=inject(HttpClient);
  private apiUrl= `assets/data/products.json`;

  getProduct():Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl);
  }
}

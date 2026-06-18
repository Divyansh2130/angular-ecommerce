import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export interface InventoryOption {
  _id: string;
  name: string;
  category?: string;
}

export interface InventoryProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  inStock: boolean;
  isBestDeal: boolean;
  isTrending: boolean;
  thumbnail?: string;
  category?: { _id: string; name: string };
  type?: { _id: string; name: string };
  brand?: { _id: string; name: string };
}

export interface InventoryListResponse {
  success: boolean;
  products: InventoryProduct[];
}

export interface InventoryOptionsResponse {
  success: boolean;
  categories: InventoryOption[];
  types: InventoryOption[];
  brands: InventoryOption[];
}

export interface InventoryPayload {
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  typeId?: string;
  brandId?: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  inStock: boolean;
  isBestDeal: boolean;
  isTrending: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminInventoryService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly apiUrl = 'http://localhost:5000/api/admin/inventory';

  getOptions(): Observable<InventoryOptionsResponse> {
    return this.http.get<InventoryOptionsResponse>(`${this.apiUrl}/options`, {
      headers: this.authHeaders(),
    });
  }

  getInventory(): Observable<InventoryListResponse> {
    return this.http.get<InventoryListResponse>(this.apiUrl, {
      headers: this.authHeaders(),
    });
  }

  createProduct(payload: InventoryPayload): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.apiUrl, payload, {
      headers: this.authHeaders(),
    });
  }

  updateProduct(id: string, payload: InventoryPayload): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/${id}`, payload, {
      headers: this.authHeaders(),
    });
  }

  deleteProduct(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.authState.authToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}

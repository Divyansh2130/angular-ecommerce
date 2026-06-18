import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../../shared/models/category.model';

interface BackendCategory {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  image?: string;
}

interface BackendCategoryResponse {
  success: boolean;
  categories: BackendCategory[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  private readonly apiUrl = 'http://localhost:5000/api/categories';

  readonly categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.http.get<Category[]>('assets/data/categories.json').subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
        this.hydrateFromBackend(categories);
      },
      error: () => this.categoriesSubject.next([]),
    });
  }

  private hydrateFromBackend(baseCategories: Category[]) {
    this.http.get<BackendCategoryResponse>(`${this.apiUrl}?limit=100`).subscribe({
      next: (response) => {
        const backendCategories = (response.categories || []).map((category, index) => ({
          id: baseCategories[index]?.id ?? index + 1,
          backendId: category.id || category._id,
          name: category.name,
          slug: category.slug,
          image: category.image,
        }));

        this.categoriesSubject.next(backendCategories.length > 0 ? backendCategories : baseCategories);
      },
      error: () => this.categoriesSubject.next(baseCategories),
    });
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }
}

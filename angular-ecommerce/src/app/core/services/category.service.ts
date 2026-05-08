import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);

  readonly categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.http.get<Category[]>('assets/data/categories.json').subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
      error: () => this.categoriesSubject.next([]),
    });
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }
}

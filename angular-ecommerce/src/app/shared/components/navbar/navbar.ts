import { Component,signal,inject,ElementRef, ViewChild, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { CategoryPanel } from '../category-panel/category-panel';
import { SearchPanel } from '../search-panel/search-panel';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { RouterLink, Router, NavigationStart } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CategoryPanel, SearchPanel, CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  @Input() variant: 'home' | 'page' = 'home';

  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private routerSub?: Subscription;
  private categoriesSub?: Subscription;

  categories = signal<Category[]>([]);
  cartItemCount = this.cartService.itemCount;
  wishlistItemCount = this.wishlistService.itemCount;

  @ViewChild('navbarRoot') navbarRef!: ElementRef;

  ngOnInit() {
    this.categoriesSub = this.categoryService.categories$.subscribe((categories) => {
      this.categories.set(categories);
    });

    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        this.isCategoryOpen.set(false);
        this.isSearchOpen.set(false);
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
  }

  isCategoryOpen = signal(false);
  isSearchOpen = signal(false);

  toggleCategory() {
    this.isCategoryOpen.update((v) => !v);
    this.isSearchOpen.set(false);
  }

  openSearch() {
    this.isSearchOpen.update((v) => !v);
    this.isCategoryOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.navbarRef) return;

    const clickedInside = this.navbarRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isCategoryOpen.set(false);
      this.isSearchOpen.set(false);
    }
  }
}

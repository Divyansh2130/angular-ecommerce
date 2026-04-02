import { Component,signal,inject,ElementRef, ViewChild, HostListener } from '@angular/core';
import { CategoryPanel } from '../category-panel/category-panel';
import { SearchPanel } from '../search-panel/search-panel';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-navbar',
  imports: [CategoryPanel,SearchPanel,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private categoryService=inject(CategoryService);
  categories=signal<Category[]>([]);

  @ViewChild('navbarRoot') navbarRef!: ElementRef;

  constructor(){
    this.categories.set(this.categoryService.getCategories());
  }
  //Use of signal for state management
  isCategoryOpen=signal(false);
  isSearchOpen=signal(false);

  //toggle category button to open category and close search panel and vice versa
  toggleCategory(){
    this.isCategoryOpen.update(v => !v);
    this.isSearchOpen.set(false);
  }
  openSearch(){
    this.isSearchOpen.update(v=>!v);
    this.isCategoryOpen.set(false);
  }

  //Handling outside click
  @HostListener('document:click',['$event'])
  handleClickOutside(event:MouseEvent){
    if(!this.navbarRef)return;

    const clickedInside =this.navbarRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isCategoryOpen.set(false);
      this.isSearchOpen.set(false);
    }
  }
}

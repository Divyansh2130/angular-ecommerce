import { Component, inject } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../shared/components/footer/footer";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, Footer, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private router = inject(Router);
  isHomePage = true;

  constructor() {
    this.isHomePage = this.router.url === '/';
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.isHomePage = e.urlAfterRedirects === '/';
    });
  }
}

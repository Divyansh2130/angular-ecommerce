import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { RouterLink } from '@angular/router';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-laptop-brands',
  imports: [CommonModule, SectionHeader, RouterLink],
  templateUrl: './laptop-brands.html',
  styleUrl: './laptop-brands.css',
})
export class LaptopBrands implements OnInit, OnDestroy {
  @Input() categorySlug = 'laptop';

  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  features: { name: string; icon: string }[] = [];

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.features = (content.laptopBrands || [])
        .filter((item): item is { name: string; icon: string } => Boolean(item.name && item.icon));
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }
}

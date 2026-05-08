import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { FAQ } from '../../../../shared/models/faq.model';
import { CommonModule } from '@angular/common';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faq-section',
  imports: [CommonModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
})
export class FaqSection implements OnInit, OnChanges, OnDestroy {
  @Input() category = 'Laptop';
  faqs: FAQ[] = [];

  private contentService = inject(MockContentService);
  private contentSub?: Subscription;
  private faqsMap: Record<string, FAQ[]> = {};

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.faqsMap = content.categoryFaqsMap || {};
      this.loadFaqsForCategory();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.loadFaqsForCategory();
    }
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }

  private loadFaqsForCategory() {
    const categoryKey = this.category.charAt(0).toUpperCase() + this.category.slice(1);
    this.faqs = this.faqsMap[categoryKey] || this.faqsMap['Laptop'] || [];
  }

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}

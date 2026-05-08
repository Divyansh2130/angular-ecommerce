import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-brands',
  imports: [SectionHeader],
  templateUrl: './top-brands.html',
  styleUrl: './top-brands.css',
})
export class TopBrands implements OnInit, OnDestroy {
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  features: { icon: string }[] = [];

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.features = (content.topBrands || []).map((item) => ({ icon: item.icon }));
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }
}

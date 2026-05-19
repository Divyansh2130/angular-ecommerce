import { Component, inject } from '@angular/core';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-brands',
  imports: [SectionHeader],
  templateUrl: './top-brands.html',
  styleUrl: './top-brands.css',
})
export class TopBrands {
  private contentService = inject(MockContentService);
  private readonly content = toSignal(this.contentService.content$, { initialValue: this.contentService.content });

  get features(): { icon: string }[] {
    return (this.content().topBrands || []).map((item) => ({ icon: item.icon }));
  }
}

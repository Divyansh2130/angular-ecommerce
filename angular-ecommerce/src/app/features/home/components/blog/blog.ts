import { Component, inject } from '@angular/core';
import { BlogInterface } from '../../../../shared/models/blog.model';
import { BlogSection } from '../../../../shared/components/blog-section/blog-section';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-blog',
  imports: [BlogSection],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  private contentService = inject(MockContentService);
  private readonly content = toSignal(this.contentService.content$, { initialValue: this.contentService.content });

  get blogs(): BlogInterface[] {
    return this.content().homeBlogs || [];
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BlogInterface } from '../../../../shared/models/blog.model';
import { BlogSection } from '../../../../shared/components/blog-section/blog-section';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  imports: [BlogSection],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit, OnDestroy {
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  blogs: BlogInterface[] = [];

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.blogs = content.homeBlogs || [];
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }
}

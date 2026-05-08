import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { BlogInterface } from '../../../../shared/models/blog.model';
import { BlogSection } from '../../../../shared/components/blog-section/blog-section';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-blog',
  standalone: true,
  imports: [BlogSection],
  templateUrl: './category-blog.html',
  styleUrl: './category-blog.css',
})
export class CategoryBlog implements OnInit, OnChanges, OnDestroy {
  @Input() category = 'Laptop';
  blogs: BlogInterface[] = [];

  private contentService = inject(MockContentService);
  private contentSub?: Subscription;
  private blogsMap: Record<string, BlogInterface[]> = {};

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.blogsMap = content.categoryBlogsMap || {};
      this.loadBlogsForCategory();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.loadBlogsForCategory();
    }
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }

  private loadBlogsForCategory() {
    const categoryKey = this.category.charAt(0).toUpperCase() + this.category.slice(1);
    this.blogs = this.blogsMap[categoryKey] || this.blogsMap['Laptop'] || [];
  }

  get sectionTitle(): string {
    return `${this.category} tips and guides blog`;
  }
}

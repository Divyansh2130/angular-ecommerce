import { Component, Input } from '@angular/core';
import { SectionHeader } from '../section-header/section-header';
import { BlogInterface } from '../../models/blog.model';

@Component({
  selector: 'app-blog-section',
  standalone: true,
  imports: [SectionHeader],
  templateUrl: './blog-section.html',
  styleUrl: './blog-section.css',
})
export class BlogSection {
  @Input() title = '';
  @Input() blogs: BlogInterface[] = [];
  @Input() wrapperClass = 'px-6 py-6';
}

import { Component } from '@angular/core';
import { BlogInterface } from '../../../../shared/models/blog.model';
import { BlogSection } from '../../../../shared/components/blog-section/blog-section';

@Component({
  selector: 'app-category-blog',
  standalone: true,
  imports: [BlogSection],
  templateUrl: './category-blog.html',
  styleUrl: './category-blog.css',
})
export class CategoryBlog {
  blogs: BlogInterface[] = [
    {
      title: 'Pick the best laptop for your workflow',
      highlight: 'laptop',
      description: '',
      image: 'assets/images/home/blogs/travel.jpg',
      footerTitle: 'From student use to pro workloads',
      footerDesc: 'Understand specs, battery life, and portability so you can choose a laptop that fits your daily needs.'
    },
    {
      title: 'Gaming or creator laptop: what to buy?',
      highlight: 'gaming',
      description: '',
      image: 'assets/images/home/blogs/smart-home.jpg',
      footerTitle: 'Compare GPU power, thermals, and display quality',
      footerDesc: 'A quick buying guide to choose the right machine based on performance, cooling, and screen requirements.'
    },
    {
      title: 'Laptop maintenance made easy',
      highlight: 'maintenance',
      description: '',
      image: 'assets/images/home/blogs/mobile.jpg',
      footerTitle: 'Simple habits for longer laptop life',
      footerDesc: 'Keep your laptop fast and reliable with practical tips for cleaning, charging, storage, and software updates.'
    }
  ];
}

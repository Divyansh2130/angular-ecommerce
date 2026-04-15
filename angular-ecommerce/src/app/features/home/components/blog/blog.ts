import { Component } from '@angular/core';
import { BlogInterface } from '../../../../shared/models/blog.model';
import { BlogSection } from '../../../../shared/components/blog-section/blog-section';
@Component({
  selector: 'app-blog',
  imports: [BlogSection],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {

  //Hardcoded blogs data for demonstration purposes, wiil replace with fetch api
  blogs: BlogInterface[] = [
  {
    title: "Travel light, travel smart!",
    highlight: "light",
    description: "",
    image: "assets/images/home/blogs/travel.jpg",
    footerTitle: "Explore lightweight tech for effortless travel",
    footerDesc: "From portable power to compact gadgets, discover the best tech to make your travels smoother and more convenient."
  },
  {
    title: "Turn your space into a smart home",
    highlight: "smart home",
    description: "",
    image: "assets/images/home/blogs/smart-home.jpg",
    footerTitle: "Smart tech for lighting, security, & climate",
    footerDesc: "Easily control lighting, security, and climate with smart devices that simplify your home’s atmosphere."
  },
  {
    title: "Step-by-step guides",
    image: "assets/images/home/blogs/mobile.jpg",
    description: "",
    footerTitle: "Affordable used mobile phones",
    footerDesc: "Get quality used mobile phones at unbeatable prices, with top brands and reliable performance."
  }
];
}

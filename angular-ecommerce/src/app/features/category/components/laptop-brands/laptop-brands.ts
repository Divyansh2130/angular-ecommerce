import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
@Component({
  selector: 'app-laptop-brands',
  imports: [CommonModule, SectionHeader],
  templateUrl: './laptop-brands.html',
  styleUrl: './laptop-brands.css',
})
export class LaptopBrands {
   features = [
  {
    icon: "/assets/images/home/top-brands/samsung.png",
  },
  {
    icon: "/assets/images/home/top-brands/lg.png",
  },
  {
    icon: "/assets/images/home/top-brands/microsoft.png",
  },
  {
    icon: "/assets/images/home/top-brands/sony.png",
  },
  {
    icon: "/assets/images/home/top-brands/apple.png",
  }
];
}

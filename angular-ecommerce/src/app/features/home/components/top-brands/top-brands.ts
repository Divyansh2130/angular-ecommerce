import { Component } from '@angular/core';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
@Component({
  selector: 'app-top-brands',
  imports: [SectionHeader],
  templateUrl: './top-brands.html',
  styleUrl: './top-brands.css',
})
export class TopBrands {
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

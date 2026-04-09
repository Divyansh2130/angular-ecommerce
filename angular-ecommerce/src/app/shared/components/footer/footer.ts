import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Facebook, Instagram, Twitter } from 'lucide-angular';
import { FacebookIcon } from "../../icons/facebook-icon/facebook-icon";

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule, FacebookIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [],
  templateUrl: './section-header.html',
  styleUrl: './section-header.css',
})
export class SectionHeader {
  @Input() title = '';
  @Input() actionLabel = 'View all';
  @Input() showDefaultIcon = true;
}

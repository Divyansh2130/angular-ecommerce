import { Component, Input } from '@angular/core';

export interface FeatureStripItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-feature-strip',
  standalone: true,
  imports: [],
  templateUrl: './feature-strip.html',
  styleUrl: './feature-strip.css',
})
export class FeatureStrip {
  @Input() items: FeatureStripItem[] = [];
}

import { Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ContentChild,
  TemplateRef,
  AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel implements AfterViewInit {
  
  @Input() items: any[] = [];
  @Input() cardWidth: string = '80%';
  @Input() showDots: boolean = true;

  @Output() indexChange = new EventEmitter<number>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  activeIndex = 0;

  ngAfterViewInit() {}

  onScroll() {
    const container = this.scrollContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;

    this.activeIndex = Math.round(scrollLeft / width);
    this.indexChange.emit(this.activeIndex);
  }

  scrollTo(index: number) {
    const container = this.scrollContainer.nativeElement;
    const width = container.offsetWidth;

    container.scrollTo({
      left: width * index,
      behavior: 'smooth'
    });
  }
}


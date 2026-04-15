import { Component, Input } from '@angular/core';
import { FAQ } from '../../../../shared/models/faq.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-faq-section',
  imports: [CommonModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
})
export class FaqSection {
   @Input() category = '';
   faqs: FAQ[] = [
    {
      question: 'Which operating system do I need?',
      answer: 'Windows is ideal for general use and gaming. macOS is preferred for design and development. Linux is best for technical users.',
      isOpen: true
    },
    {
      question: 'Which laptop suits my studies?',
      answer: 'For students, lightweight laptops with good battery life are recommended.',
    },
    {
      question: 'How do I choose a MacBook?',
      answer: 'Choose based on performance needs: Air for light use, Pro for heavy tasks.',
    },
    {
      question: 'What size laptop do I need?',
      answer: '13-14 inch for portability, 15-16 inch for performance and screen size.',
    },
    {
      question: 'Which processor do I need?',
      answer: 'i5/Ryzen 5 for normal use, i7/Ryzen 7 for heavy tasks.',
    }
  ];

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}

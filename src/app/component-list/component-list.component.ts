import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css'],
})
export class ComponentListComponent implements OnInit, OnDestroy {
  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfPage = Math.round(scrollTop) + innerHeight === offsetHeight;
    if (bottomOfPage) {
      this.clipsList.getClips();
    }
  };
  constructor(public clipsList: ClipService) {
    this.clipsList.getClips();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

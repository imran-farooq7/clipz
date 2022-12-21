import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoSort = '1';
  constructor(private router: Router, private route: ActivatedRoute) {}
  sort = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;

    this.router.navigateByUrl(`/manage?sort=${value}`);
  };
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.videoSort = params.sort;
    });
  }
}

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoSort = '1';
  clips: any = [];
  activeClip: any = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {}
  sort = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;

    this.router.navigateByUrl(`/manage?sort=${value}`);
  };
  openModal = (e: Event, clip: any) => {
    e.preventDefault();
    this.activeClip = clip;
    this.modal.toggleVisible('editClip');
    console.log('clicked');
  };
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.videoSort = params.sort;
    });
    this.clipService.getUsersClips().subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({ docID: doc.id, ...doc.data() });
      });
    });
  }
}

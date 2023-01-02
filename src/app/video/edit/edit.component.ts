import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  showAlert: boolean = false;
  alertColor = 'blue';
  alertMessage = 'Please wait updating the clip';
  @Input()
  activeClip: any = null;
  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });
  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }
  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }
  submitHandler = async () => {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait updating the clip';
    console.log(this.clipID.value);

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong please try again later';
      console.error(error);
      return;
    }

    this.alertColor = 'green';
    this.alertMessage = 'Clip successfully updated';
  };
}

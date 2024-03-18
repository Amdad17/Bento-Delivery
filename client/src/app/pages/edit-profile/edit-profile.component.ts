import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryServiceService } from '../../services/cloudinary/cloudinary-service.service';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { RiderInfo } from '../../interfaces/IRider.interface';
import { RiderServiceService } from '../../services/rider/rider-service.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  @Output() notifyParent = new EventEmitter();
  @Output() openSignIn = new EventEmitter();
  @Input() riderInfo!: RiderInfo;

  // eslint-disable-next-line no-unused-vars
  constructor(
    private cloudinaryServices: CloudinaryServiceService,
    private riderService: RiderServiceService,
  ) {}

  ngOnInit(): void {
    this.ForEdit();
  }

  ForEdit() {
    if (this.riderInfo?.rider) {
      this.signUpForm.patchValue({
        name: this.riderInfo.rider.name,
        phoneNumber: this.riderInfo.rider.phoneNumber,
        email: this.riderInfo.rider.email,
        vehicleType: this.riderInfo.rider.vehicleType,
        password: this.riderInfo.rider.password,
        riderImage: this.riderInfo.rider.riderImage,
      });
      this.selectedRide = this.riderInfo.rider.vehicleType;
    }
  }

  updateRiderProfile() {
    if (this.riderInfo.rider._id) {
      const riderId = this.riderInfo.rider._id;
      this.riderService
        .updateRiderInfo(riderId, this.signUpForm.value)
        .subscribe(
          (response) => {
            this.notifyParent.emit();
          },
          (error) => {
            console.error('Error updating rider info:', error);
          },
        );
    }
  }

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    vehicleType: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    riderImage: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  isSignupFormDisabled() {
    return !this.signUpForm.valid;
  }

  selectedRide!: string;
  selectRideHandler(rideName: string) {
    this.selectedRide = rideName;
    this.signUpForm.get('vehicleType')?.setValue(rideName);
  }

  handleImageUpload($event: NzUploadChangeParam) {
    if ($event.type === 'start') {
      let imageFileList = [...$event.fileList];
      imageFileList = imageFileList.slice(-1);
      const file = imageFileList[0].originFileObj;

      if (file) {
        this.cloudinaryServices
          .cloudUpload(file, 'user123')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .subscribe((res: any) => {
            this.signUpForm.get('riderImage')?.setValue(res.secure_url);
          });
      }
    }
  }
}

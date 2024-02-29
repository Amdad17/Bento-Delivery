import { ISignup } from './../interfaces/Isignup.interface';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryServiceService } from '../services/cloudinary-service.service';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { SignupService } from '../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  @Output() closeSignup = new EventEmitter();
  @Output() openSignIn = new EventEmitter();

  // eslint-disable-next-line no-unused-vars
  constructor(
    private cloudinaryServices: CloudinaryServiceService,
    private signupService: SignupService,
    private router: Router,
  ) {}

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

            console.log('cover photo', this.signUpForm.value.riderImage);
          });
      }
    }
  }

  // this.signUpForm.value.confirmPassword

  signUpButtonClick() {
    if (this.signUpForm.valid) {
      const values = this.signUpForm.value;

      if (
        this.signUpForm.get('password')?.value ===
        this.signUpForm.get('confirmPassword')?.value
      ) {
        delete values.confirmPassword;
        this.signupService.signUp(values as ISignup).subscribe(
          (res) => {
            if (res) {
              this.closeSignup.emit();
              this.openSignIn.emit();
              console.log(res);
            }
          },
          (error) => {
            console.log(error);
          },
        );
        console.log('values', values);
      } else {
        window.alert('Passwords not matched');
        console.log('from inside password not matched', values);
      }
    } else {
      window.alert('Please Fillup The Full Form');
    }
  }
}

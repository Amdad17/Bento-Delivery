import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignInService } from '../services/sign-in.service';
import { ISignIn } from '../interfaces/ISignIn.interface';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  // small : number = 580
  size: 'large' | 'default' = 'default';

  // eslint-disable-next-line no-unused-vars
  constructor(
    private signInService: SignInService,
    private router: Router,
    private message: NzMessageService,
  ) {}

  signInForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.open();
  }
  showLarge(): void {
    this.size = 'large';
  }

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  signIn() {
    // console.log('from outside if statement', this.signInForm.value);

    if (this.signInForm.valid) {
      // console.log(this.signInForm.value);
      this.signInService.signIn(this.signInForm.value as ISignIn).subscribe(
        (res) => {
          if (res) {
            console.log(res);
            const riderId = res.riderInfo._id;
            localStorage.setItem('riderId', riderId);
            this.message.success('Signed In Successfully');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.router.navigate(['/animation']);
            // this.router.navigate([riderId + '/ridermap']);
          }
        },
        (error) => {
          console.log(error);
          this.message.error('Something Went Wrong');
        },
      );
    } else {
      this.message.error('Please Provide Email Password');
    }
  }
}

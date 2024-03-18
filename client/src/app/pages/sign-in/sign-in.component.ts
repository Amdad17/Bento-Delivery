import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignInService } from '../../services/sign-in/sign-in.service';
import { ISignIn } from '../../interfaces/ISignIn.interface';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
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
    if (this.signInForm.valid) {
      this.signInService.signIn(this.signInForm.value as ISignIn).subscribe(
        (res) => {
          if (res) {
            const riderId = res.riderInfo._id;
            localStorage.setItem('riderId', riderId);
            this.message.success('Signed In Successfully');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.router.navigate(['/goOnline']);
          }
        },
        (error) => {
          // console.log(error);
          this.message.error('Something Went Wrong');
        },
      );
    } else {
      this.message.error('Please Provide Email Password');
    }
  }
}

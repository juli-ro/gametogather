import {Component, signal} from '@angular/core';
import {AuthService} from './auth.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Login} from '../../models/login';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {Router} from '@angular/router';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FeedbackService} from '../../shared/feedback.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({
    name: new FormControl<string>(""),
    password: new FormControl("")
  })

  protected hide = signal(true);


  constructor(private authService: AuthService,
              private router: Router,
              private feedbackService: FeedbackService) {
  }


  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  async login() {
    try {
      const loginData: Login = {
        name: this.loginForm.value.name ?? "",
        password: this.loginForm.value.password ?? ""
      }
      await this.authService.login(loginData)
      await this.router.navigateByUrl("/user-dashboard")
    } catch (e) {
      this.feedbackService.openSnackBarTimed("login failed", "close", 5000)
    }
  }
}

import {Component, signal} from '@angular/core';
import {MatInput, MatSuffix} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {UserService} from '../../../shared/user.service';
import {FeedbackService} from '../../../shared/feedback.service';
import {Location} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {IPasswordChangeRequest} from '../../../shared/Util/passwordChangeRequest';
import {MatIcon} from '@angular/material/icon';

enum PasswordField {
  Old = 'old',
  New = 'new',
  Confirm = 'confirm'
}

type PasswordVisibility = {
  [PasswordField.Old]: boolean;
  [PasswordField.New]: boolean;
  [PasswordField.Confirm]: boolean;
};

@Component({
  selector: 'app-user-settings',
  imports: [
    MatFormField,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatSuffix,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
  standalone: true,
})

export class UserSettingsComponent {


  passwordForm = new FormGroup({
    oldPassword: new FormControl<string>(""),
    newPassword: new FormControl<string>(""),
    newPasswordConfirmation: new FormControl<string>("")
  })

  isPasswordHidden = signal<PasswordVisibility>({
    [PasswordField.Old]: true,
    [PasswordField.New]: true,
    [PasswordField.Confirm]: true
  });


  constructor(private userService: UserService,
              private feedbackService: FeedbackService,
              private location: Location) {
  }

  togglePasswordVisibility(field: PasswordField, event: MouseEvent) {
    this.isPasswordHidden.update(current => ({
      ...current,
      [field]: !current[field] // flip only the selected field
    }));
    event.stopPropagation();
  }


  async changePassword() {
    if(this.passwordForm.value.newPassword != this.passwordForm.value.newPasswordConfirmation){
      this.feedbackService.openStandardSnackBarTimed("The new password have to be the same")
      return
    }

    const passwordChangeRequest: IPasswordChangeRequest = {
      oldPassword: this.passwordForm.value.oldPassword ?? "",
      newPassword: this.passwordForm.value.newPassword ?? ""
    }

    await this.userService.changePassword(passwordChangeRequest);
    this.location.back()
  }

  async navigateBack(){
    this.location.back()
  }

  protected readonly PasswordField = PasswordField;
}

import {Component, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {ActivatedRoute} from '@angular/router';
import {FeedbackService} from '../../../shared/feedback.service';
import {Location} from '@angular/common';
import {UserService} from '../../../shared/user.service';
import {IFullUser} from '../../../models/fullUser';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-user-detail',
  imports: [
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    MatButton
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  standalone: true
})
export class UserDetailComponent {

  userForm = new FormGroup({
    name: new FormControl<string>(""),
    email: new FormControl<string>(""),
  })

  fullUser: Signal<IFullUser | null>

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private feedbackService: FeedbackService,
              private location: Location) {
    this.fullUser = this.userService.publicSignalItem
  }

  async ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get("id"));
    if (id) {
      await this.userService.getAdminUserById(id)
    }
    const loadedUser = this.fullUser()
    if (loadedUser) {
      this.userForm.setValue({
        name: loadedUser.name,
        email: loadedUser.email,
      })
    }
  }

  async saveUserEntry() {
    const oldUserEntry = this.fullUser()
    if (oldUserEntry) {

      const userToUpdate: IFullUser = {
        id: oldUserEntry.id,
        name: this.userForm.value.name ?? oldUserEntry.name,
        email: this.userForm.value.email ?? oldUserEntry.email,
        roleName: oldUserEntry.roleName,
      };
      await this.userService.updateFullUser(userToUpdate)
      this.feedbackService.openSnackBarTimed("User has been updated", "close", 5000)
      this.location.back()
    }
  }

  navigateBack(){
    this.location.back()
  }


}

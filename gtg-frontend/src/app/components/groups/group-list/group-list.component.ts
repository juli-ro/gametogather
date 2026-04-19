import {Component, Signal} from '@angular/core';
import {IGroup} from '../../../models/group';
import {GroupService} from '../../../shared/group.service';
import {Router} from '@angular/router';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FeedbackService} from '../../../shared/feedback.service';

@Component({
  selector: 'app-group-list',
  imports: [
    MatButton,
    MatIcon,
    MatMiniFabButton
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
  standalone: true
})
export class GroupListComponent {

  groupList: Signal<IGroup[]>

  constructor(private groupService: GroupService,
              private feedbackService: FeedbackService,
              private router: Router) {
    this.groupList = this.groupService.publicSignalList
  }

  async ngOnInit() {
    await this.groupService.getUserGroupList()
  }

  async editGroup(groupId: string) {
    try {
      await this.router.navigateByUrl(`group-detail/${groupId}`)
    } catch (e) {
      this.feedbackService.openStandardSnackBarTimed("Page not found")
    }

  }

  async deleteGroup(groupId: string) {

    const confirmed = await this.feedbackService.openOkCancelDialog("Delete Group?",
      "Are you sure you want to delete the selected Group?",
      "delete");
    if (confirmed) {
      const confirmedSure = await this.feedbackService.openOkCancelDialog("Delete Group?",
        "Are you really really sure you want to delete the selected Group?",
        "delete");
      if (confirmedSure) {
        this.feedbackService.openSnackBarTimed("WIP todo", "close", 3000)
        //Todo: Only the groupAdmin should be able to do this
        // await this.groupService.deleteItem(groupId);
      }
    } else {
      return
    }
  }

  async addGroup() {
    try {
      const newGroupId = await this.groupService.createNewGroup()
      if (newGroupId) {
        await this.router.navigateByUrl(`/group-detail/${newGroupId}`)
      }
    } catch (e) {
      this.feedbackService.openStandardSnackBarTimed("Error: Group could not be added")
    }
  }

}

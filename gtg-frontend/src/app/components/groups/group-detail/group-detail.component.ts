import {Component, signal, Signal} from '@angular/core';
import {GroupService} from '../../../shared/group.service';
import {IGroup} from '../../../models/group';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FeedbackService} from '../../../shared/feedback.service';
import {IGame} from '../../../models/game';
import {GameService} from '../../games/game.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {IGroupSettings} from '../../../models/groupSettings';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-group-detail',
  imports: [
    MatExpansionModule,
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss',
  standalone: true
})
export class GroupDetailComponent {

  group: Signal<IGroup | null>
  groupGameList: Signal<IGame[]>
  groupSettings: Signal<IGroupSettings | null>
  readonly panelOpenState = signal(true);

  telegramChatId: FormControl<string | null> = new FormControl("")


  constructor(private groupService: GroupService,
              private gameService: GameService,
              private feedbackService: FeedbackService,
              private route: ActivatedRoute,
              private location: Location) {
    this.group = this.groupService.publicSignalItem
    this.groupGameList = this.gameService.publicSignalGroupGameList
    this.groupSettings = this.groupService.publicGroupSettings

  }

  async ngOnInit() {
    try {
      const id = String(this.route.snapshot.paramMap.get("id"));
      if (id) {
        await this.groupService.getItemById(id)
        await this.groupService.getUserSetting(id)
      }
      const group = this.group()
      if(group){
        await this.gameService.getGroupGameList(group.id)
      }
      const settings = this.groupSettings()
      if(settings){
        this.telegramChatId.setValue(settings.telegramChatIdentification ?? "")
      }

    } catch (e) {
      this.feedbackService.openSnackBarTimed("meeting could not be found", "Close", 4000)
      this.location.back()
    }
  }

  async updateTelegramChatId(){
    debugger
    const settings = this.groupSettings()
    const chatId = this.telegramChatId.value
    if (settings && chatId) {
      debugger
      settings.telegramChatIdentification = chatId
      await this.groupService.updateGroupSettings(settings)
    }
  }


}

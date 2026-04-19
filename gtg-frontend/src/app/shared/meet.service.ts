import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiDataService} from './api-data.service';
import {IMeet} from '../models/meet';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {lastValueFrom} from 'rxjs';
import {IMeetDateSuggestion} from '../models/meetDateSuggestion';
import {IGroup} from '../models/group';
import {Location} from '@angular/common';
import {FeedbackService} from './feedback.service';
import {IMeetUser} from '../models/meetUser';
import {updateItemInArray} from './Util/array-utils';

@Injectable({
  providedIn: 'root'
})
export class MeetService extends ApiDataService<IMeet> {

  protected override signalList: WritableSignal<IMeet[]> = signal<IMeet[]>([])
  protected override signalItem: WritableSignal<IMeet | null> = signal<IMeet | null>(null)
  private signalCurrentMeetUser: WritableSignal<IMeetUser | null> = signal<IMeetUser | null>(null)

  readonly publicSignalItem = this.signalItem.asReadonly()
  readonly publicSignalList = this.signalList.asReadonly()
  readonly publicCurrentMeetUser = this.signalCurrentMeetUser.asReadonly()

  readonly pastMeetings = computed(() => {
    //Todo: Getting yesterdays date is an interim solution - should be analyzed later
    // if today is set, today is recognized as a past event
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1);

    return this.signalList().filter(meeting =>
      meeting.meetDateSuggestions.some(s =>
        s.isChosenDate && new Date(s.date) < yesterday
      )
    )
  });

  readonly futureMeetings = computed(() => {
    //Todo: Getting yesterdays date is an interim solution - should be analyzed later
    // if today is set, today is recognized as a past event
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1);

    return this.signalList().filter(meeting => {
      const hasFutureChosenDate = meeting.meetDateSuggestions.some(s =>
        s.isChosenDate && new Date(s.date) >= yesterday
      );

      const hasNoChosenDate = meeting.meetDateSuggestions.every(s =>
        !s.isChosenDate
      );

      const hasNoDates = meeting.meetDateSuggestions.length == 0

      return hasFutureChosenDate || hasNoChosenDate || hasNoDates;
    });
  });


  constructor(override httpClient: HttpClient,
              override router: Router,
              override location: Location,
              override feedbackService: FeedbackService) {
    super(httpClient, router, location, feedbackService)
  }

  override getResourceUrl(): string {
    return 'meet';
  }

  async getGroupMeetsList(groupId: string): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.httpClient.get<IMeet[]>(`${this.APIUrl}/GroupMeets/${groupId}`, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async getUserMeetsList(): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.httpClient.get<IMeet[]>(`${this.APIUrl}/UserMeets`, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async addDateSuggestion(newDateSuggestion: IMeetDateSuggestion) {
    try {
      const data = await lastValueFrom(
        this.httpClient.post<IMeetDateSuggestion>(`${this.APIUrl}/AddDate`, newDateSuggestion, await this.getHttpOptions())
      )

      this.signalItem.update(meet => {
        if (!meet) return meet;
        return {
          ...meet,
          meetDateSuggestions: [...meet.meetDateSuggestions, data]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        };
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 400) {
          console.log("date already exists")
        }
      }
      await this.handleError(error)
    }

  }

  async createNewGroupMeeting(group: IGroup) {
    try {
      const data = await lastValueFrom(
        this.httpClient.post<string>(`${this.APIUrl}/CreateGroupMeet`, group, await this.getHttpOptions())
      )
      if (data) {
        return data;
      } else return "";
    } catch (error) {
      await this.handleError(error)
      return null
    }
  }

  async setCurrentMeetUser(meeting: IMeet) {
    if (!meeting) {
      return
    }
    try {
      const data =
        await lastValueFrom(
          this.httpClient.get<IMeetUser>(`${this.APIUrl}/GetCurrentMeetUser/${meeting.id}`, await this.getHttpOptions()
          )
        )

      if (data) {
        this.signalCurrentMeetUser.set(data)
      }
    } catch (e) {
      await this.handleError(e)
    }
  }


  async selectDateSuggestion(date: IMeetDateSuggestion) {
    try {
      const data =
        await lastValueFrom(
          this.httpClient.put<IMeetDateSuggestion>(`${this.APIUrl}/SelectDate`, date, await this.getHttpOptions())
        )
      if (data) {

        this.signalItem.update(meet => {
          if (!meet) return meet;
          return {
            ...meet,
            meetDateSuggestions: updateItemInArray(meet.meetDateSuggestions, data.id, data, item => item.id)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          };
        });
      }
    } catch (e) {
      await this.handleError(e)
    }
  }


  async updateMeeting(meeting: IMeet) {
    try {
      const data = await lastValueFrom(this.httpClient.put<IMeet>(`${this.APIUrl}`, meeting, await this.getHttpOptions()))
      if (data) {
        this.replaceListItem(data.id, data)
        this.feedbackService.openStandardSnackBarTimed("Meeting updated")
      }
    } catch (e) {
      await this.handleError(e)
    }
  }
}

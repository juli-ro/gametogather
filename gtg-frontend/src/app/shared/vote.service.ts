import {Injectable, signal} from '@angular/core';
import {ApiDataService} from './api-data.service';
import {IMeetUserVote} from '../models/meetUserVote';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {FeedbackService} from './feedback.service';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService extends ApiDataService<IMeetUserVote> {

  getResourceUrl(): string {
    return 'meetUserVote';
  }

  protected override signalItem= signal<IMeetUserVote | null>(null)
  protected override signalList= signal<IMeetUserVote[]>([])
  override publicSignalItem = this.signalItem.asReadonly()
  override publicSignalList = this.signalList.asReadonly()


  constructor(override httpClient: HttpClient,
              override router: Router,
              override location: Location,
              override feedbackService: FeedbackService) {
    super(httpClient, router, location, feedbackService)
  }

  async getMeetingVotes(meetId: string): Promise<void> {
    try {

      const data = await lastValueFrom(
        this.httpClient.get<IMeetUserVote[]>(`${this.APIUrl}/MeetingVotes/${meetId}`, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }


}



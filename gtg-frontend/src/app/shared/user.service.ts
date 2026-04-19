import {Injectable, signal, WritableSignal} from '@angular/core';
import {ApiDataService} from './api-data.service';
import {IFullUser} from '../models/fullUser';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {FeedbackService} from './feedback.service';
import {lastValueFrom} from 'rxjs';
import {IReturnMessage} from './Util/returnMessage';
import {IPasswordChangeRequest} from './Util/passwordChangeRequest';

@Injectable({
  providedIn: 'root'
})

//Todo: create a more restricted service (same in backend)
// meaning only be able to access certain functions if you are an
// authenticated admin
export class UserService extends ApiDataService<IFullUser> {

  protected override signalList: WritableSignal<IFullUser[]> = signal<IFullUser[]>([])
  protected override signalItem: WritableSignal<IFullUser | null> = signal<IFullUser | null>(null)

  readonly publicSignalItem = this.signalItem.asReadonly()
  readonly publicSignalList = this.signalList.asReadonly()

  constructor(override httpClient: HttpClient,
              override router: Router,
              override location: Location,
              override feedbackService: FeedbackService) {
    super(httpClient, router, location, feedbackService)
  }

  async getAllAdminUsers(): Promise<void>{
    try {
      const data = await lastValueFrom(
        this.httpClient.get<IFullUser[]>(`${this.APIUrl}/adminUser`, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async updateFullUser(item: IFullUser) {
    try {
      const data = await lastValueFrom(this.httpClient.put<IFullUser>(`${this.APIUrl}/adminUser`, item, await this.getHttpOptions()))
      if (data) {
        this.replaceListItem(data.id, data)
      }
    } catch (e) {
      await this.handleError(e)
    }
  }

  async getAdminUserById(userId: string): Promise<void>{
    try {
      const data = await lastValueFrom(
        this.httpClient.get<IFullUser>(`${this.APIUrl}/adminUser/${userId}`, await this.getHttpOptions())
      )
      this.signalItem.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async createFullUser(newUser: IFullUser){
    try{
      if(newUser){
        const data = await lastValueFrom(
          this.httpClient.post<IReturnMessage>(`${this.APIUrl}/adminUser`, newUser, await this.getHttpOptions())
        )
        if(data){
          this.feedbackService.openStandardSnackBar(`New password: ${data.message}`)
        }
      }

    } catch (error){
      await this.handleError(error)
    }
  }

  async changePassword(request: IPasswordChangeRequest){
    try{
      await lastValueFrom(
        this.httpClient.post(`${this.APIUrl}/changePassword`, request, await this.getHttpOptions())
      )
      this.feedbackService.openStandardSnackBarTimed("PasswordChanged")
    } catch (error){
      await this.handleError(error)
      this.feedbackService.openStandardSnackBarTimed("Something didn't work")
    }
  }

  override getResourceUrl(): string {
    return 'user';
  }

}

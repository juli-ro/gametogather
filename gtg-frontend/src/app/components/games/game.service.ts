import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {IGame} from '../../models/game';
import {Router} from '@angular/router';
import {ApiDataService} from '../../shared/api-data.service';
import {FeedbackService} from '../../shared/feedback.service';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GameService extends ApiDataService<IGame> {

  protected override signalList = signal<IGame[]>([])
  protected override signalItem = signal<IGame | null>(null)
  override  publicSignalList = this.signalList.asReadonly()
  override publicSignalItem = this.signalItem.asReadonly()

  //Todo: all sort of methods have to be made because of this extra list (like empty array)
  // see how much of a hassle this is and maybe think of another way
  private signalGroupGameList: WritableSignal<IGame[]> = signal<IGame[]>([])
  publicSignalGroupGameList= this.signalGroupGameList.asReadonly()

  constructor(override httpClient: HttpClient,
              override router: Router,
              override location: Location,
              override feedbackService: FeedbackService) {
    super(httpClient, router, location, feedbackService)
  }

  override getResourceUrl(): string {
    return "game";
  }

  async getUserGamesList(): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.httpClient.get<IGame[]>(`${this.APIUrl}/UserGames`, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async getGroupGameList(groupId: string){
      try {
        const data = await lastValueFrom(
          this.httpClient.get<IGame[]>(`${this.APIUrl}/GroupGames/${groupId}`, await this.getHttpOptions())
        )
        this.signalGroupGameList.set(data)
      } catch (error) {
        await this.handleError(error)
      }
  }

  async addGame(gameToAdd: IGame) {
    try {
      const data = await lastValueFrom(
        this.httpClient.post<IGame>(this.APIUrl, gameToAdd, await this.getHttpOptions())
      )
      this.signalList.set(
        [...this.signalList(), data]
      )
      await this.router.navigateByUrl(`game-detail/${data.id}`)
    } catch (error) {
      await this.handleError(error)
    }
  }

  emptyGroupGameList(){
    this.signalGroupGameList.set([])
  }

}


import {Injectable, Signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {jwtEnum} from './jwtEnum';
import {lastValueFrom, throwError} from 'rxjs';
import {IModelBase} from '../models/modelBase';
import {Router} from '@angular/router';
import {FeedbackService} from './feedback.service';
import {Location} from '@angular/common';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export abstract class ApiDataService<T extends IModelBase> {
  protected readonly APIUrl = environment.apiBaseUrl + this.getResourceUrl();

  protected constructor(protected httpClient: HttpClient,
                        protected router: Router,
                        protected location: Location,
                        protected feedbackService: FeedbackService) {
  }

  abstract getResourceUrl(): string;

  protected abstract signalList: WritableSignal<T[]>
  protected abstract signalItem: WritableSignal<T | null>

  abstract publicSignalList: Signal<T[]>
  abstract publicSignalItem: Signal<T | null>


  //Todo: maybe inject this
  protected async getHttpOptions(extraParams?: { [key: string]: string }) {
    const token: string | null = await localStorage.getItem(jwtEnum.id_token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const options: { headers: HttpHeaders, params?: HttpParams } = {headers};

    if (extraParams) {
      options.params = new HttpParams({fromObject: extraParams});
    }

    return options
  }

  async getList() {
    try {
      const data = await lastValueFrom(
        this.httpClient.get<T[]>(this.APIUrl, await this.getHttpOptions())
      )
      this.signalList.set(data)
    } catch (error) {
      await this.handleError(error)
    }
  }

  async getItemById(id: string) {
    try {
      const url = `${this.APIUrl}/${id}`;
      const data = await lastValueFrom(
        this.httpClient.get<T>(url, await this.getHttpOptions())
      )
      this.signalItem.set(data)
    } catch (error) {
      await this.handleError(error)
      //Todo: this should be handled more centrally (probably in the handleError function
      this.feedbackService.openSnackBarTimed("item could not be found", "Close", 4000)
      this.location.back()
    }
  }

  async updateItemInList(item: T) {
    try {
      const data = await lastValueFrom(this.httpClient.put<T>(this.APIUrl, item, await this.getHttpOptions()))
      if (data) {
        debugger;
        this.replaceListItem(data.id, data)
      }
    } catch (e) {
      await this.handleError(e)
    }
  }

  async addItem(item: T) {
    try {
      const data = await lastValueFrom(
        this.httpClient.post<T>(this.APIUrl, item, await this.getHttpOptions())
      )
      this.signalList.update(items =>
        [...items, data]
      )
    } catch (error) {
      await this.handleError(error)
    }
  }


  async deleteItem(id: string) {
    try {
      const url: string = `${this.APIUrl}/${id}`;
      await lastValueFrom(
        this.httpClient.delete(url, await this.getHttpOptions())
      )
      //Todo: maybe change the way this works (object can be passed instead of id)
      this.signalList.set(
        this.signalList().filter(item => item.id !== id)
      )
    } catch (error) {
      await this.handleError(error)
    }
  }

  replaceListItem(id: string, newItem: T) {
    this.signalList.set(
      this.signalList().map(item => (item.id === id ? newItem : item))
    );
  }

  setSelectedItem(selectedItem: T) {
    //Todo: check if error handling is needed
    if (selectedItem) {
      this.signalItem.set(selectedItem)
    }
  }

  emptyList() {
    this.signalList.set([])
  }

  protected async handleError(err: unknown) {
    let errorMessage = '';
    if (err instanceof HttpErrorResponse) {
      // in a real world app, we may send the server to some remote logging infrastructure
      // instead of just logging it to the console
      if (err.status == 401) {
        localStorage.removeItem(jwtEnum.id_token);
        console.log("not authorized, removed token")
        await this.router.navigateByUrl("/")
      }
      if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

}

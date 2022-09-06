import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private readonly profileAPI = `${environment.apiUrl}public/user/getuser/`;

  constructor(private http: HttpClient) { }

  getProfile(username: any): Observable<any>{
    return this.http.get<any>(this.profileAPI + username);
  }
}

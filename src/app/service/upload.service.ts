import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private apiPublicUrl = environment.apiPublicUrl;

  constructor(private http: HttpClient) {
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public formData = new FormData();

  public upload(file: File, userName: string, jobId): Observable<any> {
    this.resetForm();
    this.formData.append('file', file);
    this.formData.append('username', userName);
    this.formData.append('jobId', jobId);
    return this.http.post(`${this.apiPublicUrl}` + 'upload', this.formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  public uploadAvatar(file: File, userId: any): Observable<any> {
    this.resetForm();
    this.formData.append('file', file);
    this.formData.append('userId', userId);
    return this.http.post(`${this.apiPublicUrl}` + 'uploadAvatar', this.formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  resetForm() {
    this.formData = new FormData();
  }
}

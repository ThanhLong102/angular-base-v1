import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {JobDto} from '../models/model/JobDto';

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private apiServerUrl = environment.apiPublicUrl;
  private apiPublicUrl = environment.apiPublicUrl;

  constructor(private http: HttpClient) { }

  public addJob(job: JobDto): Observable<any> {
    return this.http.post(`${this.apiServerUrl}`+'jobs',job).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public addView(id: number): Observable<any> {
    return this.http.get(`${this.apiServerUrl}`+'jobs/views/id='+id).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public updateJob(job: JobDto): Observable<any> {
    return this.http.put(`${this.apiServerUrl}`+'jobs',job).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public getJobById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}`+'jobs/id='+id).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}`+'jobs/id='+id);
  }

  public findJob(searchJob,page,size): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.post<any>(`${this.apiServerUrl}`+'jobs/searches?'+'&page='+page+'&size='+size,searchJob).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public sortByName(searchJob,page,size): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.post<any>(`${this.apiServerUrl}`+'jobs/searches/sortByName?'+'&page='+page+'&size='+size,searchJob).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public getStatusJob(): Observable<any[]> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'statusJobs').pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }
  public getJobPosition(): Observable<any[]> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'jobPositions').pipe(
      tap(jobPositions => console.log(`jobPositions=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getWorkingForm(): Observable<any[]> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'workingForms').pipe(
      tap(jobPositions => console.log(`workingForms=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getAcademicLevels(): Observable<any[]> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'academicLevels').pipe(
      tap(jobPositions => console.log(`academicLevels=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getRanks(): Observable<any[]> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'ranks').pipe(
      tap(jobPositions => console.log(`academicLevels=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getJobNews(numberDay,page,size): Observable<any> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'jobs/news?'+'numberDay='+numberDay
      +'&page='+page+'&size='+size).pipe(
      tap(jobPositions => console.log(`academicLevels=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getJobHighSalary(salary,page,size): Observable<any> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'jobs/salary-highs?'+'salary='+salary
      +'&page='+page+'&size='+size).pipe(
      tap(jobPositions => console.log(`academicLevels=${JSON.stringify(jobPositions)}`)),
    );
  }

  public getJobDue(numberDay,page,size): Observable<any> {
    return this.http.get<any>(`${this.apiPublicUrl}`+'jobs/due-dates?'+'numberDay='+numberDay
      +'&page='+page+'&size='+size).pipe(
      tap(jobPositions => console.log(`academicLevels=${JSON.stringify(jobPositions)}`)),
    );
  }

  public updateStatusJob(statusDto): Observable<any> {
    return this.http.put(`${this.apiServerUrl}`+'jobs/status_job',statusDto).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(receivedJob)}`)),
    );
  }

  public updateReason(reasonDto): Observable<any> {
    return this.http.put(`${this.apiServerUrl}`+'jobs/reason',reasonDto).pipe(
      tap(receivedJob => console.log(`receivedJob=${JSON.stringify(reasonDto)}`)),
    );
  }

  public getTotalJob(dashboardVM: any): Observable<any> {
    return this.http.post<any>(`${this.apiPublicUrl}`+'jobs/find-total-job',dashboardVM).pipe(
      tap(receivedJob => console.log(`profile=${JSON.stringify(receivedJob)}`)),
    );
  }

  public getTotalJobDueDate(dashboardVM: any): Observable<any> {
    return this.http.post<any>(`${this.apiPublicUrl}`+'jobs/find-total-dueDate',dashboardVM).pipe(
      tap(receivedJob => console.log(`profile=${JSON.stringify(receivedJob)}`)),
    );
  }

  public getTotalViews(dashboardVM: any): Observable<any> {
    return this.http.post<any>(`${this.apiPublicUrl}`+'jobs/find-total-views',dashboardVM).pipe(
      tap(receivedJob => console.log(`profile=${JSON.stringify(receivedJob)}`)),
    );
  }

}

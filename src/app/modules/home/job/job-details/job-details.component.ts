import {Component, OnInit} from '@angular/core';
import {Job} from '../../../../models/model/Job';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {JobService} from '../../../../service/job.service';
import {UserService} from '../../../../service/user.service';
import {User} from '../../../../models/model/User';
import {StatusDto} from '../../../../models/Dto/StatusDto';
import {ReasonDto} from '../../../../models/Dto/ReasonDto';

@Component({
  selector: 'ngx-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit{
  job: Job;
  user: User;
  statusDto: StatusDto ;
  reasonDto: ReasonDto;
  displayPosition: boolean;
  position: string;
  displayPositionReason: boolean;
  reason: string;

  // eslint-disable-next-line max-len
  constructor(private readonly route: ActivatedRoute, private jobService: JobService , private userService: UserService, private readonly router: Router) {
    this.getUser();
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.params);
    this.getJobById();
    this.reasonDto = {jobId: 1, reason: '', statusId: 1};
  }

  public getJobById(): void {
    this.jobService.getJobById(this.route.snapshot.params.id).subscribe(
      (data: Job) => {
        this.job = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public deleteById(): void {
    this.jobService.delete(this.route.snapshot.params.id).subscribe(
    );
  }

  public getUserByUserName(username: string): void {
    this.userService.getUserByUserName(username).subscribe(
      (data: User) => {
        this.user = data;
        console.log('roles',data.roles);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public getUser(): void {
    const token = this.userService.getDecodedAccessToken();
    this.getUserByUserName(token.sub);
  }

  public updateStatusJob(){
    this.jobService.updateStatusJob(this.statusDto).subscribe(
      (data: any) => {
        this.job.statusJob =data.statusJob;
        alert('Update thành công');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public updateReason(){
    this.jobService.updateReason(this.reasonDto).subscribe(
      (data: any) => {
        this.job.statusJob =data.statusJob;
        alert('Update thành công');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  onUpdate() {
    this.router.navigate(['/home/job-update', this.job.id]).then(r => console.log(r));
  }

  onPreview(id: number) {
    this.router.navigate(['/home-public/job-detail', id]).then(r => console.log(r));
  }

  getInitStatusDto(){
    this.statusDto ={jobId:1,statusId:1};
  }

  onBrowse() {
    this.getInitStatusDto();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 3;
    this.updateStatusJob();
  }

  onUp() {
    this.getInitStatusDto();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 2;
    this.updateStatusJob();
  }

  onStop() {
    this.getInitStatusDto();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 3;
    this.updateStatusJob();
  }

  onClose() {
    this.getInitStatusDto();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 4;
    this.updateStatusJob();
  }

  onDelete() {
    this.getInitStatusDto();
    this.statusDto.jobId = this.job.id;
    this.statusDto.statusId = 5;
    this.deleteById();
    this.router.navigate(['/home/list-job']).then(r => console.log(r));
  }

  onRefuse() {
    console.log('reasonDto',this.reasonDto);
    this.reasonDto.jobId = this.job.id;
    this.reasonDto.statusId = 5;
    this.updateReason();
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
}

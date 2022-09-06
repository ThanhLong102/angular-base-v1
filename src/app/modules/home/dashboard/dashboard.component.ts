import {Component, OnInit} from '@angular/core';
import {JobRegisterService} from '../../../service/jobRegister.service';
import {JobService} from '../../../service/job.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  basicData: any;
  basicOptions: any;
  sDate: Date = new Date('01/01/2000');
  eDate: Date = new Date('01/01/3000');
  data: any;
  chartOptions: any;
  registerSuccess: number;
  registerFall: number;
  registerPv: number;
  registerWaitPv: number;
  totalJob: number;
  totalViews: number;
  totalJobDueDate; number;
  totalRegister: number;
  dataByMonthRegisterSuccess: number[] = [];
  dataByMonthRegisterFall: number[] = [];

  constructor(private jobRegisterService: JobRegisterService,
              private jobService: JobService) {
  }

  ngOnInit(): void {
    this.changeData();
  }

  applyLightTheme() {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }

  updateChartOptions() {
    this.chartOptions = this.getDarkTheme();
  }

  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  changeData() {
    this.getTotalJob();
    this.getTotalRegister();
    this.getTotalViews();
    this.getTotalJobDueDate();
    this.getRegisterSuccess();
    this.getRegisterFall();
    this.getRegisterWaitPv();
    this.getTotalByMonthSuccess();
    this.getTotalByMonthFall();
    this.getRegisterPv();
  }

  init() {
    this.basicData = {
      labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
      datasets: [
        {
          label: 'Ứng viên ứng tuyển thành công !',
          data: this.dataByMonthRegisterSuccess,
          fill: false,
          borderColor: '#42A5F5',
          tension: .4,
        },
        {
          label: 'Ứng viên ứng tuyển thất bại !',
          data: this.dataByMonthRegisterFall,
          fill: false,
          borderColor: '#FFA726',
          tension: .4,
        },
      ],
    };
    this.data = {
      labels: ['Ứng viên ứng tuyển thành công !', 'Ứng viên ứng tuyển thất bại !'],
      datasets: [
        {
          data: [this.registerSuccess, this.registerFall],
          backgroundColor: [
            '#42A5F5',
            '#FFA726',
          ],
          hoverBackgroundColor: [
            '#42A5F5',
            '#FFA726',
          ],
        },
      ],
    };
    this.updateChartOptions();
  }

  getRegisterWaitPv() {
    this.jobRegisterService.getByDateAndStatus({startDate: this.sDate, endDate: this.eDate, statusId: 2}).subscribe(
      (data: number) =>
        this.registerWaitPv = data,
      error => console.log(error),
    );
  }

  getRegisterPv() {
    this.jobRegisterService.getByDateAndStatus({startDate: this.sDate, endDate: this.eDate, statusId: 3}).subscribe(
      (data: number) =>
        this.registerPv = data,
      error => console.log(error),
    );
  }

  getRegisterSuccess() {
    this.jobRegisterService.getByDateAndStatus({startDate: this.sDate, endDate: this.eDate, statusId: 4}).subscribe(
      (data: number) =>
        this.registerSuccess = data,
      error => console.log(error),
    );
  }

  getRegisterFall() {
    this.jobRegisterService.getByDateAndStatus({startDate: this.sDate, endDate: this.eDate, statusId: 5}).subscribe(
      (data: number) => {
        this.registerFall = data;
        this.init();
      },
      error => console.log(error),
    );
  }

  getTotalRegister() {
    this.jobRegisterService.getTotalRegister({startDate: this.sDate, endDate: this.eDate, statusId: 1}).subscribe(
      (data: number) => {
        this.totalRegister = data;
        this.init();
      },
      error => console.log(error),
    );
  }

  getTotalJob() {
    this.jobService.getTotalJob({startDate: this.sDate, endDate: this.eDate, statusId: 1}).subscribe(
      (data: number) => {
        this.totalJob = data;
        this.init();
      },
      error => console.log(error),
    );
  }

  getTotalJobDueDate() {
    this.jobService.getTotalJobDueDate({startDate: this.sDate, endDate: this.eDate, statusId: 1}).subscribe(
      (data: number) => {
        this.totalJobDueDate = data;
        this.init();
      },
      error => console.log(error),
    );
  }

  getTotalViews() {
    this.jobService.getTotalViews({startDate: this.sDate, endDate: this.eDate, statusId: 1}).subscribe(
      (data: number) => {
        this.totalViews = data;
        this.init();
      },
      error => console.log(error),
    );
  }

  getTotalByMonthSuccess() {
    this.jobRegisterService.getTotalByMonth({startDate: this.sDate, endDate: this.eDate, statusId: 4}).subscribe(
      (data: number[]) => {
        this.dataByMonthRegisterSuccess = data;
      },
      error => console.log(error),
    );
  }

  getTotalByMonthFall() {
    this.jobRegisterService.getTotalByMonth({startDate: this.sDate, endDate: this.eDate, statusId: 5}).subscribe(
      (data: number[]) => {
        this.dataByMonthRegisterFall = data;
        this.init();
      },
      error => console.log(error),
    );
  }
}

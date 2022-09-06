import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-tag-info',
  templateUrl: './tag-info.component.html',
  styleUrls: ['./tag-info.component.scss'],
})
export class TagInfoComponent implements OnInit {

  @Input() public title;
  @Input() public data;

  constructor() { }

  ngOnInit(): void {
  }

}

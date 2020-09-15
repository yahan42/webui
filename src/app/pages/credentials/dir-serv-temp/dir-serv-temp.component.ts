import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dir-serv-temp',
  template: 'temporary template',
})
export class DirServTempComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/directoryservice'])
  }

}

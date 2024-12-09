import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StormwaterService } from '../stormwater.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    standalone: false
})
export class NavigationComponent implements OnInit {
  loggedIn:boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  constructor(private breakpointObserver: BreakpointObserver, private stormwater:StormwaterService) {}
  logInClicked() {
    this.stormwater.logInClicked.next(true)
  }
  logOutClicked() {
    this.stormwater.logOutClicked.next(true)
  }
  ngOnInit() {
    this.stormwater.credentials.subscribe(credentials => {
      if (credentials) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }
}

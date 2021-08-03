import { Component, OnInit, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  user;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('identificacion')){
      this.user = localStorage.getItem('identificacion');
    }else{
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
  }

  logOut(): void {
      localStorage.removeItem('identificacion');
      this.router.navigate(['/login']);
  }
  isUndefined(value){
    var undefined = void(0);
    return value === undefined;
  }

}

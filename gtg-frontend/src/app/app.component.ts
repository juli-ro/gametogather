import {Component, Signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from './components/login/auth.service';
import {MatDrawerMode, MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {HamburgerComponent} from './components/hamburger/hamburger/hamburger.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatButtonModule,
    RouterLinkActive,
    RouterLink,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    HamburgerComponent,
    MatIcon,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GTG';
  mode: MatDrawerMode = 'over';
  isAdmin: Signal<boolean>
  isAuthenticated: Signal<boolean>

  constructor(private authService: AuthService,
              private router: Router) {
    this.isAdmin = this.authService.isAdmin
    this.isAuthenticated = this.authService.isAuthenticated
  }

  async logout(){
    await this.authService.logout()
    await this.router.navigateByUrl("/login")
  }


}

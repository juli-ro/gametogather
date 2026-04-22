import { Routes } from '@angular/router';
import {GameListUserComponent} from './components/games/game-list-user/game-list-user.component';
import {LoginComponent} from './components/login/login.component';
import {GameListGroupComponent} from './components/games/game-list-group/game-list-group.component';
import {UserDashboardComponent} from './components/user-dashboard/user-dashboard.component';
import {MeetDetailComponent} from './components/meet/meet-detail/meet-detail.component';
import {GameDetailComponent} from './components/games/game-detail/game-detail.component';
import {GroupListComponent} from './components/groups/group-list/group-list.component';
import {GroupDetailComponent} from './components/groups/group-detail/group-detail.component';
import {UserListComponent} from './components/users/user-list/user-list.component';
import {UserDetailComponent} from './components/users/user-detail/user-detail.component';
import {UserSettingsComponent} from './components/users/user-settings/user-settings.component';
import {authGuard} from './shared/Util/auth-guard';
import {adminGuard} from './shared/Util/admin-guard';
import {AddUserGameComponent} from './components/games/add-user-game/add-user-game.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "game", component: GameListUserComponent, canActivate:[authGuard]},
  {path: "groupGames", component: GameListGroupComponent, canActivate:[authGuard]},
  {path: "login", component: LoginComponent},
  {path: "user-dashboard", component: UserDashboardComponent, canActivate:[authGuard]},
  {path: "meet-detail/:id", component: MeetDetailComponent, canActivate:[authGuard]},
  {path: "game-detail/:id", component: GameDetailComponent, canActivate:[authGuard]},
  {path: "group", component: GroupListComponent, canActivate:[authGuard]},
  {path: "group-detail/:id", component: GroupDetailComponent, canActivate:[authGuard]},
  {path: "user-list", component: UserListComponent, canActivate:[authGuard, adminGuard]},
  {path: "user-detail/:id", component: UserDetailComponent, canActivate:[authGuard, adminGuard]},
  {path: "user-settings", component: UserSettingsComponent, canActivate:[authGuard]},
  {path: "add-user-game", component: AddUserGameComponent, canActivate:[authGuard]}

];

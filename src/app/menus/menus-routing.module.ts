import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MenusComponent } from './menus.component';

const menuRoutes: Routes = [
  { path: '', component: MenusComponent, canActivate: [AuthGuard] }
  // { path: 'import-order', component: MenusComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(menuRoutes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }

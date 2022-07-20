import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from '../layouts/sidenav/sidenav.component';
import {ConfigComponent} from '../components/config/config.component';
import { ControlPanelComponent } from '../components/control-panel/control-panel.component';
import { AuthGuard } from '../login/auth.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ReportsComponent } from '../components/reports/reports.component';
import { WidgetDashboardComponent } from '../components/widget-dashboard/widget-dashboard.component';
import { AdminPanelComponent } from '../components/admin-panel/admin-panel.component';
import { AlertPanelComponent } from '../components/alert-panel/alert-panel.component';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'home/admin-panel',
        component: AdminPanelComponent
      },
      {
        path: 'home/control-panel',
        component: ControlPanelComponent
      }
      ,{
        path: 'home/dashboard',
        component: DashboardComponent
      }
      ,{
        path: 'home/alert',
        component: AlertPanelComponent
      },
      
      {
        path: 'home/dashboard2',
        component:WidgetDashboardComponent
      },{
        path: 'home/reports',
        component: ReportsComponent
      }
    ]
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }

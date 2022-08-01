import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedRoutingModule } from './shared-routing.module';

import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizeElementModule } from 'angular-resize-element';

// common components
import { SidenavComponent } from '../layouts/sidenav/sidenav.component';
import { ConfigComponent } from '../components/config/config.component';
import { ControlPanelComponent } from '../components/control-panel/control-panel.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddAssetConfigComponent } from '../components/dialogs/add-asset-config/add-asset-config.component';
import { AssetConnectionsTypeComponent } from '../components/asset-connections-type/asset-connections-type.component';
import { AddSensorSubcategoryComponent } from '../components/dialogs/add-sensor-subcategory/add-sensor-subcategory.component';
import { SensorsComponent } from '../components/sensors/sensors.component';

import { AddSensorComponent } from '../components/dialogs/add-sensor/add-sensor.component';
import { AddConnectionComponent } from '../components/dialogs/add-connection/add-connection.component';
import { AddAssetComponent } from '../components/dialogs/add-asset/add-asset.component';
import { AssetTypeComponent } from '../components/asset-type/asset-type.component';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { WidgetComponent } from '../components/widget/widget.component';
import { AddMacDetailsComponent } from '../components/dialogs/add-mac-details/add-mac-details.component';
import { PlotlyComponent } from '../widgets/plotly/plotly.component';
import { CardComponent } from '../widgets/card/card.component';

// widgets
import { HighlightsComponent } from '../widgets/highlights/highlights.component';


import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { MacReportsComponent } from '../components/mac-reports/mac-reports.component';
import { ReportsComponent } from '../components/reports/reports.component';
import { TableComponent } from '../widgets/table/table.component';
import { MapComponent } from '../widgets/map/map.component';
PlotlyModule.plotlyjs = PlotlyJS;
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UsersComponent } from '../components/users/users.component';
import { AddUsersComponent } from '../components/dialogs/add-users/add-users.component';
import { WidgetAccessDirective } from '../components/directives/widget-access.directive';
import { CompanyListComponent } from '../components/company-list/company-list.component';
import { AddCompanyComponent } from '../components/dialogs/add-company/add-company.component';
import { SanitizePipe } from '../sanitize.pipe';
import { AccessrightsDirective } from '../directives/accessrights.directive';
// import { ResizeDirective } from '../directives/resize.directive';
import { ResizableModule } from 'angular-resizable-element';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { GuageComponent } from '../widgets/plotly/guage/guage.component';
import { HistoryFilterComponent } from '../components/history-filter/history-filter.component';
import { ToHideDirective } from '../directives/to-hide.directive';
import { ThemeService } from '../services/theme.service';
import { XAxisComponent } from '../components/x-axis/x-axis.component';
import { WidgetDashboardComponent } from '../components/widget-dashboard/widget-dashboard.component';
import { CommonChart1Component } from '../widgets/plotly/common-chart1/common-chart1.component';
import { BarChartComponent } from '../widgets/plotly/bar-chart/bar-chart.component';
import { AdminPanelComponent } from '../components/admin-panel/admin-panel.component';
import { AlertPanelComponent } from '../components/alert-panel/alert-panel.component';
import { AddAlertComponent } from '../components/dialogs/add-alert/add-alert.component';
import { AlertsListComponent } from '../components/alerts-list/alerts-list.component';
import { MaskWidgetComponent } from '../components/mask-widget/mask-widget.component';
import { HeaderWidgetComponent } from '../components/header-widget/header-widget.component';
import { FooterWidgetComponent } from '../components/footer-widget/footer-widget.component';

import { AngularResizeEventModule } from 'angular-resize-event';
import { UploadLogoComponent } from '../components/upload-logo/upload-logo.component';
import { PushNotificationModule } from 'ng-push-notification';
import { RecentActivityComponent } from '../widgets/recent-activity/recent-activity.component';
import {ProgressiveActivityComponent} from '../widgets/progressive-activity/progressive-activity.component';
@NgModule({
  declarations: [SidenavComponent, ConfigComponent, ControlPanelComponent,
    AddAssetConfigComponent, AssetConnectionsTypeComponent,
    AddSensorSubcategoryComponent, SensorsComponent, AddAlertComponent,
    AddSensorComponent, AlertsListComponent,
    AddConnectionComponent,
    AddAssetComponent,
    AssetTypeComponent, TooltipComponent, DashboardComponent, WidgetComponent,
    AddMacDetailsComponent,
    PlotlyComponent, CardComponent,
    MacReportsComponent, ReportsComponent, TableComponent,
    HighlightsComponent, MapComponent, UsersComponent, AddUsersComponent, WidgetAccessDirective, CompanyListComponent, AddCompanyComponent, SanitizePipe, AccessrightsDirective, GuageComponent, HistoryFilterComponent, ToHideDirective, XAxisComponent, WidgetDashboardComponent, CommonChart1Component, BarChartComponent, AdminPanelComponent, AlertPanelComponent, MaskWidgetComponent, HeaderWidgetComponent, FooterWidgetComponent, UploadLogoComponent,
    RecentActivityComponent,ProgressiveActivityComponent
  ],
  imports: [
    CommonModule, PlotlyModule,
    SharedRoutingModule, FormsModule, ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule, MatFormFieldModule,
    CdkTableModule,
    CdkTreeModule, AngularResizeEventModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule, HttpClientModule,
    LeafletModule, AngularResizeElementModule, ResizableModule, TableVirtualScrollModule,
    PushNotificationModule.forRoot()
  ],
})
export class SharedModule { }

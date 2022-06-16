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

// widgets
import { HighlightsComponent } from '../widgets/highlights/highlights.component';


import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { MacReportsComponent } from '../components/mac-reports/mac-reports.component';
import { ReportsComponent } from '../components/reports/reports.component';
import { TableComponent } from '../widgets/table/table.component';
import {MapComponent} from '../widgets/map/map.component';
PlotlyModule.plotlyjs = PlotlyJS;
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UsersComponent } from '../components/users/users.component';
import { AddUsersComponent } from '../components/dialogs/add-users/add-users.component';
import { WidgetAccessDirective } from '../components/directives/widget-access.directive';
import { CompanyListComponent } from '../components/company-list/company-list.component';
import { AddCompanyComponent } from '../components/dialogs/add-company/add-company.component';
import { SanitizePipe } from '../sanitize.pipe';

@NgModule({
  declarations: [SidenavComponent, ConfigComponent, ControlPanelComponent,
    AddAssetConfigComponent, AssetConnectionsTypeComponent,
    AddSensorSubcategoryComponent, SensorsComponent,
    AddSensorComponent,
    AddConnectionComponent,
    AddAssetComponent,
    AssetTypeComponent,TooltipComponent, DashboardComponent, WidgetComponent,
    AddMacDetailsComponent,
    PlotlyComponent,
    MacReportsComponent,ReportsComponent, TableComponent,
    HighlightsComponent,MapComponent, UsersComponent, AddUsersComponent, WidgetAccessDirective, CompanyListComponent, AddCompanyComponent, SanitizePipe
  ],
  imports: [
    CommonModule,PlotlyModule,
    SharedRoutingModule, FormsModule, ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule, MatFormFieldModule,
    CdkTableModule,
    CdkTreeModule,
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
    LeafletModule
  ]
})
export class SharedModule { }

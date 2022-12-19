import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TabsComponent } from './tabs/tabs.component';
import { InfotabComponent } from './infotab/infotab.component';
import { SearchtabComponent } from './searchtab/searchtab.component';
import { MapComponent } from './map/map.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ImperviousComponent } from './impervious/impervious.component';
import { ImperviousTableComponent } from './impervious-table/impervious-table.component';
import { ApportionmentsComponent } from './apportionments/apportionments.component';
import { ApportionmentsTableComponent } from './apportionments-table/apportionments-table.component';
import { CreditsComponent } from './credits/credits.component';
import { CreditsTableComponent } from './credits-table/credits-table.component';
import { JournalsComponent } from './journals/journals.component';
import { JournalsTableComponent } from './journals-table/journals-table.component';
import { LogsComponent } from './logs/logs.component';
import { LogsTableComponent } from './logs-table/logs-table.component';
import { DialogComponent } from './dialog/dialog.component';
import { ImperviousUpdateFormComponent } from './impervious-update-form/impervious-update-form.component';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { ApportionmentFormComponent } from './apportionment-form/apportionment-form.component';
import { CreditFormComponent } from './credit-form/credit-form.component';
import { ApportionmentUpdateFormComponent } from './apportionment-update-form/apportionment-update-form.component';
import { ApportionmentDialogComponent } from './apportionment-dialog/apportionment-dialog.component';
import { ApportionmentSearchComponent } from './apportionment-search/apportionment-search.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BillingComponent } from './billing/billing.component';
import { BillingServiceTableComponent } from './billing-service-table/billing-service-table.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AccountListTableComponent } from './account-list-table/account-list-table.component';
import { ImperviousGisTableComponent } from './impervious-gis-table/impervious-gis-table.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,
        TabsComponent,
        InfotabComponent,
        SearchtabComponent,
        MapComponent,
        AccountsComponent,
        ImperviousComponent,
        ImperviousTableComponent,
        ApportionmentsComponent,
        ApportionmentsTableComponent,
        CreditsComponent,
        CreditsTableComponent,
        JournalsComponent,
        JournalsTableComponent,
        LogsComponent,
        LogsTableComponent,
        DialogComponent,
        ImperviousUpdateFormComponent,
        JournalFormComponent,
        ApportionmentFormComponent,
        CreditFormComponent,
        ApportionmentUpdateFormComponent,
        ApportionmentDialogComponent,
        ApportionmentSearchComponent,
        BillingComponent,
        BillingServiceTableComponent,
        AccountFormComponent,
        ConfirmDialogComponent,
        AccountListTableComponent,
        ImperviousGisTableComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        HttpClientModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatCheckboxModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }
}

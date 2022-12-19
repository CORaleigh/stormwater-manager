import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {path: '', component: NavigationComponent},
  {path:'oauth-callback.html', component:NavigationComponent},
  {path: 'account/:id', component: NavigationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

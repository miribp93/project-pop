import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdSpecificComponent } from './pages/ad-specific/adSpecific.component';
import { AdFilterComponent } from './pages/ad-filter/adFilter.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PayComponent } from './components/pay/pay.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { AdminDashboardComponent } from './users/admin-dashboard/adminDashboard.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UserAdComponent } from './users/user-ad/user-ad.component';
import { InfoFunctionComponent } from './components/info-function/info-function.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent }, //pagina principal
      { path: 'home', redirectTo: '', pathMatch: 'full' }, // Redirigir '/home' a la página principal
      { path: 'adspecific/:id', component: AdSpecificComponent },
      { path: 'adfilter', component: AdFilterComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contacto', component: ContactComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'resetpass', component: ResetPasswordComponent },
      { path: 'pay', component: PayComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'forgotpass', component: ForgotPasswordComponent },
      { path: 'usercreateads', component: UserAdComponent },
      { path: 'infoventa',  component: InfoFunctionComponent},
      { path: 'search-result', component: SearchResultsComponent },
    ],
  },
];

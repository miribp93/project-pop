import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdSpecificComponent } from './pages/adSpecific/adSpecific.component';
import { AdFilterComponent } from './pages/adFilter/adFilter.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PayComponent } from './components/pay/pay.component';
import { UserProfileComponent } from './users/userProfile/userProfile.component';
import { AdminDashboardComponent } from './users/adminDashboard/adminDashboard.component';
import { ResetPasswordComponent } from './auth/resetPassword/resetPassword.component';
import { ForgotPasswordComponent } from './auth/forgotPassword/forgotPassword.component';
import { UserAdComponent } from './users/userAd/userAd.component';

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
    ],
  },
];

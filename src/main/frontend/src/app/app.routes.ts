import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

import { ContactComponent } from './pages/contact/contact.component';
import { productComponent } from './pages/product/product.component';
import { AnoncesListComponent } from './pages/anonces-list/anonces-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/registro/registro.component';
import { PayComponent } from './components/pay/pay.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { AdminDashboardComponent } from './users/admin-dashboard/admin-dashboard.component';






 export const routes: Routes = [   {
     path: '',
     component: LayoutComponent,
     children: [
       { path: '', component: HomeComponent },     //pagina principal
       { path: 'home', redirectTo: '', pathMatch: 'full' },  // Redirigir '/home' a la página principal
       { path:'product/:id', component: productComponent},
       { path: 'anonces/:categoria', component: AnoncesListComponent },
       { path: 'about', component: AboutComponent },
       { path: 'contacto', component: ContactComponent },
       { path: 'login', component: LoginComponent },
       { path: 'register', component: RegisterComponent },
       { path: 'pay', component: PayComponent },

     ]

   },
   {path: 'profile', component: UserProfileComponent},
   {path: 'admin', component: AdminDashboardComponent}
 ];

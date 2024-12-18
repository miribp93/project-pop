import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { convertToParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;


  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getUserRole']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
         RouterTestingModule,
         BrowserAnimationsModule
        ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ redirect: null, productId: null })),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home after successful login', () => {
    authServiceSpy.login.and.returnValue(of({
      token: 'fake-token',
      username: 'fake-username',
      roles: ['USER']
    }));

    component.usuario = 'testuser';
    component.password = 'testpass';
    component.onLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });


  it('should show "Usuario Bloqueado" and navigate to home if user is blocked', () => {
    // Mock del servicio login
    authServiceSpy.login.and.returnValue(of({
      token: 'fake-token',
      username: 'fake-username',
      roles: ['BLOCKED']
    }));

    authServiceSpy.getUserRole.and.returnValue('BLOCKED'); // Simular rol bloqueado

    component.usuario = 'testuser';
    component.password = 'testpass';
    component.onLogin();

    expect(notificationServiceSpy.show).toHaveBeenCalledWith('Usuario Bloqueado');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login error gracefully', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));

    component.usuario = 'testuser';
    component.password = 'wrongpassword';
    component.onLogin();

    expect(notificationServiceSpy.show).toHaveBeenCalledWith(
      'Usuario o contraseña incorrectos'
    );
  });

  it('should call cancel and navigate to home', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to forgot password page', () => {
    component.onForgotPassword();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forgotpass']);
  });

  it('should navigate to pay page with productId if redirectTo is "pay"', () => {
    authServiceSpy.login.and.returnValue(of({
      token: 'fake-token',
      username: 'fake-username',
      roles: ['USER']
    }));

    component.usuario = 'testuser';
    component.password = 'testpass';
    component.redirectTo = 'pay';
    component.productId = '12345';

    component.onLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pay'], {
      queryParams: { productId: '12345' },
    });
  });

});

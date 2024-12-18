import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../components/material/material.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['sendEmailPassword']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MATERIAL_MODULES,
        CommonModule,
        FormsModule,
        ForgotPasswordComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendEmailPassword and show notification on successful password reset', () => {
    authServiceSpy.sendEmailPassword.and.returnValue(of(null));

    component.email = 'test@example.com';
    component.onResetPassword();

    expect(authServiceSpy.sendEmailPassword).toHaveBeenCalledWith('test@example.com');
    expect(notificationSpy.show).toHaveBeenCalledWith('Correo de restablecimiento enviado si el usuario existe.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log an error if sendEmailPassword fails', () => {
    const error = new Error('Network error');
    authServiceSpy.sendEmailPassword.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.email = 'test@example.com';
    component.onResetPassword();

    expect(authServiceSpy.sendEmailPassword).toHaveBeenCalledWith('test@example.com');
    expect(console.error).toHaveBeenCalledWith('Error al enviar el correo de recuperación:', error);
  });

  it('should navigate to login on cancel', () => {
    component.cancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import createSpyObj = jasmine.createSpyObj;
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

describe('AuthGuard', () => {
  let router;
  let authService;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [AuthGuard,
    {provide: Router, useValue: router},
    {provide: AuthService, useValue: authService}
    ]});
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();

  }));
});

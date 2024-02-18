import { Test, TestingModule } from '@nestjs/testing';
import { LoginPermissionService } from './login-permission.service';

describe('LoginPermissionService', () => {
  let service: LoginPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginPermissionService],
    }).compile();

    service = module.get<LoginPermissionService>(LoginPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

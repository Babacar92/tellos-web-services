import { Test, TestingModule } from '@nestjs/testing';
import { LoginPermissionResolver } from './login-permission.resolver';

describe('LoginPermissionResolver', () => {
  let resolver: LoginPermissionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginPermissionResolver],
    }).compile();

    resolver = module.get<LoginPermissionResolver>(LoginPermissionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

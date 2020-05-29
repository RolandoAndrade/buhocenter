import { Test, TestingModule } from '@nestjs/testing';
import { PlatformManagementService } from './platform-management.service';

describe('PlatformManagementService', () => {
  let service: PlatformManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformManagementService],
    }).compile();

    service = module.get<PlatformManagementService>(PlatformManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

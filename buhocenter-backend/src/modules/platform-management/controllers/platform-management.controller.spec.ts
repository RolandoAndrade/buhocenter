import { Test, TestingModule } from '@nestjs/testing';
import { PlatformManagementController } from './platform-management.controller';

describe('PlatformManagement Controller', () => {
  let controller: PlatformManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformManagementController],
    }).compile();

    controller = module.get<PlatformManagementController>(PlatformManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

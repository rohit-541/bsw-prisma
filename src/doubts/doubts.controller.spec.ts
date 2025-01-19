import { Test, TestingModule } from '@nestjs/testing';
import { DoubtsController } from './doubts.controller';

describe('DoubtsController', () => {
  let controller: DoubtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoubtsController],
    }).compile();

    controller = module.get<DoubtsController>(DoubtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

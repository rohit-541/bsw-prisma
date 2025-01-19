import { Test, TestingModule } from '@nestjs/testing';
import { DoubtsService } from './doubts.service';

describe('DoubtsService', () => {
  let service: DoubtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoubtsService],
    }).compile();

    service = module.get<DoubtsService>(DoubtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

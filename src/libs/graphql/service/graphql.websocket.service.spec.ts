import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlWebsocketService } from './graphql.websocket.service';

describe('GraphqlWebsocketService', () => {
  let service: GraphqlWebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphqlWebsocketService],
    }).compile();

    service = module.get<GraphqlWebsocketService>(GraphqlWebsocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

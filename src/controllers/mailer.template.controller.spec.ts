import { Test, TestingModule } from '@nestjs/testing';
import { MailerTemplateController } from './mailer.template.controller';

describe('MailerTemplateController', () => {
  let controller: MailerTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerTemplateController],
    }).compile();

    controller = module.get<MailerTemplateController>(MailerTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

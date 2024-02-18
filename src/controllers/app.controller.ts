import { Controller, Get } from '@nestjs/common';

/**
 * The controller of started project
 */
@Controller()
export class AppController {

    /**
     * Show if project run
     */
    @Get('/')
    public itsRun(): string {
        return "It's run";
    }
}

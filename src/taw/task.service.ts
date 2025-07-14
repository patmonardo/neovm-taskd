import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // Example scheduled task
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.log('Scheduled task executed (every minute)');
  }

  // Add your Task orchestration logic here
}

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class CleanupService {
  constructor(private readonly userService: UserService) {}

  // Define a cron job to run every day at midnight
  @Cron('0 0 * * *')
  async cleanupUnverifiedUsers() {
    console.log('Cron Job: Cleaning up unverified users...');

    try {
      // Find unverified users with expired verification tokens
      const unverifiedUsers =
        await this.userService.findUnverifiedUsersWithExpiredTokens();

      // Remove unverified users from the database
      await Promise.all(
        unverifiedUsers.map((user) => this.userService.delete(user.id)),
      );
      console.log('Unverified users:', unverifiedUsers);

      console.log(
        `Cleanup: Removed ${unverifiedUsers.length} unverified users with expired tokens.`,
      );
    } catch (error) {
      console.error('Cleanup Error:', error.message);
    }
  }
}

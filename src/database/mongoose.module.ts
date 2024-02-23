import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://kerem:wjh8B97tFjDd1iJM@task-manager.ucz1oed.mongodb.net/community-events?retryWrites=true&w=majority',
    ),
  ],
})
export class MongooseConfigModule {}

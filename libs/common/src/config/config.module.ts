import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().uri().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [NestConfigModule],
  exports: [NestConfigModule], // Exporting NestConfigModule to be used in other
})
export class ConfigModule {}

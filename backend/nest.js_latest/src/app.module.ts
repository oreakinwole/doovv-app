/* eslint-disable prettier/prettier */
// import configuration from './config/configuration';
// import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { ScheduleModule } from '@nestjs/schedule';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { RouteLogger } from '@middlewares/route.logger.middleware';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
// import { AuthModule } from './auth/auth.module';
// import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';

// import { Mongoose } from 'mongoose';




// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       load: [configuration],
//       isGlobal: true,
//     }),

//     MongooseModule.forRoot(
//       `${
//         process.env.NODE_ENV === 'development'
//           ? process.env.DATABASE_URL_DEV
//           : process.env.DATABASE_URL
//       }`,
//       {
//         onConnectionCreate() {
//           new Logger(Mongoose.name).log(
//             'Connected to Mongoose database service',
//           );
//         },
//         appName: `${process.env.APP_NAME}`,
//       },
//     ),
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: Auth.name, schema: AuthSchema },
//       { name: Invest.name, schema: InvestSchema },
//       { name: WalletTransaction.name, schema: WalletTransactionSchema },
//     ]),
//     AuthModule,
//     JwtModule.register({
//       global: true,
//       secret: `${process.env.JWT_SECRET}`,
//       signOptions: {
//         algorithm: 'HS256',
//         expiresIn: '1h',
//       },
//     }),
//     ScheduleModule.forRoot(),
//     UsersModule,
//     AdminModule,
//     TransactionsModule,
//     NotificationsModule,
//     WalletModule,
//     InvestModule,
//     StockModule,
//     AdminAuthModule,
//     AdminInvestModule,
//     MailModule,
//     LoggerModule,
//     PubSubModule,
//     UtilsModule,
//     MiscModule,
//     LearnModule,
//     PriceAlertsModule,
//     WebsocketsModule,
//     SubscriptionsModule,
//     TransferBeneficiaryModule,
//     TransactionChargesModule,
//     SplitBillModule,
//   ],
//   controllers: [AppController],
//   providers: [
//     AppService,
//     // , PubSubService
//   ],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer
//       .apply(RouteLogger)
//       .forRoutes('*')
//       .apply(AuthMiddleware)
//       .forRoutes('auth/signin');

//     // Apply the AuthMiddleware for WalletModule routes
//     consumer
//       .apply(HasTokenMiddleware)
//       .exclude('wallet/providus/callback')
//       .forRoutes('wallet/*');
//   }
// }

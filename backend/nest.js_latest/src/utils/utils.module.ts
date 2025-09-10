import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// import models
import {
  AdminReferralCampaign,
  AdminReferralCampaignSchema,
} from 'src/schemas/admin/adminReferralCampaign.schema';
import {
  AdminReferralUsers,
  AdminReferralUsersSchema,
} from 'src/schemas/admin/adminReferralUsers.schema';
import {
  CashbackWallet,
  CashbackWalletSchema,
} from 'src/schemas/cashback.schema';
import {
  CashbackTransaction,
  CashbackTransactionSchema,
} from 'src/schemas/cashback.transaction.schema';
import {
  MonoRealtimeWebhook,
  MonoRealtimeWebhookSchema,
} from 'src/schemas/mono/mono.realtime.webhook.schema';
import { Referral, ReferralSchema } from 'src/schemas/referral.schema';
import { Revenue, RevenueSchema } from 'src/schemas/revenue.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  UserNotification,
  UserNotificationSchema,
} from 'src/schemas/userNotification.schema';

/// import utils
import { SplitBill, SplitBillSchema } from 'src/schemas/split-bill.schema';
import { Voucher, VoucherSchema } from 'src/schemas/voucher.schema';
import { TransactionsUtil } from 'src/wallet/util/transactions.util';
import { CashbackUtil } from './cashback.utils';
import { MixpanelUtil } from './mixpanel.util';
import { MongooseUtil } from './mongoose.utils';
import { UserNotificationUtil } from './pushNotifications/user-notification.util';
import { ReferralUtil } from './referral.utils';
import { RevenueUtil } from './revenue.utils';
import { UserLifeCycleUtils } from './user.lifecycle.utils';
import { WhatsAppMsgUtils } from './whatsapp.utils';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Revenue.name, schema: RevenueSchema },
      { name: CashbackWallet.name, schema: CashbackWalletSchema },
      { name: CashbackTransaction.name, schema: CashbackTransactionSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: AdminReferralUsers.name, schema: AdminReferralUsersSchema },
      { name: AdminReferralCampaign.name, schema: AdminReferralCampaignSchema },
      { name: MonoRealtimeWebhook.name, schema: MonoRealtimeWebhookSchema },
      { name: SplitBill.name, schema: SplitBillSchema },
      { name: Voucher.name, schema: VoucherSchema },
    ]),
  ],
  providers: [
    CashbackUtil,
    MongooseUtil,
    MixpanelUtil,
    UserNotificationUtil,
    ReferralUtil,
    RevenueUtil,
    TransactionsUtil,
    UserLifeCycleUtils,
    WhatsAppMsgUtils,
  ],
  exports: [
    CashbackUtil,
    MongooseUtil,
    MixpanelUtil,
    UserNotificationUtil,
    ReferralUtil,
    RevenueUtil,
    TransactionsUtil,
    UserLifeCycleUtils,
    WhatsAppMsgUtils,
  ],
})
export class UtilsModule {}

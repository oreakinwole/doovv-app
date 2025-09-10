// import * as dotenv from 'dotenv';

// // Set the NODE_ENV to 'development' by default
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// dotenv.config();

// export default () => ({
//   /**
//    * Your favorite port
//    */
//   port: parseInt(process.env.PORT),
//   databaseURL:
//     process.env.NODE_ENV === 'development'
//       ? process.env.DB_LINK_DEVELOPMENT
//       : process.env.DB_LINK_PRODUCTION,
//   frontendURL: 'https://moniger.com',

//   /**
//    * moniger support email address
//    */
//   // supportEmail: 'joshua.k@babelos.net',
//   supportEmail: 'monigersupport@babelos.net',

//   environment: process.env.NODE_ENV || 'development',
//   /**
//    * Sendgrid
//    */

//   sendGrid: {
//     apiKey:
//       // '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',
//       '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',
//     email: `Moniger <hello@moniger.com>`,
//     templateIds: {
//       emailVerification: 'd-dbb7d97ecf5b4a67ba55ce836a07f32f',
//       passwordReset: 'd-9aae5d1bb1a04cbd9856b88817b65d36',
//       newProvidusWallet: 'd-0c5022fd31254f83905fb5d4d1cc1cdc',
//       pinReset: 'd-2ee5529e79bb468d84b47daece932adb',
//       ticketNotification: 'd-c83cccaacf414431a7a3d3206c831e5b',
//       bvnVerificationOTP: 'd-18f1554533f14d91aa830ee3b452c824',
//       creditNotification: 'd-e40ed7bbf6c14139ac5b020336a93cd0',
//       addedToSplitBill: 'd-45fd6d13953e4c42b694fc71ff84c1a3',
//       addedToSharedCard: 'd-0073efee54064944859ae62582e01792',
//       settleBillNotification: 'd-af3e815e3e0c4b5ab932673b2bf5afd9',
//       settleBillReminder: 'd-35a1864730f04baead1cf4a1546dec81',
//       inviteNonUserToSplitBill: 'd-3f30d69d8f174b79831a61caaf2aab0c',
//       inviteNonUserToSharedCard: 'd-e6c586fb16cb4d448c92a7555639d184',
//       approveTierUpgradeRequest: 'd-6f80b3da500d4d3f96103f3d2617b467',
//       rejectTierUpgradeRequest: 'd-8669899ab05f4f10b1605e41b92ec284',
//     },
//   },

//   /**
//    * Used by winston logger
//    */
//   logs: {
//     level: process.env.LOG_LEVEL || 'silly',
//   },

//   /**
//    * Your secret sauce
//    */
//   jwtSecret: process.env.JWT_SECRET,
//   jwtAlgorithm: process.env.JWT_ALGORITHM,
//   jwtExpiresIn: process.env.JWT_EXPIRES_IN,
//   refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
//   refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
//   emailSecret: process.env.EMAIL_SECRET,

//   /**
//    * API configs
//    */
//   api: {
//     prefix: '/api/v1',
//     // prefix: '/mng/api/v1'
//   },

//   /**
//    * TERMII API configs
//    */
//   termii: {
//     apiKey: process.env.TERMII_API_KEY,
//     baseURL: process.env.TERMII_BASE_URL,
//     senderName: process.env.TERMII_SENDER_NAME,
//   },

//   /**
//    * MONO API configs
//    */
//   mono: {
//     testKey: 'test_sk_yFSQA8fk7ybrSKN9wXhZ',
//     secretKey: 'live_sk_AY2oKCK4cVZQKA4zrKJd',
//     secretKeyLookup: 'live_sk_xh7imw7c3cg478wmf09b',
//     baseURL: 'https://api.withmono.com',
//     // currenciesToNairaRate: {
//     // USD: 700, // IN KOBO
//     // GBP: 700, // IN KOBO
//     // EUR: 700, // IN KOBO
//     // other: 700, // IN KOBO
//     // },
//     currenciesToNairaRate: {
//       USD: 1533.65, // ₦1 533.65
//       GBP: 2099.24, // ₦2 099.24
//       EUR: 1795.46, // ₦1 795.46
//       other: 1533.65, // fallback to USD
//     },
//   },

//   /**
//    * Cloudinary configs
//    */
//   cloudinary: {
//     cloudName: 'dtkagtqlt',
//     apiKey: '143172111454658',
//     apiSecret: 'EuScKQvRGVPgsVuSImoOPVf-vJA',
//     uploadPresets: {
//       monigerSplitBills: 'monigerSplitBills',
//     },
//   },

//   /**
//    * Wallet configs
//    */

//   wallet: {
//     kuda: {
//       baseURL: {
//         test: 'https://kuda-openapi-uat.kudabank.com/v2',
//         production: 'https://kuda-openapi.kuda.com/v2',
//       },
//       apiKey: 'aLEVS8WPKYd1R6fOesNh',
//       apiEmail: 'chidi.n@babelos.net',
//     },
//     cowrywise: {
//       // >>>>>>>> TEST MODE START
//       // baseUrls: {
//       //   token: 'https://sandbox.embed.cowrywise.com',
//       //   main: 'https://sandbox.embed.cowrywise.com/api/v1'
//       // },

//       // client_id: 'CWRY-6xU7rASWOywLz6oxBsTqCR9ophc4M5cx5wSYDRXp',
//       // client_secret:
//       //   'CWRY-SECRET-m9AWTVdnujG4VUk1Z7hoJ03AtaZPvCHwrg55xGt74bO4heGXnRtjPvLHRC7m9yKkhAUKrIWRsL2i3hW1zzMlfIZp914hpyJRNmGHcGEuj9AccZpHAqhnpc389E4O9GAH'
//       // >>>>>>>> TEST MODE END

//       // >>>>>>>> LIVE MODE START
//       baseUrls: {
//         token: 'https://production.embed.cowrywise.com',
//         main: 'https://production.embed.cowrywise.com/api/v1',
//       },
//       client_id: 'CWRY-LIVE-VsS6NjI6q3sYqj6LjixlR6VNqG6jr50GU275AG6z',
//       client_secret:
//         'CWRY-LIVE-SECRET-PJWVX1Tg9nCCC67GuDijsoFSkanxoYslU2Ji5xzJ9gdlm0mcRlKcxprQhQ2Yvr9vrqvJo9KiA6u5xjJtKea8uJxCIDdn12d6DKMwsfFAtJWGBEioBLxFGcb8SeI1Z7C8',
//       // >>>>>>>> LIVE MODE END
//     },
//     providus: {
//       test: {
//         secrteKey: process.env.PROVIDUS_SECRET_KEY_TEST,
//         baseUrl: 'https://payment.xpress-wallet.com/api/v1',
//       },
//       live: {
//         secrteKey: process.env.PROVIDUS_SECRET_KEY_LIVE,
//         baseUrl: 'https://payment.xpress-wallet.com/api/v1',
//       },
//       anonymousAccount: {
//         anonymousCustomerID: `${process.env.ANONYMOUS_CUSTOMER_ID}`,
//       },
//     },

//     providusBillPayment: {
//       live: {
//         baseURL: 'http://154.113.166.30:5120',
//         monigerAccountNumber: '5401541163', // PROVIDUS BANK
//       },
//     },
//     baxiBillPayment: {
//       testMode: false,
//       test: {
//         baseURL: 'https://api.staging.baxibap.com',
//         apiKey: '8gVxC3EHJ+0PZL1wU1pKuZJ6pC1VD3tm8f+A65m/C3Q=',
//       },
//       live: {
//         baseURL: 'https://api.baxibap.com',
//         apiKey: 'drfcsJVQ8s13mQy9QsV/QFX8Mnm26rAqniVAwnQTYug=',
//       },
//     },
//   },

//   /**
//    * ANONYMOUS TRANSFER ACCOUNT
//    */
//   anonymousTransferAccount: {
//     trackingReference: '62e66fbfcecd3000c99cb773',
//     monigerAccountId: '62e66fbfcecd3000c99cb773',
//     email: 'josiah.a@babelos.net',
//     firstName: 'ANONYMOUS',
//     lastName: 'TRANSFER',
//     phone: '2349068851140',
//     accountNumber: '2040348818',
//   },

//   paystack: {
//     secret: 'sk_live_8af28be08eb6988155f074c0914cd9ad8469433f',
//     public: 'pk_live_ebe7e30b5b6850921152bce67d7def7b591df9f3',
//   },

//   /**
//    * KUDISMS API configs
//    */
//   kudiSms: {
//     baseURL: 'https://account.kudisms.net/api/',
//     baseURLV2: 'https://my.kudisms.net/api',
//     username: 'arksonjosiah@gmail.com',
//     password: 'Joechicag()1',
//     sender: 'Moniger App',
//     apiKey: 'sDOZUhFzAaTeL8G5SRxMvVHPImt27Yjwu43nCNpWXydq6o0lcB9fJiKrQ1Ebkg',
//     appNameCode: '2258008145',
//     otpTemplate: '5941603308',
//     passwordResetOTPTemplate: '4315213004',
//   },

//   /**
//    * BRIDGE CARD API configs
//    */

//   bridgeCard: {
//     tnxRefSubStrig: `moniger--d3a40147-`,
//     test: {
//       apiKeys: {
//         authToken:
//           'at_test_f082fd850d56475269d02988069d220f10f823b950c7cfcc5fb19c496739bfaa5e74835f0250ec0df3de12dc94841f63162eb2945c142da41f2fad2829be9264e38c979e75227903f38ff441bddfa4359b7841bfcdd5e5fc46c9af10a9f249ce261f4ecdfe1bfc978fdac3957a2d055d2a59293012cd7d2768b9f71197aae48785d0e8fb394670b5d0e4c00f07538904e3bcf497d8564d5bfc0345bc248e95c977c5e86e1fe3ad5bee5aacb5d148c15d3774b148844399b12ebd246947505b0db7524bbf688d3420d21f5838c2059d3d11a6ca2e3935f57a381a8015a2d436ec7dd8585acf59b6f9e29647fff766d46348c2331251e999ba795b8095bbbf7586',
//         secretKey:
//           'sk_test_VTJGc2RHVmtYMThBYmpQamdEa0hrNTlXR21PYUFlUnpHZUFDajk0SHJ0c2JmT2dCTWY1VmNEMDhxcUdVc1hDSG1Lell4TTN6RWVXLy9CbHFvakxwUlRSWGJ1T1Q3c1FsWVIwbFpQL3dCNmxldE1nSEh6RHp2dmZqdk9TZWF6TkNJNXlRbFhvSVl4NUp4NllpNW1CWXJIa0cxckNMVDBUZmxSWGFqVHdPbTlndDBybGdCZEIzd0V6ZHhxRTkyQlZ5UzljeGQ2MW5SV0RWZnN0VURFNXNiNkxjZE5sNWRRcVVObjRtVklQWTNoSWRtM09SclU1NTBIZXVLVEZVU3J3aWJ2ZmFyNGttNXFheE1OaG0ycnRPYUlXWDRvQXF4bjMyN1JOYWNRQXRjaVFLNjVlM3Z6dnMwc1d2d01Dek0zV1lmbXlqclB5TWE3Z0dlSVlYbUxRc2ZwV0d0V1l4aXJHZlJtYmNLdEMzNmJ0Y2M5TWVBMDAwM0xZcTN2SGNBbnRqUG5vV3pEcW5PZURkbWR0NXlYZSs4d1JSTnhKVzVVS3BTcURzbXlyUEg4cmhSYVFrRnZRcTkyUit0TGdLdXF1cWdGK1ltcGVjaDZnTFlRRklCd0REYkhPVHo4bElDL2pDZWJZTW5uWFB6YU09',
//         issuingId: 'd3a40147-0a96-480c-9b77-8812d6917044',
//       },
//       baseURL:
//         'https://issuecards-api-bridgecard-co.relay.evervault.com/v1/issuing/sandbox',
//     },

//     production: {
//       apiKeys: {
//         authToken:
//           'at_live_b66801a043e5d5616cb5978abc607c5110c0751d6c95254d72c876774acc9aceaa7ed59f2cf8a244878590447293a8a819172ed6947b8e0b42031838faae121d4984c0717c5dde114852a1878ed775e07c70ceeffc8265066d0ef1ee5d6bddbbc99fedf60d8631e358cb32243ec08bd3a613ba6c0e64c0d8232dfc83d8a6d98627fdb3371772f6b44f79565ca447a47317111d777a140e59c1fbcce9721d15bdca7561f9eb5d9fbb4ba7612d8ebbf875c79d87d5182f5b918910573a548b8296d2f14233116cd421d22956bb3366f06e4a65058c382c3551d99ce0b2fcea615d48b8f973f7f52fe5a53f96a83ce6b1c9fa9f18f51137edeba3e282002e4954b2',
//         secretKey:
//           'sk_live_VTJGc2RHVmtYMStoZk82MlByS2tEdHdVZkZhWTM3M29wdGhUT21sRk1iTlFncW5oeGV0T0NlVnFCakdUTEsxc1Fha1FHbm1nbFVMdG1QVXIxRG1iTkg2OVdHYjJ4a29GdU54TElrSGw3SnJzY2pyaEhmZEhIdVRWK0lsOGZ4NE12MExPclQ5S250NzIrQUpOcWVSR1pEcmJtY24rSGxhbGVYcFNmbWd2c0lVSTRYam1xY1k3anpPTUJISFR1SDlzdkpJblNqaFZFd1JaMlRPdDF2OHJnMVRtMjdCckx4R092cnFlL1F1TXFJcm9Oa0pBUXZUZnFXNkkyZ0dxbGF6MFhqVzY3aXNEUDJhN205OFFEY0R0LzdlZ25TOGlDV09qM3g3Q1BPeDFNU3lZV3UrckJJSmVrR1VKOEV4QzIvOERUQUlnVXROUkdlY3R3UFBWRjZlM1Jua3UvbTMwbVhDbWNnRzk0WVNiT1JKRy9iVGFMMXhRRmlIUzNIemRaY250RFpJL1JEZFNGdkhZQVNCSXNpNzlhNEF1QW9QNHdxZDFpRmlnTHRyMXpUM295eERVRWllOUlHUW1RU3M4WldpSnpRNjBrbHJLbnBFNmJ1bXBYcUhvemdRQng0K0hFelRQV0lHd2ZuK1pJYms9',
//         issuingId: 'd3a40147-0a96-480c-9b77-8812d6917044',
//         webhookSecrete:
//           'whsec_live_b05fef0a57a3f18ffd06972894ae3fd5b3270075f3a2f3a1c88c420ab1df5e5d057dc60d7ec066426ceaed142d65ca009f76d92981441e9e690a53d687fdce8791859090558b2f7de081c62fae27c72dbb052513e545e357da0d1f370d878f10eba7c1e532a848e0e70f2c7af3668cbcade35947603b4f47ea0d85b9e813b39f638beb0647b4dbd86a82aae06ac058df520f79248375c4488b2f3ea98be58a799a726cef506153274eb4a9eb3b7a767f73667c3d63b0ca2608ad5569d3722817c0bee24fb2b5c5a81f2eacb15d8b85609537d0df7143951a2b0cfe7dc9a0ea82e07eaa881bbe31aec70a83537ba3ea9a642bb62c7a0b6e683800a5556a1cc3cc',
//       },
//       baseURL: 'https://issuecards.api.bridgecard.co/v1/issuing',
//       descryptBaseURL:
//         'https://issuecards-api-bridgecard-co.relay.evervault.com/v1/issuing',
//     },
//   },

//   meta: {
//     whatsApp: {
//       phoneId: '478843411989236',
//       apiKey:
//         'EAAHiCO7CjtkBO6dVUBgiZCNeLoZAMHZCv5qZB610Q0WKI4FRIQsevrUyZABZADXyrygKgSWUqovJZBzsfLuFe94sQYsqMC0BIN3ZCB14SB7q6uF1nd3ZBIpHTLocH1xYeMqUjtKtOrZBvgdal5G9Xy9dgBnEqGImjS4hUKP8VTP7n7cymw6ZBMN0rZAD2WpJg9KNjtetbAZDZD',
//     },
//   },

//   sudoAfrica: {
//     test: {
//       apiKey: process.env.SUDO_AFRICA_API_KEY,
//       baseUrl: 'https://api.sandbox.sudo.cards',
//       collectionAccountId: '644ce3c1b525ad343594a43f',
//     },
//     production: {
//       apiKey: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVlNDE1NWRmYTFiMDM0NmU3ODI3M2QiLCJlbWFpbEFkZHJlc3MiOiJ1Lm90ZWhAbW9uaWdlci5jb20iLCJqdGkiOiI2N2Q4NDRiM2FkMjVkMWIxNzY0YzEzYmUiLCJtZW1iZXJzaGlwIjp7Il9pZCI6IjY1ZWU0MTU1ZGZhMWIwMzQ2ZTc4Mjc0MCIsImJ1c2luZXNzIjp7Il9pZCI6IjY0M2ZiOTkxMmEyZGRmNTMyNWE3MTQ1MiIsIm5hbWUiOiJNb25pZ2VyIiwiaXNBcHByb3ZlZCI6dHJ1ZX0sInVzZXIiOiI2NWVlNDE1NWRmYTFiMDM0NmU3ODI3M2QiLCJyb2xlIjoiQVBJS2V5In0sImlhdCI6MTc0MjIyNjYxMSwiZXhwIjoxNzczNzg0MjExfQ.nKOzCoNYNcJfHEsaRcaj2dWz7tffcw02v62cFR2sZxE`,
//       baseUrl: 'https://api.sudo.africa',

//       collectionAccountId: '64a5456908e2d6429ed46101',
//       collectionAccountName: 'SAFE HAVEN MICROFINANCE BANK',
//       collectionAccountNumber: '0112996363',
//       collectionAccountBankCodeKuda: '090286',
//     },
//   },
//   maplerad: {
//     isLive: true,
//     baseUrl: 'https://api.maplerad.com',
//     webhookSecretKey: `whsec_d35d9b6dee644c2daf47976d69b5b774`,
//     mode: function () {
//       return this.isLive ? 'live' : 'test';
//     },
//     secretKey: function () {
//       return this.isLive
//         ? `mpr_sk_26a8ea57-9885-4d62-bd22-298c1927a741`
//         : `mpr_sandbox_sk_4dafd2be-7bc3-4a40-aa00-8e0a314271d5`;
//     },
//   },
//   referralHero: {
//     uri: 'https://app.referralhero.com/api/v2',
//     api_token: '249ae59c591495e0804171ee18869e64ed1ce2da',
//     campaign_name: 'Moniger Launch',
//     uuid: 'MFa7887a375e',
//     domain: `https://moniger.com/signup/moniker`,
//     events: {
//       subscribe: `rhsubscriber.create`,
//       confirm_referral: `rgrefferal_confirm`,
//     },
//   },

//   // App Revenue data
//   AppRevenueData: {
//     Moniger_Premium: {
//       gold: { isPercentage: false, revenue: 500 },
//       black: { isPercentage: false, revenue: 1500 },
//     },
//     Transfers: { anonymous: { isPercentage: false, revenue: 100 } },
//     Cards: {
//       nairaCardIssuing: { isPercentage: false, revenue: 750 },
//       sharedNairaCardIssuing: { isPercentage: false, revenue: 950 },
//       nairaCardFunding: { isPercentage: false, revenue: 53.75 },
//       nairaCardWithdrawal: { isPercentage: false, revenue: 53.75 },
//       usdCardIssuing: { isInDollar: true, isPercentage: false, revenue: 1.5 },
//       usdCardTopupFee: { isPercentage: false, revenue: 20 },
//       usdCardTxnCharges: {
//         hundredDollarBellow: {
//           isInDollar: true,
//           isPercentage: false,
//           revenue: 0.5,
//         },
//         overHundredDollar: {
//           isInDollar: true,
//           isPercentage: true,
//           revenue: 1,
//         },
//         overFiveHundredDollar: {
//           isInDollar: true,
//           isPercentage: false,
//           revenue: 2.5,
//         },
//       },
//     },
//     Savings: { withdraw: { isPercentage: false, revenue: 5 } },

//     Airtime: {
//       mtn: { isPercentage: true, revenue: 2 },
//       '9mobile': { isPercentage: true, revenue: 3.5 },
//       airtel: { isPercentage: true, revenue: 2 },
//       glo: { isPercentage: true, revenue: 3.5 },
//     },

//     Data: {
//       mtn: { isPercentage: true, revenue: 2 },
//       '9mobile': { isPercentage: true, revenue: 3.5 },
//       airtel: { isPercentage: true, revenue: 2 },
//       glo: { isPercentage: true, revenue: 3.5 },
//     },

//     Electricity: {
//       ikeja_electric_prepaid: { isPercentage: true, revenue: 0.5 },
//       ikeja_electric_postpaid: { isPercentage: true, revenue: 0.5 },
//       ibadan_electric_prepaid: { isPercentage: true, revenue: 0.6 },
//       ibadan_electric_postpaid: { isPercentage: true, revenue: 0.6 },
//       eko_electric_prepaid: { isPercentage: true, revenue: 1 },
//       eko_electric_postpaid: { isPercentage: true, revenue: 1 },
//       kedco_electric_prepaid: { isPercentage: true, revenue: 0.6 },
//       kedco_electric_postpaid: { isPercentage: true, revenue: 0.6 },
//       kaduna_electric_prepaid: { isPercentage: true, revenue: 1.2 },
//       kaduna_electric_postpaid: { isPercentage: true, revenue: 1.2 },
//       jos_electric_prepaid: { isPercentage: true, revenue: 1 },
//       jos_electric_postpaid: { isPercentage: true, revenue: 1 },
//       portharcourt_electric_prepaid: { isPercentage: true, revenue: 1.2 },
//       portharcourt_electric_postpaid: { isPercentage: true, revenue: 1.2 },
//       abuja_electric_prepaid: { isPercentage: true, revenue: 0.92 },
//       abuja_electric_postpaid: { isPercentage: true, revenue: 0.92 },
//       enugu_electric_prepaid: { isPercentage: true, revenue: 1.8 },
//       enugu_electric_postpaid: { isPercentage: true, revenue: 1.8 },
//       benin_electric_prepaid: { isPercentage: true, revenue: 2.2 },
//       benin_electric_postpaid: { isPercentage: true, revenue: 2.2 },
//       aba_electric_prepaid: { isPercentage: true, revenue: 2.3 },
//       aba_electric_postpaid: { isPercentage: true, revenue: 2.3 },
//     },

//     TV_Subscription: {
//       dstv: { isPercentage: true, revenue: 1.5 },
//       gotv: { isPercentage: true, revenue: 1.5 },
//       startimes: { isPercentage: true, revenue: 1 },
//     },

//     Internet_Services: {
//       spectranet: { isPercentage: true, revenue: 3.2 },
//       smile: { isPercentage: true, revenue: 3 },
//     },

//     Betting_and_Lottery: { isPercentage: false, revenue: 0.0 },
//     'Examination/Education': { waec: { isPercentage: true, revenue: 6 } },

//     Others: {
//       lcc: { isPercentage: false, revenue: 50 },
//       bet9ja: { isPercentage: false, revenue: 0.0 },
//       RCCG_HQ: { isPercentage: false, revenue: 0.0 },
//       LivingFaith: { isPercentage: false, revenue: 0.0 },
//     },

//     calculatePercentage(amount: number, percentage: number) {
//       return (amount * percentage) / 100;
//     },
//   },

//   /**
//    * MixPanel API configs
//    */
//   mixpanel: {
//     apiToken: 'e83bb5bd8c5dccd1ebb164a9a8ed6eb9',
//   },
// });

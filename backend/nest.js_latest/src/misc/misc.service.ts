import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { MarketingUsers } from 'src/schemas/marketing.users.schema';
import { GoogleCloudService } from './google-cloud.service';
import config from 'src/config/email.config';
import { MailService } from 'src/mail/mail.service';

import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';
import { validateNamesWithNIN } from '@utils/general.utils';

@Injectable()
export class MiscService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(User.name)
    private UserModel: Model<User>,
    @InjectModel(MarketingUsers.name)
    private MarketingUsersModel: Model<MarketingUsers>,
    private readonly googleCloudService: GoogleCloudService,
  ) {}
  // Function to download an image from a URL
  async downloadImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download image.');
    }
  }

  async migrateAvater() {
    const usersid = [new Types.ObjectId('62d2a9d107d7a6a6130819bb')];
    const updatedUsers = [];

    const users = await this.UserModel.find({});

    for (const user of users) {
      if (user.avatar && !user.avatar.includes('storage.googleapis.com')) {
        try {
          // Step 1: Download the image from the avatar URL
          const imageBuffer = await this.downloadImage(user.avatar);

          // Step 2: Upload the image to GCS
          const gcsUrl = await this.googleCloudService.uploadImageToGCS(
            imageBuffer,
            user.avatar,
          );

          console.log(gcsUrl);

          // Step 3: Update the user object with the new GCS URL
          user.avatar = gcsUrl;

          await user.save();

          // Add the updated user to the results array
          updatedUsers.push(user._id);

          console.log(`Successfully migrated avatar for user: ${user.id}`);
        } catch (error) {
          console.error(`Failed to migrate avatar for user: ${user.id}`, error);

          await this.UserModel.updateOne(
            { _id: user._id }, // Find document by id
            { $unset: { avatar: 1 } }, // Unset the key
          ).then(() => {
            console.log(`avatar Key deleted for user: ${user.id}`);
          });
          // Optionally handle this (e.g., continue or stop)
          //   return {
          //     error: true,
          //     data: error,
          //     message: `Failed to migrate avatar for user: ${user.id}`,
          //   };
        }
      }
    }
    return {
      message: 'Successfully',
      error: false,
      updatedUsers,
    };
  }

  async createOnboardingObjectForUsers() {
    const updatedUsers = [];
    const users = await this.UserModel.find({});

    for (const user of users) {
      if (!user.hasVerifiedBVN) {
        const onboardingObject = {
          currentStage: 4,
          nextStage: 5,
          completed: false,
        };
        user.onboarding = onboardingObject;
      }
      if (!user.verifiedPhone) {
        const onboardingObject = {
          currentStage: 2,
          nextStage: 3,
          completed: false,
        };
        user.onboarding = onboardingObject;
      }
      if (!user.verifiedEmail) {
        const onboardingObject = {
          currentStage: 1,
          nextStage: 2,
          completed: false,
        };
        user.onboarding = onboardingObject;
      }
      await user.save();
    }

    return {
      message: 'Successfully',
      error: false,
    };
  }

  async marketingRegisterWebhook(body) {
    const { first_name, last_name, email, phone } = body;

    const newRecord = new this.MarketingUsersModel({
      first_name,
      last_name,
      email,
      phone,
    });

    await newRecord.save();
  }
  async marketingListUsers() {
    const mUsers = await this.MarketingUsersModel.find({}).sort({
      createdAt: -1,
    });

    // Extract all emails from the marketingUsers
    const emails = mUsers.map((user) => user.email);

    const usersFromUserModel = await this.UserModel.find(
      { email: { $in: emails } },
      { email: 1, lifecycle: 1 }, // Only fetch email and lifecycle fields
    );

    const emailToAccountMap = new Map();
    usersFromUserModel.forEach((user) => {
      emailToAccountMap.set(user.email, user.lifecycle);
    });

    const usersWithAccount = mUsers.map((user) => {
      const userObject = user.toObject(); // Convert Mongoose document to plain object
      return {
        ...userObject, // Spread the marketing user object
        lifecycle: emailToAccountMap.get(user.email) || null, // Attach account or null if not found
      };
    });

    return {
      error: false,
      message: 'Fetched users successfully',
      users: usersWithAccount,
    };
    // return { error: false, message: 'Fetched users successfully', users };
  }
  async sendTestEmail() {
    const email = 'chuksjimy@gmail.com';
    const name = 'chuks';
    const msg1 = {
      to: email,
      templateId: config.sendGrid.templateIds.welcomeGreeting,
      dynamicTemplateData: {
        fname: name,
      },
    };

    const onSendMail1 = this.mailService.sendMail(msg1, 'Welcome Greeting');

    // const msg = {
    //   to: email,
    //   templateId: config.sendGrid.templateIds.emailVerification,
    //   dynamicTemplateData: {
    //     fname: name,
    //     code: 'CODE',
    //   },
    // };

    // const onSendMail = this.mailService.sendMail(msg, 'Email Verification');

    await this.mailService.sendWelcomeEmail(email, name);

    return { error: false, message: 'succes' };
  }

  async parseCsv() {
    const fileName = 'marketing-users.csv'; // Name of the CSV file in the project root
    const processedData = [];
    const parsedData = await this.parseCsvFile(fileName);

    for (const row of parsedData) {
      const isMarketingUserAlready = await this.MarketingUsersModel.findOne({
        email: row.EMAIL,
      });

      if (!isMarketingUserAlready) {
        let has_registered_on_moniger = false;
        let user_registerd_at = null;

        const isMonigerUser = await this.UserModel.findOne({
          email: row.EMAIL,
        });

        if (isMonigerUser) {
          has_registered_on_moniger = true;
          // user_registerd_at = isMonigerUser.createdAt;
        }

        const newMarketingUser = new this.MarketingUsersModel({
          email: row.EMAIL,
          first_name: row.FIRST_NAME,
          last_name: row.LAST_NAME,
          phone: row.PHONE,
          has_registered_on_moniger,
        });
        await newMarketingUser.save;

        // const newMarketingUser =
        //   await this.MarketingUsersModel.findOneAndUpdate(
        //     { email: row.EMAIL },
        //     {
        //       first_name: row.FIRST_NAME,
        //       last_name: row.LAST_NAME,
        //       phone: row.PHONE,
        //       has_registered_on_moniger,
        //     },
        //     {
        //       new: true, // Return the updated document
        //       upsert: false, // Create a new document if no match is found
        //       setDefaultsOnInsert: true, // Apply default values if creating
        //     },
        //   );

        processedData.push({
          email: row.EMAIL,
          first_name: row.FIRST_NAME,
          last_name: row.LAST_NAME,
          phone: row.PHONE,
          created_at: new Date(row.CREATED_DATE),
        });
      }
    }
    return {
      total: parsedData.length,
      processed: processedData.length,
      processedData,
    };
  }

  async parseCsvFile(fileName: string): Promise<any[]> {
    const filePath = path.resolve(__dirname, '..', fileName); // Path to the file in the project root
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async updateIsMarketingUsers() {
    const marketingUsers = await this.MarketingUsersModel.find({}).lean();
    let updatedUsers = [];

    for (const marketingUser of marketingUsers) {
      // Check if the user exists in the User model
      const userExists = await this.UserModel.exists({
        email: marketingUser.email,
      });

      if (userExists) {
        // Update the `fromMarketing` key to `true` in the User model
        await this.UserModel.updateOne(
          { email: marketingUser.email }, // Filter by user ID
          { $set: { fromMarketing: true } }, // Update the `fromMarketing` field
        );

        updatedUsers.push(marketingUser.email);
        console.log(
          `Updated user ${marketingUser.email} with fromMarketing: true`,
        );
      } else {
        console.log(
          `User ${marketingUser.email} does not exist in the User model`,
        );
      }
    }

    return {
      error: false,
      message: 'updated users from marketing successfully',
      updatedUsers: updatedUsers.length,
    };
  }

  async validateNamesWithnin() {
    const firstName = 'EMMANUEL';
    const lastName = 'TARGULE';

    console.log(
      validateNamesWithNIN('Emmanuel', 'Targules', {
        firstName,
        lastName,
      }),
    );

    return {
      error: false,
    };
  }
}

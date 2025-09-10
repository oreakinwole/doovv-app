import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Expo from 'expo-server-sdk';
import mongoose, { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UserNotification } from 'src/schemas/userNotification.schema';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
// This token expires everytime
// const expo = new Expo({
//   accessToken: `${process.env.EXPO_ACCESS_TOKEN}`,
// });
const expo = new Expo();

@Injectable()
export class UserNotificationUtil {
  constructor(
    @InjectModel(UserNotification.name)
    private readonly UserNotificationModel: Model<UserNotification>,
  ) {}

  async savePushNotificationOnDatabase({ userId, notificationData }) {
    try {
      let foundDocument = await this.UserNotificationModel.findOne({
        user: userId,
      });

      if (!foundDocument) {
        foundDocument = new this.UserNotificationModel({
          user: userId,
          notifications: [],
        });

        await foundDocument.save()
      }

      //prevents race condition
      await foundDocument.updateOne({
        $push: {
          notifications: {
            $each: [notificationData],
            $position: 0,
          },
        },
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  // async savePushNotificationOnDatabase({ userId, notificationData }) {
  //   try {
  //     let foundDocument = await this.UserNotificationModel.findOne({
  //       user: userId,
  //     });

  //     if (!foundDocument) {
  //       foundDocument = new this.UserNotificationModel({
  //         user: userId,
  //         notifications: [],
  //       });
  //     }

  //     foundDocument.notifications.unshift(notificationData);
  //     await foundDocument.save();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async UseHandlePushTokens(data = []) {
    try {
      const messagesForExpoPush = [];
      // const messagesForDataBase = [];

      // setTimeout(async () => {
      //   const send = await axios.post(`https://exp.host/--/api/v2/push/send`, {
      //   to: data[0]?.pushToken,
      //   title: data[0]?.title,
      //   body: data[0]?.body
      // })
      // }, 5000);
      for (const item of data) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(item?.pushToken)) {
          console.error(
            `Push token ${item?.pushToken} is not a valid Expo push token`,
          );
          continue; 
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messagesForExpoPush.push({
          sound: 'default',
          to: item?.pushToken,
          title: item?.title,
          body: item?.body,
          data: { body: item?.body },
        });
        // NOTIFICATIONS ARE SENT DIRECTLY VIA EXPO PUSH
        // OPTIONALLY IF YOU WANT TO SAVE THE NOTIFICATION ON THE DATABSE, PASS THE 'shouldSaveNotificationToDatabase' OBJECT
        // THE 'shouldSaveNotificationToDatabase' OBJECT SHOULD HAVE 'navigateToScreen' & 'userId' properties.
        // SO THAT A USER CAN GO TO HIS NOTIFICATIONS SCREEN

        if (item.shouldSaveNotificationToDatabase) {
          await this.savePushNotificationOnDatabase({
            notificationData: {
              _id: new mongoose.Types.ObjectId(),
              title: item?.title,
              body: item?.body,
              navigateToScreen:
                item?.shouldSaveNotificationToDatabase?.navigateToScreen || '',
              navigateToScreenParams:
                item?.shouldSaveNotificationToDatabase
                  ?.navigateToScreenParams || {},
              createdAt: new Date(),
            },
            userId: item?.shouldSaveNotificationToDatabase?.userId,
          });
        }
      }

      // The Expo push notification service accepts batches of notifications so
      // that you don't need to send 1000 requests to send 1000 notifications. We
      // recommend you batch your notifications to reduce the number of requests
      // and to compress them (notifications with similar content will get
      // compressed).
      const chunks = expo.chunkPushNotifications(messagesForExpoPush);
      const tickets = [];

      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (const chunk of chunks) {
          try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
    } catch (error) {
      console.error(error);
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import configuration from 'src/config/configuration';

@Injectable()
export class WhatsAppMsgUtils {
  private readonly logger = new Logger(WhatsAppMsgUtils.name);

  // Helper method to construct the request payload
  private constructPayload(template: string, phone: string, code: string) {
    return {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: template,
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: code }],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{ type: 'text', text: code }],
          },
        ],
      },
    };
  }

  // Helper method to construct the request options
  private constructRequestOptions(phoneId: string, apiKey: string, data: any) {
    return {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      data: JSON.stringify(data),
    };
  }

  // Main method to make the API request
  private async makeMsgRequest(template: string, phone: string, code: string) {
    try {
      const config = configuration().meta.whatsApp;
      const { phoneId, apiKey } = config;
      console.log(phoneId, apiKey);

      const payload = this.constructPayload(template, phone, code);
      const options = this.constructRequestOptions(phoneId, apiKey, payload);

      const response = await axios(options);
      this.logger.log(`WhatsApp Message sent successfully to ${phone}`);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, phone);
      return {
        error: true,
        message: 'Failed to send WhatsApp message',
        details:
          (error as AxiosError).response?.data || (error as Error).message,
      };
    }
  }

  // Helper method to handle errors
  private handleError(error: AxiosError, phone: string) {
    if (error.response) {
      // The request was made and the server responded with a status code
      this.logger.error(
        `Failed to send WhatsApp message to ${phone}. Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    } else if (error.request) {
      // The request was made but no response was received
      this.logger.error(
        `No response received while sending WhatsApp message to ${phone}`,
      );
    } else {
      // Something happened in setting up the request
      this.logger.error(
        `Error setting up WhatsApp message request to ${phone}: ${error.message}`,
      );
    }
  }

  sendPhoneVerificationCode = async (phone: string, code: string) =>
    this.makeMsgRequest('phone_number_verification', phone, code);

  sendPasswordResetCode = async (phone: string, code: string) =>
    this.makeMsgRequest('password_reset', phone, code);
}

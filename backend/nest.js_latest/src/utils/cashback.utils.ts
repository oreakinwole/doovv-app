import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CashbackWallet } from 'src/schemas/cashback.schema';
import { CashbackTransaction } from 'src/schemas/cashback.transaction.schema';

@Injectable()
export class CashbackUtil {
  constructor(
    @InjectModel(CashbackWallet.name)
    private CashbackWalletModel: Model<CashbackWallet>,
    @InjectModel(CashbackTransaction.name)
    private CashbackTransactionModel: Model<CashbackTransaction>,
  ) {}
  Cashback_FundWallet = async (userId: string, amount: any, narration = '') => {
    const wallet = await this.Cashback_GetWallet(userId);

    const newBalance = wallet?.balance + parseFloat(amount);
    try {
      const cashbackWallet = await this.CashbackWalletModel.findOneAndUpdate(
        { user: userId },
        { balance: newBalance },
        {
          new: true, // Return the updated document
          upsert: false, // Create a new document if no match is found
          setDefaultsOnInsert: true, // Apply default values if creating
        },
      );
    } catch (e) {
      console.log(e);
    }

    await this.Cashback_CreateTransaction(
      userId,
      wallet?._id,
      amount,
      'credit',
      narration,
      '',
    );
    return true;
  };

  Cashback_DebitWallet = async (
    userId: string,
    amount: any,
    narration = '',
    debitType = '',
  ) => {
    const wallet = await this.Cashback_GetWallet(userId);

    if (amount > wallet?.balance) return false;

    const newBalance = wallet?.balance - amount;
    const cashbackWallet = await this.CashbackWalletModel.findOneAndUpdate(
      { user: userId },
      { balance: newBalance },
      {
        new: true, // Return the updated document
        upsert: false, // Create a new document if no match is found
        setDefaultsOnInsert: true, // Apply default values if creating
      },
    );

    await this.Cashback_CreateTransaction(
      userId,
      wallet?._id,
      amount,
      'debit',
      narration,
      debitType,
    );
    return true;
  };

  Cashback_CreateTransaction = async (
    userId: string,
    cashbackWallet: any,
    amount: any,
    type: string,
    narration: string,
    debitType: string,
  ) => {
    const transaction = new this.CashbackTransactionModel({
      user: userId,
      cashbackWallet,
      amount,
      narration,
      debitType,
      reference: `${new Date().getTime()}`,
      type,
    });
    await transaction.save();
    return transaction;
  };

  Cashback_GetWallet = async (
    userId,
  ): Promise<{
    _id: any;
    user: Types.ObjectId;
    balance: number;
  }> => {
    const cashbackWallet = await this.CashbackWalletModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {},
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if no match is found
        setDefaultsOnInsert: true, // Apply default values if creating
      },
    ).lean();
    return cashbackWallet;
  };
}

// import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { HttpException } from "@nestjs/common";
// import { Model } from "mongoose";
// import { WebSocket } from "ws";
// import { UserNotificationUtil } from "@utils/pushNotifications/user-notification.util";
// import { PriceAlerts } from "src/schemas/price.alerts.schema";
// import { SubscribeStocks } from "src/schemas/subscribed.stocks.schema";


// interface User {
//     _id: string;
//     expoPushNotificationToken: string;
// }


// @Injectable()
// export class WebsocketsService implements OnModuleInit, OnModuleDestroy {

//     private cache = {}
//     private socket: WebSocket

//     constructor(
//         private userNotificationUtil: UserNotificationUtil,
//         @InjectModel(PriceAlerts.name) private priceAlertsModel : Model<PriceAlerts>,
//         @InjectModel(SubscribeStocks.name) private subscribeStocksModel : Model<SubscribeStocks>
//     ) {}

//     onModuleInit() {
//         // this.connectToWebSocket()
//     }

//     async connectToWebSocket() {
//         this.socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_TOKEN}`)

//         this.socket.on('open', async () => {
//             console.log('Connected to Finnhub');

//             const symbols = await this.subscribeStocksModel.find({});
//             for (const { symbol } of symbols) {
//                 this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
//                 console.log(`Subscribe to ${symbol}`)
//             }
//         });


//         this.socket.on('message', async (event) => {

//             try {
//                 const result = JSON.parse(event.toString());
//                 if (result.type === 'ping') return;


//                 if (result.data) {
//                     const stocks = {};

//                     for (const stock of result.data) {
//                         const cachedPrice = this.cache[stock.s] || 0;

//                         if (cachedPrice !== stock.p) {
//                             this.cache[stock.s] = stock.p;
//                             stocks[stock.s] = stock.p;
//                         }
//                     }


//                     if (Object.keys(stocks).length > 0) {
//                         await this.sendPriceAlertsNotifications(stocks);
//                     }
//                 }

//             } catch (error) {
//                 console.error('WebSocket Error:', error);
//                 throw new HttpException('Socket error', 500);
//             }
//         });


//         this.socket.on('close', (code, reason) => {
//             console.log(`WebSocket closed: ${code} - ${reason}`);
//         });


//         this.socket.on('error', (error) => {
//             console.error('WebSocket Error:', error);
//         });

//     }

//     async sendPriceAlertsNotifications(stocks: Record<string, any>) {
//         // Find users subscribed to symbols where price exceeds max or is below min
//         const priceAlerts = await this.priceAlertsModel.find({
//             subscribed: true,
//             notified: false,
//             $or: Object.entries(stocks).map(([symbol, price]) => ({
//                 symbol,
//                 $or: [
//                     { max_amount: { $lt: price } },
//                     { min_amount: { $gt: price } }
//                 ]
//             }))
//         }).populate<{ user: User }>('user', 'expoPushNotificationToken');

//         if (!priceAlerts.length) return;

//         //creates notification message for each price alert
//         const notifications = priceAlerts.map(({
//             symbol, 
//             min_amount, 
//             max_amount, 
//             user
//         }) => {

//             const amount = this.cache[symbol];
    
//             // returns amount that triggered the alert
//             const limit = amount > max_amount ? max_amount : min_amount;
//             const direction = amount > limit? 'above' : 'below';
    
//             return {
//                 pushToken: user.expoPushNotificationToken,
//                 title: `📈 Stock Alert: ${symbol} Hits $${amount.toFixed(2)}!`,
//                 body: `${symbol} is currently ${direction} your limit of $${limit}`,
//                 shouldSaveNotificationToDatabase: {
//                     navigateToScreen: 'Home',
//                     userId: user._id,
//                 },
//             };
//         })
        

//         await this.userNotificationUtil.UseHandlePushTokens(notifications);
       
//         await this.priceAlertsModel.updateMany(
//             { _id: { $in: priceAlerts.map(p => p._id) } },
//             { $set: { notified: true } }
//         );
//     }

//     async SubscribeStock(symbol: string) {
//         try {
//             const symbols = await this.subscribeStocksModel.find({})

//             if (symbols.some(s => s.symbol === symbol)) return;

//             if (symbols.length >= 50) {
//                 throw new HttpException({
//                     message: 'Stock subscription limit reached', 
//                     stocks: symbols
//                 }, 429)
//             }
        
//             if (this.socket.readyState === WebSocket.OPEN) {
//                 this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
                
//             } else {
//                 this.socket.addEventListener('open', () => {
//                     this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
//                 }, { once: true });
//             }

//             await this.subscribeStocksModel.create({ symbol })

//         } catch (error) {
//             throw error
//         }
//     }
    
//     async UnsubscribeStocks(symbols: string[]) {
//         try {
//             const stockSymbols = await this.subscribeStocksModel.find({})
//             const stockSymbolStrings = stockSymbols.map(stock => stock.symbol);

//             if (symbols.length === 0)
//                 symbols = stockSymbolStrings

//             for (const symbol of symbols) {
//                 this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
//             }

//         } catch(error) {
//             throw error
//         }
//     }

//     onModuleDestroy() {
//         if (this.socket) {
//             this.socket.close();
//         }
//     }
// }

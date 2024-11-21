import { PaymentApp } from './app';
import { MercadoPago } from './external/mercado-pago-payment.external';
import { PrismaDatabase } from './external/prisma-database.external';
import { SNSMessaging } from './external/sns-messaging.external';

const database = new PrismaDatabase();
const externalPayment = new MercadoPago();
const messaging = new SNSMessaging();

const app = new PaymentApp(database, externalPayment, messaging);

app.start();

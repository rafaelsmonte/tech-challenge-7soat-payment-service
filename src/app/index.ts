import { NextFunction, Request, Response } from 'express';
import promMid from 'express-prometheus-middleware';
import { PaymentController } from '../controllers/payment.controller';
import { IDatabase } from '../interfaces/database.interface';
import { IExternalPayment } from '../interfaces/external-payment.interface';
import { IMessaging } from '../interfaces/messaging.interface';
import { createHmac } from 'crypto';
import { InvalidPaymentStatusError } from 'src/errors/invalid-payment-status.error';
import { IncorrectPaymentActionError } from 'src/errors/incorrect-payment-action.error';
import { DatabaseError } from 'src/errors/database.error';
import { PaymentError } from 'src/errors/payment.error';

export class PaymentApp {
  constructor(
    private database: IDatabase,
    private payment: IExternalPayment,
    private messaging: IMessaging,
  ) {}

  start() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const swaggerUi = require('swagger-ui-express');

    const port = 3000;
    const app = express();

    app.use(bodyParser.json());

    // Metrics
    app.use(
      promMid({
        metricsPath: '/metrics',
        collectDefaultMetrics: true,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
        requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
        responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      }),
    );

    // Swagger
    const options = require('./swagger.json');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(options));

    // Payment endpoints
    // app.get();

    // Mercado Pago Webhook
    app.post(
      '/payment',
      async (req: Request, res: Response, next: NextFunction) => {
        const { query } = req;
        const dataID = query['data.id'] as string;
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];

        try {
          const secret: string = process.env.MERCADO_PAGO_SECRET || '';

          if (!xSignature || !xRequestId) {
            return res
              .status(401)
              .json({ message: 'Failed to check payment source' });
          }
          if (Array.isArray(xSignature)) {
            return res
              .status(401)
              .json({ message: 'Failed to check payment source' });
          }

          const parts = xSignature.split(',');

          let ts: string | undefined;
          let hash: string | undefined;

          parts.forEach((part) => {
            const [key, value] = part.split('=').map((str) => str.trim());
            if (key === 'ts') {
              ts = value;
            } else if (key === 'v1') {
              hash = value;
            }
          });

          if (!ts || !hash) {
            return res
              .status(401)
              .json({ message: 'Failed to check payment source' });
          }

          const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
          const hmac = createHmac('sha256', secret);
          hmac.update(manifest);
          const sha = hmac.digest('hex');

          if (sha === hash) return next();
          return res
            .status(500)
            .json({ message: 'Failed to check payment source' });
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'Failed to check payment source' });
        }
      },
      async (request: Request, response: Response) => {
        const paymentId = Number(request?.body?.data?.id);
        const action = request?.body?.action;

        if (action !== 'payment.updated')
          return response.status(500).json({ message: 'Invalid Action' });

        await PaymentController.updateStatusOnPaymentReceived(
          this.database,
          this.payment,
          this.messaging,
          paymentId,
        )
          .then(() => {
            response
              .setHeader('Content-type', 'application/json')
              .status(200)
              .send();
          })
          .catch((error) => this.handleError(error, response));
      },
    );

    app.listen(port, () => {
      console.log(`Tech challenge app listening on port ${port}`);
    });
  }

  handleError(error: Error, response: Response): void {
    if (error instanceof InvalidPaymentStatusError) {
      response.status(400).json({ message: error.message });
    } else if (error instanceof IncorrectPaymentActionError) {
      response.status(400).json({ message: error.message });
    } else if (error instanceof DatabaseError) {
      response.status(500).json({ message: error.message });
    } else if (error instanceof PaymentError) {
      response.status(500).json({ message: error.message });
    } else {
      console.log('An unexpected error has occurred: ' + error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

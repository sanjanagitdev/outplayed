import Paypal from 'paypal-rest-sdk';
try {
  Paypal.configure({
    host: 'api.sandbox.paypal.com',
    mode: process.env.PAYPAL_MODE, //sandbox or live
    client_id: process.env.PAY_PAL_CLIENT_ID,
    client_secret: process.env.PAY_PAL_CLIENT_SECRET,
  });
} catch (e) {
  console.log('error in paypal configuration', e);
}

export const InitilizeWebHook = () => {
  try {
    const create_webhook_json = {
      url: 'http://15.188.166.158:3001',
      event_types: [
        {
          name: 'PAYMENT.AUTHORIZATION.CREATED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.EXPIRED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.CREATED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.CANCELLED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.ACTIVATED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.SUSPENDED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.RENEWED',
        },
        {
          name: 'BILLING.SUBSCRIPTION.UPDATED',
        },
      ],
    };

    Paypal.notification.webhook.create(
      create_webhook_json,
      function (error, webhook) {
        if (error) {
          console.log(error.response);
          return error;
        } else {
          console.log('Create webhook Response');
          console.log(webhook);
          return webhook;
        }
      }
    );
  } catch (e) {
    return e;
  }
};

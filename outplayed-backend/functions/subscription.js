import Paypal from 'paypal-rest-sdk';
import url from 'url';
import { server, client } from '../config/keys';
import userModel from '../models/user';

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

export const Create_Paypal_Recurring_Agreement = async (req, res) => {
  const {
    body: {
      plannData: { planname, price, membershipType, cycle },
      tokenData: { userid },
    },
  } = req;
  let d = new Date(Date.now() + 1 * 60 * 1000);
  d.setSeconds(d.getSeconds() + 4);
  let isDate = d.toISOString();
  let isoDate = isDate.slice(0, 19) + 'Z';
  let billingPlanAttributes = {
    description: planname,
    merchant_preferences: {
      auto_bill_amount: 'yes',
      cancel_url: `${server}/api/user-route-handler/subscriptioncancel`,
      initial_fail_amount_action: 'continue',
      max_fail_attempts: '1',
      return_url: `${server}/api/user-route-handler/subscriptionsuccess`,
      setup_fee: {
        currency: 'EUR',
        value: 0,
      },
    },
    name: 'Paypal Agreement',
    payment_definitions: [
      {
        amount: {
          currency: 'EUR',
          value: `${price}`,
        },
        charge_models: [],
        cycles: '0',
        frequency: 'MONTH',
        frequency_interval: cycle,
        name: 'Regular Payments',
        type: 'REGULAR',
      },
    ],
    type: 'INFINITE',
  };

  //Once a billing plan is created it must be updated with the following attributes.
  let billingPlanUpdateAttributes = [
    {
      op: 'replace',
      path: '/',
      value: {
        state: 'ACTIVE',
      },
    },
  ];
  //Attributes for creating the billing agreement.
  //Start Date should be greater than current time and date.
  let desobj = {
    planname: planname,
    cycle: cycle,
  };
  let billingAgreementAttributes = {
    name: 'Name of Payment Agreement',
    description: `${desobj}`,
    start_date: isoDate,
    plan: {
      id: '',
    },
    payer: {
      payment_method: 'paypal',
    },
  };
  //Creating the billing plan and agreement of payment.
  //Step 6:
  Paypal.billingPlan.create(
    billingPlanAttributes,
    async (error, billingPlan) => {
      if (error) {
        console.log('here', error.response.details);
      } else {
        //Step 7:
        Paypal.billingPlan.update(
          billingPlan.id,
          billingPlanUpdateAttributes,
          async (error, response) => {
            if (error) {
              console.log(error);
              res.send({
                code: 444,
                msg: 'Unexpected error !!',
              });
            } else {
              // update the billing agreement attributes before creating it.
              billingAgreementAttributes.plan.id = billingPlan.id;
              //Step 8:
              Paypal.billingAgreement.create(
                billingAgreementAttributes,
                async (error, billingAgreement) => {
                  if (error) {
                    console.log('here 2', error);
                    res.send({
                      code: 444,
                      msg: 'Unexpected error !!',
                    });
                  } else {
                    let getUrl = billingAgreement.links[0].href;
                    const queryObject = url.parse(getUrl, true).query;
                    await userModel.updateOne(
                      {
                        _id: userid,
                      },
                      {
                        $push: {
                          membership_tokenid: queryObject.token,
                        },
                        plan: membershipType,
                      }
                    );

                    for (let i = 0; i < billingAgreement.links.length; i++) {
                      if (billingAgreement.links[i].rel === 'approval_url') {
                        res.send({
                          code: 200,
                          link: billingAgreement.links[i].href,
                          msg: 'success',
                        });
                      }
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};
export const PaymentSuccess = async (req, res) => {
  const token = req.query.token;
  Paypal.billingAgreement.execute(token, async (error, billingAgreement) => {
    try {
      let checkExitssub = await userModel
        .findOne(
          { membership_tokenid: token },
          {
            plan: 1,
            _id: 0,
          }
        )
        .lean();
      let { plan } = checkExitssub;
      if (plan === 'premium') {
        await userModel.updateOne(
          {
            membership_tokenid: token,
          },
          {
            $push: {
              subscription_data: billingAgreement,
            },
            ispremium: true,
          }
        );
      }
      if (plan === 'advance') {
        await userModel.updateOne(
          {
            membership_tokenid: token,
          },
          {
            $push: {
              subscription_data: billingAgreement,
            },
            ispremiumadvnaced: true,
          }
        );
      }
      res.redirect(`${client}`);
    } catch (e) {
      console.log('First =>> ', e);
      res.redirect(`${client}/?status=failed`);
    }
  });
};

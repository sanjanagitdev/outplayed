// 1. Set up your server to make calls to PayPal
// 1a. Import the SDK package
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();
// 1b. Add your client ID and secret -
const PAYPAL_CLIENT = process.env.PAY_PAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAY_PAL_CLIENT_SECRET;
// 1c. Set up the SDK client
const env = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT, PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(env);

// 2. Set up your server to receive a call from the client
export const handleRequest = async (data) => {
    // 3. Call PayPal to set up a transaction with payee
    const { amount, email_address } = data;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "EUR",
                    value: amount,
                },
                payee: {
                    email_address: email_address,
                },
            },
        ],
    });

    let order;
    try {
        order = await client.execute(request);
    } catch (err) {
        console.log("order =>>", err);
        // 4. Handle any errors from the call
        return err;
    }
    // 5. Return a successful response to the client with the order ID
    await captureOrder(order.result.id);
    console.log("order =>>", order);
    return order;
};

let captureOrder = async (orderId) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);
};

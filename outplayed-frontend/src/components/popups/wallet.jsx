import React from "react";
import Select from 'react-select';
import { Form } from "react-bootstrap";
import PopupWrapper from "./popupwrapper";
import countryList from 'react-select-country-list';

const Wallet = ({ wallet, showWalllet, deposit, withdraw, transaction, step, props }) => {
  return (
    <PopupWrapper
      show={wallet}
      handleClose={showWalllet}
      defaultClass={"wallet-popup"}
    >
      {deposit && <WalletPopup
        handleClose={showWalllet}
        props={props}
      />}
      {withdraw && <Withdraw step={step} props={props} />}
      {transaction && <Transactions {...props} />}
    </PopupWrapper>
  );
};
export default Wallet;

const WalletPopup = ({ handleClose, props: { HandleDeposit, setAmount, onsiteWallet } }) => {
  return (
    <div className="wallet-popup">
      <div className="closing-icon">
        <i className="fa fa-times" aria-hidden="true" onClick={handleClose} />
      </div>
      <div className="deposit-layout">
        <div className="wallet-amt">
          <h6>Wallet</h6>
          <i className="fa fa-info-circle" aria-hidden="true"></i>
        </div>
        <div className="wallet-total">
          <h6>${onsiteWallet ? onsiteWallet : 0}</h6>
          <p>Available</p>
        </div>
        <div className="deposit-text">
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Enter your Amount</Form.Label>
            <Form.Control type="text" placeholder="Please enter amount !!" onChange={(e) => setAmount(e.target.value)} />
          </Form.Group>
        </div>
        <div className="deposit-button">
          <button
            type="submit"
            className="btn deposit-btn"
            onClick={HandleDeposit}
          >
            deposit
          </button>
          <button type="submit" className="btn withdraw-btn" onClick={() => handleClose('withdraw')}>
            Withdraw
          </button>
        </div>
        <div className="view-transaction" onClick={() => handleClose('transaction')}>
          <h6>view All Transactions</h6>
        </div>
      </div>

      {/* your transaction */}

      {/* <Transactions /> */}
    </div>
  );
};

const Withdraw = ({ step, props }) => {
  return <>
    <div className="withdraw-layout">
      <div className="withdraw-box">
        <h1>Withdraw</h1>
        <div className="withdraw-multistep">
          <div className={`choose-amt active ${step > 0 && 'active'}`}>
            <h6>Choose Amount</h6>
          </div>
          <div className={`choose-amt ${step > 1 && 'active'}`}>
            <h6>Personal Info</h6>
          </div>
          <div className={`choose-amt ${step > 2 && 'active'}`}>
            <h6>Payment Method</h6>
          </div>
          <div className={`choose-amt ${step > 3 && 'active'}`}>
            <h6>Verify</h6>
          </div>
        </div>
        <MultiStepWithdrawPopup step={step} props={props} />
      </div>
    </div>
  </>
}

const MultiStepWithdrawPopup = ({ step, props }) => {
  switch (step) {
    case 0:
      return <FirstInfo {...props} />
    case 1:
      return <PersonalInfo  {...props} />
    case 2:
      return <PaymentMethod  {...props} />
    case 3:
      return <Verify  {...props} />
    default:
      return <></>;
  }
}


const FirstInfo = ({ setStep, amount, onsiteWallet }) => {
  onsiteWallet = onsiteWallet ? onsiteWallet : 0
  const feeAmount = amount * 2 / 100;
  const exactAmount = amount - feeAmount;
  return <>
    <div className="choose-amount-section">
      <div className="amount-box">
        <h6>${amount}</h6>
        <p>Withdraw Amount</p>
      </div>
      <div className="amount-box">
        <h6>${feeAmount ? feeAmount : 0}</h6>
        <p>Transaction fee</p>
      </div>
      <div className="amount-box">
        <h6>${exactAmount}</h6>
        <p>Your Payout</p>
      </div>
    </div>
    {onsiteWallet < 10 && <div className="enough-balance">
      <div className="money-icon">
        <i class="fa fa-money" aria-hidden="true"></i>
      </div>
      <h6>Not Enough Balance</h6>
      <p>you need atleast $10.00 in your wallet to make a withdraw</p>
    </div>}

    <div className="withdraw-bottom">
      <button type="submit" className="btn btn-cancel">
        Cancel
            </button>
      <button type="submit" className="btn btn-continue" disabled={onsiteWallet < 10} onClick={() => setStep(pre => pre + 1)}>
        continue
            </button>
    </div>
  </>
}

const PersonalInfo = ({ setStep, HandleChangeForWithdraw, handlePresnoalDetailsData, errors }) => {

  const countrylist = countryList().getData();

  const changeHandler = country => {
    HandleChangeForWithdraw({ target: { value: country, name: 'country' } });
  }

  return <>
    <div className="withdraw-personal-info">
      <h6>Personal Information</h6>
      <p>Fill your personal information to continue</p>
      <div className="info-form">
        <form>
          <div className="half">
            <Form.Group controlId="formBasicloginone">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstname"
                onChange={HandleChangeForWithdraw}
              />
              {errors.firstname && <Form.Text className="text-danger">
                {errors.firstname}
              </Form.Text>}
            </Form.Group>

            <Form.Group controlId="formBasicloginone">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastname"
                onChange={HandleChangeForWithdraw}
              />
              {errors.lastname && <Form.Text className="text-danger">
                {errors.lastname}
              </Form.Text>}
            </Form.Group>
          </div>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Birth of Date"
              name="dob"
              onChange={HandleChangeForWithdraw}
            />
            {errors.dob && <Form.Text className="text-danger">
              {errors.dob}
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Street Name</Form.Label>
            <Form.Control type="text" placeholder="Street" name="street" onChange={HandleChangeForWithdraw} />
            {errors.street && <Form.Text className="text-danger">
              {errors.street}
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Zip Coide and City</Form.Label>
            <Form.Control type="text" placeholder="zip code city" name="zipcodeCity" onChange={HandleChangeForWithdraw} />
            {errors.zipcodeCity && <Form.Text className="text-danger">
              {errors.zipcodeCity}
            </Form.Text>}
          </Form.Group>

          <Form.Group controlId="formBasicloginone">
            <Form.Label>Country: </Form.Label>
            <div className="country-dropdown">
              <Select
                options={countrylist}
                onChange={changeHandler}
              />
              {errors.country && <Form.Text className="text-danger">
                {errors.country}
              </Form.Text>}
            </div>

          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Currency</Form.Label>
            <Form.Control as="select" name={'currency'} onChange={HandleChangeForWithdraw}>
              <option>EUR</option>
            </Form.Control>
            {errors.currency && <Form.Text className="text-danger">
              {errors.currency}
            </Form.Text>}
          </Form.Group>
          <Form.Group controlId="formBasicloginone">
            <Form.Label>Phone number</Form.Label>
            <Form.Control type="text" placeholder="title" name={'phone'} onChange={HandleChangeForWithdraw} />
            {errors.phone && <Form.Text className="text-danger">
              {errors.phone}
            </Form.Text>}
          </Form.Group>
        </form>
        <div className="withdraw-bottom">
          <button type="submit" className="btn btn-cancel" onClick={() => setStep(pre => pre - 1)}>
            Previous
            </button>
          <button type="submit" className="btn btn-continue" onClick={() => handlePresnoalDetailsData()}>
            continue
            </button>
        </div>
      </div>
    </div>
  </>
}
const PaymentMethod = ({ setStep, paypalAccount }) => {
  return <div className="payment-method">
    <h6> Payment Method</h6>
    <p>Select the payment method you want to use</p>
    {console.log("paypalAccount", paypalAccount)}
    <div className="payment-option">
      <i class="fa fa-check-circle" aria-hidden="true"></i>
      <h6><i class="fa fa-paypal" aria-hidden="true"></i> PayPal</h6>
    </div>
    <p>How do I remove or change my PayPal Account?</p>
    <div className="withdraw-bottom">
      <button type="submit" className="btn btn-cancel" onClick={() => setStep(pre => pre - 1)}>
        Previous
            </button>
      <button type="submit" className="btn btn-continue" onClick={() => setStep(pre => pre + 1)}>
        continue
            </button>
    </div>
  </div>
}

const Transactions = ({ transactions, onsiteWallet }) => {
  console.log(transactions);
  return <div className="payment-transaction-layout">
    <h6>Your transactions</h6>
    <div className="transaction-section">
      <div className="wallet-payment">
        <h6>Wallet</h6>
        <div className="wallet-box">
          <h6>${onsiteWallet}</h6>
          <p>Available</p>
          <div className="withdraw-bottom">
            <button type="submit" className="btn btn-cancel">
              Deposit
      </button>
            <button type="submit" className="btn btn-continue">
              Withdraw
      </button>
          </div>
        </div>
      </div>
      <div className="wallet-transaction">
        <h6>Transactions</h6>
        {transactions && transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((el, i) => {
          return <div className="transaction-box" index={i}>
            <div className="transaction-left">
              <p>{new Date(el.date).toLocaleString()}</p>
              {el.type === 'withdraw' ? <p>Payout <span>{el.state}</span></p> : <p>Deposit <span>{el.state}</span></p>}
              <p>{el.id}</p>
            </div>
            <div className="transaction-right">
              <h6>{el.total}</h6>
              {/* <button type="submit" className="btn btn-report">Report</button> */}
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
}

const Verify = ({ setStep, SubmitWithdrawRequest, withdrawState: {
  firstname,
  lastname,
  dob,
  street,
  zipcodeCity,
  country,
  currency,
  phone } }) => {
  return <>
    <div className="verify-details">
      <div className="verify-name">
        <h5>Name:</h5>
        <h6>{firstname + lastname}</h6>
      </div>
      <div className="verify-name">
        <h5>DOB:</h5>
        <h6>{dob}</h6>
      </div>
      <div className="verify-name">
        <h5>Street Name:</h5>
        <h6>{street}</h6>
      </div>
      <div className="verify-name">
        <h5>Zip code & City:</h5>
        <h6>{zipcodeCity}</h6>
      </div>
      <div className="verify-name">
        <h5>Country:</h5>
        <h6>{country ? country.label : ''}</h6>
      </div>
      <div className="verify-name">
        <h5>Currency:</h5>
        <h6>{currency}</h6>
      </div>
      <div className="verify-name">
        <h5>Phone Number:</h5>
        <h6>{phone}</h6>
      </div>
    </div>

    <div className="withdraw-bottom">
      <button type="submit" className="btn btn-cancel" onClick={() => setStep(pre => pre - 1)}>
        Previous
            </button>
      <button type="submit" className="btn btn-continue" onClick={SubmitWithdrawRequest}>
        Submit
      </button>
    </div>
  </>
}
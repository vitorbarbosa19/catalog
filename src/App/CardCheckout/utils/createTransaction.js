/* eslint-disable no-nested-ternary */
import axios from "axios";

const createTransaction = async ({ sellerZoopId, charge, cardholder, month, year, number, cvv, installments, seller, sellerZoopPlan }) => {
    const { percentageAntiFraud, amountAntiFraud } =
        Object.prototype.hasOwnProperty.call(sellerZoopPlan, "antiFraud") && sellerZoopPlan.antiFraud
            ? sellerZoopPlan.antiFraud
            : { percentage: 0, amount: 0 };

    // console.log("sellerZoopPlan", sellerZoopPlan);
    const { percentageMarkup, amountMarkup } = sellerZoopPlan.markup || {
        percentage: 0,
        amount: 0,
    };
    const url = `${process.env.PAY}/payments-create`;
    const method = "POST";
    const headers = {
        Authorization: `Basic ${process.env.PAY_TOKEN}`,
    };
    const data =
        sellerZoopPlan.insurance && (percentageAntiFraud || amountAntiFraud)
            ? percentageMarkup || amountMarkup
                ? {
                      payment_type: "credit",
                      capture: false,
                      on_behalf_of: sellerZoopId,
                      source: {
                          usage: "single_use",
                          amount: charge,
                          currency: "BRL",
                          type: "card",
                          card: {
                              holder_name: cardholder,
                              expiration_month: month,
                              expiration_year: year,
                              card_number: number,
                              security_code: cvv,
                          },
                      },
                      installment_plan: {
                          mode: "interest_free",
                          number_installments: installments,
                      },
                      split_rules: [
                          {
                              recipient: process.env.SELLER_ID_ZIRO,
                              percentage: sellerZoopPlan.antiFraud.percentage || 0,
                              amount: sellerZoopPlan.antiFraud.amount || 0,
                              liable: true,
                              charge_processing_fee: false,
                          },
                          {
                              recipient: process.env.SELLER_ID_ZIRO,
                              percentage: sellerZoopPlan.markup.percentage || 0,
                              amount: sellerZoopPlan.markup.amount || 0,
                              liable: true,
                              charge_processing_fee: false,
                          },
                      ],
                      statement_descriptor: `${seller}`,
                  }
                : {
                      payment_type: "credit",
                      capture: false,
                      on_behalf_of: sellerZoopId,
                      source: {
                          usage: "single_use",
                          amount: charge,
                          currency: "BRL",
                          type: "card",
                          card: {
                              holder_name: cardholder,
                              expiration_month: month,
                              expiration_year: year,
                              card_number: number,
                              security_code: cvv,
                          },
                      },
                      installment_plan: {
                          mode: "interest_free",
                          number_installments: installments,
                      },
                      split_rules: [
                          {
                              recipient: process.env.SELLER_ID_ZIRO,
                              percentage: sellerZoopPlan.insurance === true ? sellerZoopPlan.antiFraud.percentage : 0,
                              amount: sellerZoopPlan.insurance === true ? sellerZoopPlan.antiFraud.amount : 0,
                              liable: true,
                              charge_processing_fee: false,
                          },
                      ],
                      statement_descriptor: `${seller}`,
                  }
            : percentageMarkup || amountMarkup
            ? {
                  payment_type: "credit",
                  capture: false,
                  on_behalf_of: sellerZoopId,
                  source: {
                      usage: "single_use",
                      amount: charge,
                      currency: "BRL",
                      type: "card",
                      card: {
                          holder_name: cardholder,
                          expiration_month: month,
                          expiration_year: year,
                          card_number: number,
                          security_code: cvv,
                      },
                  },
                  installment_plan: {
                      mode: "interest_free",
                      number_installments: installments,
                  },
                  split_rules: [
                      {
                          recipient: process.env.SELLER_ID_ZIRO,
                          percentage: sellerZoopPlan.insurance === true ? sellerZoopPlan.markup.percentage : 0,
                          amount: sellerZoopPlan.insurance === true ? sellerZoopPlan.markup.amount : 0,
                          liable: true,
                          charge_processing_fee: false,
                      },
                  ],
                  statement_descriptor: `${seller}`,
              }
            : {
                  payment_type: "credit",
                  capture: false,
                  on_behalf_of: sellerZoopId,
                  source: {
                      usage: "single_use",
                      amount: charge,
                      currency: "BRL",
                      type: "card",
                      card: {
                          holder_name: cardholder,
                          expiration_month: month,
                          expiration_year: year,
                          card_number: number,
                          security_code: cvv,
                      },
                  },
                  installment_plan: {
                      mode: "interest_free",
                      number_installments: installments,
                  },
                  statement_descriptor: `${seller}`,
              };
    const { data: result } = await axios({ url, method, headers, data });
    // console.log("result", result);
    return result;
};

export default createTransaction;

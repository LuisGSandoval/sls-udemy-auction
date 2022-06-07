import AWS from "aws-sdk";
import commonMidleware from "../lib/commonMidleware";
import createError from "http-errors";

const db = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: { ":amount": amount },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;
  try {
    const result = await db.update(params).promise();
    updatedAuction = result;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 204,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMidleware(placeBid);

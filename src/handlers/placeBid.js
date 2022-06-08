import AWS from "aws-sdk";
import commonMidleware from "../lib/commonMidleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";

const db = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw new createError.BadRequest(
      `Amount must be higher than ${auction.highestBid.amount}. `
    );
    return;
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: { ":amount": amount },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await db.update(params).promise();
    updatedAuction = result.Attributes;
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

import AWS from "aws-sdk";
import commonMidleware from "../lib/commonMidleware";
import createError from "http-errors";

const db = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await db
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMidleware(getAuctions);

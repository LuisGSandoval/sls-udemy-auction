import AWS from "aws-sdk";
import commonMidleware from "../lib/commonMidleware";
import createError from "http-errors";

const db = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { stauts } = event.queryStringParameters;
  let auctions;

  try {
    const result = await db
      .query({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: "statusAndEndDate",
        KeyConditionExpression: "#status = :statuss",
        ExpressionAttributeValues: { ":status": stauts },
        ExpressionAttributeNames: { "#status": "status" },
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

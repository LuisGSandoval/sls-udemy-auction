import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const db = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title, description } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    description,
    status: "OPEN",
    createdAt: now.toISOString(),
  };

  try {
    await db
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;

import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const closeAuction = async (auction) => {
  const result = await dynamodb
    .update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: {
        id: auction.id,
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeValues: { ":status": "CLOSED" },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    })
    .promise();

  return result;
};

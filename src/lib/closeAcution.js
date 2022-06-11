import AWS from "aws-sdk";

const dynamodb = AWS.DynamoDB.DocumentClient();

export const closeAuction = async (id) => {
  const result = await dynamodb
    .update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      key: {
        id,
      },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeValues: { ":status": "CLOSED" },
      ExpressionAttributeNames: {
        "#status": ":status",
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return result;
};

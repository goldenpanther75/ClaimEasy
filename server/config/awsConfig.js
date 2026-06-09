const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

// Initialize DynamoDB Client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Create DynamoDB Document Client (simplifies working with JSON)
const docClient = DynamoDBDocumentClient.from(client);

module.exports = { docClient };

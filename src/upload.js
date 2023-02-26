const aws = require("aws-sdk");
const s3 = new aws.S3();


const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

// trigger event from api gateway
module.exports.handler = async (event) => {
  console.log(event);

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully uploaded file to s3" })
  };

  try {
    const parsedBody = JSON.parse(event.body);
    const base64File = parsedBody.file;
    const decodedFile = Buffer.from(base64File.replace(/^data:image\/w+;base64,/,""), "base64")
    const params = {
      Bucket: BUCKET_NAME,
      Key: `images/${new Date().toISOString}.jpeg`,
      Body: decodedFile,
      ContentType: "image/jpeg"
    };

    const uploadResult = await s3.upload(params).promise();
    response.body = JSON.stringify({ message: "Successfully uploaded file to s3", uploadResult })
  } catch(e) {
    console.error(e);
    response.body = JSON.stringify({ message: "Error uploading file", errorMessage: e});
    response.statusCode = 500;
  }

  return response;
};
'use strict';

const { AWSTranslateJSON } = require('aws-translate-json');
const rp = require('request-promise');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const awsConfig = {
    accessKeyId: process.env.AWS_TRANSLATE_ID,
    secretAccessKey: process.env.AWS_TRANSLATE_SECRET,
    region: process.env.AWS_TRANSLATE_REGION,
}
 
const source = "fa";
const target = ["en"];
 
const { translateJSON } = new AWSTranslateJSON(awsConfig, source, target);

module.exports.handleTranslatorRequest = async event => {

  const body = JSON.parse(event.body);
  const {chat, text} = body.message;

  console.log(text);
  if (text) {
    let message = '';
    try {
      const result = await translateJSON({key1: text});
      console.log(result);
      message = result.en.key1;
    } catch (error) {
      message = `Input: ${text}, \nError: ${error.message}`;
    }

    console.log("Sending to user: " + message)

    await sendToUser(chat.id, message);
  } else {
    await sendToUser(chat.id, 'Text message is expected.');
  }

  return { statusCode: 200 };
};

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };
  return rp(options); 
}

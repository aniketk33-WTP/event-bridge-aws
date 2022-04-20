"use strict";

const AWS = require('aws-sdk');
const EventBridge = new AWS.EventBridge({apiVersion: '2015-10-07'});


const eventBridgeInvoker = async (event) => {

  try {

    const putEventsRes = await putEvents(JSON.stringify({
      "id":Number(event.queryStringParameters.id)
    }));
    console.log(putEventsRes);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Event sent successfully`,
        }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Could not send event to event bus',
        }),
    };
  }

};


const invokedFunc = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: event
      }),
  };
}

const putEvents = (data) => {
  const params = {
    Entries: [{
      Detail: data,
      DetailType: 'test',
      EventBusName: 'arn:aws:events:ap-south-1:070837921323:event-bus/test-event-bus',
      Source: 'handler.eventBridgeInvoker'
    }]
  };

  return new Promise((resolve, reject) => {
    EventBridge.putEvents(params,(err, data)=>{
      if(err){
        console.log(err)
        reject(err)
      }
      resolve(data)
    })
    
  });
}


module.exports = {
  eventBridgeInvoker, invokedFunc
}

{
    "name": "WhatDate",
    "sampleUtterances": [
        "What is the date",
        "What day is it"
    ],
    "slots": [],
    "dialogCodeHook": {
        "uri": "arn:aws:lambda:us-east-1:160696617623:function:intentOscarBot",
        "messageVersion": "1.0"
    },
    "fulfillmentActivity": {
        "type": "CodeHook",
        "codeHook": {
            "uri": "arn:aws:lambda:us-east-1:160696617623:function:intentOscarBot",
            "messageVersion": "1.0"
        }
    }
}

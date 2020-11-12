// Require Firebase functions
const functions = require('firebase-functions');

// Require 'bad-words' for chat moderation;
const Filter = require('bad-words');

// Firebase Admin gives ban functionality
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/*
    Cloud function that is run every time a document is
    created in the messages collection
*/
exports.detectBadUsers = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (doc, ctx) => {
    // instantiate bad words filter
    const filter = new Filter();
    /*
        Destructure data
        Grab document text for processing
        Grab uid to ban if necessary
    */
    const { text, uid } = doc.data;

    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      await doc.ref.update({
        text: `:/ I got banned for saying: ${cleaned}`,
      });
      // Add user to Santa's naughty list by uid
      await db.collection('banned').doc(uid).set({});
    }
  });

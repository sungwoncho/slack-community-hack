const config = require('./config');
const rp = require('request-promise');
const mongoose = require('mongoose');

mongoose.connect(config.mongoURL);

const Invitation = mongoose.model('Invitation', { email: String, sentAt: Date });

// Constants
const BUFFER = 600000; /* buffer for constructing since timestamp */


// dateToEpoch turns javascript date object into unix epoch
function dateToEpoch(date) {
  return date.getTime() / 1000 | 0;
}

/**
 * fetchFormdata fetches the typeform responses since the given timestamp
 * @params sinceTimestamp {String} - Epoch
 */
function fetchFormdata(sinceTimestamp) {
  const { typeformUID, typeformAPIKey } = config;
  const endpoint = `https://api.typeform.com/v1/form/${typeformUID}?key=${typeformAPIKey}&since=${sinceTimestamp}`;
  console.log(endpoint);
  const options = {
    uri: endpoint,
    json: true
  };

  return rp(options);
}

/**
 * maybeSendSlackInvitation sends Slack invitation to the given email address if needed
 * @params email - {String}
 */
function maybeSendSlackInvitation(email) {
  return Invitation.count({ email })
    .then(count => {
      if (count === 0) {
        console.log('Sending Slack invitation to', email);
        const { slackAPItoken } = config;
        const endpoint = `https://slack.com/api/users.admin.invite?token=${slackAPItoken}&email=${email}&resend=false`;

        return rp({ uri: endpoint })
          .then(() => {
            const invitation = new Invitation({ email, sentAt: new Date() });
            return invitation.save();
          });
      }

      console.log('Invitation was already sent. Not sending to', email);
      return;
    });
}

function run() {
  const now = new Date();
  const since = new Date(now - config.interval - BUFFER);
  const sinceTimestamp = dateToEpoch(since);
  const { emailKey } = config;

  fetchFormdata(sinceTimestamp)
    .then(body => {
      body.responses.forEach(response => {
        const email = response.answers[emailKey];

        if (!email) {
          return;
        }

        maybeSendSlackInvitation(email)
          .catch(err => {
            console.log('Error sending Slack invitation', err);
          });
      });
    })
    .catch(err => {
      console.log('Error fetching form data', err);
    });
}

// main function
(function() {
  // Run first time
  run();

  setInterval(run, config.interval)
})();

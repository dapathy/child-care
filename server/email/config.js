Meteor.startup(function() {

  // Mailgun sandbox account.
  process.env.MAIL_URL = "smtps://christianchildcare316:Matthew25@smtp.gmail.com:465";

  // Used automatically by Accounts package.
  Accounts.emailTemplates.siteName = "Christian Child Care";
  Accounts.emailTemplates.from = "Christian Child Care <Do_Not_Reply@ChristianChild.care>";
  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Christian Child Care - Reset Password";
  };
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    return intro() +
        "Click the following link to set your new password:\n" +
        url + "\n\n\n" +
        "Cheers,\n" +
        SIGNATURE;
  };
});

export function sendEmail (subject, message) {
  Email.send({
    to: Meteor.user().emails[0].address,
    from: "Christian Child Care <Do_Not_Reply@ChristianChild.care>",
    subject: subject,
    text: intro() + message + SIGNATURE //TODO: make not crap
  });
}

function intro() {
  let username = Meteor.user().username;
  return "Hello " + username + "! \n\n";
}

const SIGNATURE = "\n\n\n" +
    "Cheers,\n" +
    "Christian Child Care";

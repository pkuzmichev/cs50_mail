document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
document.querySelector('#compose-recipients').value = '';
document.querySelector('#compose-subject').value = '';
document.querySelector('#compose-body').value = '';
}

function send_email(recipients_email, subject_email, body_email) {

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients_email,
      subject: subject_email,
      body: body_email
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // document.querySelector('#mails-inbox').value = 'hahaha';
  // document.getElementById('#mails-inbox').value = 'hah';


  // Get emails
  fetch('emails/inbox')
    .then(response => response.json())
    .then(emails => {
      console.log(emails)
      console.log('lenght: ' + Object.keys(emails).length)
      // View for json on the page
      // for
      for (let i = 0; i < Object.keys(emails).length; i++) {
        console.log('keklol')
        // json to html
        document.querySelector('#mails-inbox').innerHTML = `<h1>heh ${emails[i]['subject']}</h1>`;
      }
    })

    // ${emails.slice(1)}

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  console.log('load_mailbox');

}
document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  document.querySelector('#mails-inbox').addEventListener('click', (e) => load_email(e.target.id));
  document.querySelector('#mails-sent').addEventListener('click', (e) => load_email(e.target.id));

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(to='', subject='', body='') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mails-inbox').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = to;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_email(elem_id) {

  fetch(`/emails/${elem_id}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(emails => {
      console.log('archive object:', emails);
      document.querySelector('#mails-inbox').style.display = 'none';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#mail-view').style.display = 'block';

      var mails = document.querySelectorAll('#mail-view');

      mails.forEach(mail => {
        mail.innerHTML = `<div class='mail'>
            <div class='sender-mail'><b>From: </b>${emails['sender']}</div>
            <div class='recipients-mail'><b>To: </b>${emails['recipients']}</div>
            <div class='subject-mail'><b>Subject: </b>${emails['subject']}</div>
            <div class='timestamp'><div class='timestamp-mail'><b>Timestamp: </b>${emails['timestamp']}</div></div>
            <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
            <button class="btn btn-sm btn-outline-primary" id="archive"></button>
            <hr>
            <div class='body-mail'>${emails['body'].replace(/(?:\r\n|\r|\n)/g, '<br>')}</div>
          </div>`
      })
      if (emails['archived'] == true) {
        document.querySelector('#archive').innerText = "Unarchive";
      } else {
        document.querySelector('#archive').innerText = "Archive";
      }
      document.querySelector('#reply').addEventListener('click', () => reply(emails['sender'], emails['subject'], emails['body'], emails['timestamp']));
      document.querySelector('#archive').addEventListener('click', print);
    });

  fetch(`/emails/${elem_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function reply(recipient, subject, body, timestamp) {
  let subject_compose = 'Re: ';
  let body_compose = '\n---\n' + 'On ' + timestamp + ' ' + recipient + ' wrote: \n' + body; 

  if (!subject.startsWith('Re:')) {
    subject_compose += subject;
    compose_email(recipient, subject_compose, body_compose);
  } else {
    return compose_email(recipient, subject, body_compose);
  }

  // TODO:
  // 1. archive button;
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
    .then(response => response.json());
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#mails-inbox').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

  // Get emails
  if (mailbox === 'inbox') {

    console.log('inbox click');

    var inbox_mails = document.querySelectorAll('#mails-inbox');
    inbox_mails.forEach(mail => {
      mail.innerHTML = ``
    })

    fetch('emails/inbox')
      .then(response => response.json())
      .then(emails => {
        if (Object.keys(emails).length >= document.getElementsByClassName('inbox-mail').length) {
          var mails = document.querySelectorAll('#mails-inbox');
          mails.forEach(mail => { mail.innerHTML = `` })
          for (let i = 0; i < Object.keys(emails).length; i++) {
            mails.forEach(mail => {
              mail.innerHTML += `<div class='inbox-mail'>
            <div class='sender-inbox' id='${emails[i]['id']}'>${emails[i]['sender']}</div>
            <div class='subject-inbox' id='${emails[i]['id']}'>${emails[i]['subject']}</div>
            <div class='timestamp'><div class='timestamp-inbox' id='${emails[i]['id']}'>${emails[i]['timestamp']}</div></div>
          </div>`
              var unreadElements = document.querySelectorAll('.inbox-mail');
                if (emails[i]['read'] == true) {
                  unreadElements[i].setAttribute('id', 'read');
                } else {
                  unreadElements[i].setAttribute('id', 'unread');
                }
            });
          }
        }
      })
  } else if (mailbox === 'sent') {

    var inbox_mails = document.querySelectorAll('#mails-inbox');
    inbox_mails.forEach(mail => {
      mail.innerHTML = ``
    })

    fetch('emails/sent')
      .then(response => response.json())
      .then(emails => {
        if (Object.keys(emails).length > document.getElementsByClassName('inbox-mail').length) {
          var mails = document.querySelectorAll('#mails-inbox');
          mails.forEach(mail => {
            mail.innerHTML = ``
          })

          // TODO:
          // 1. timestamp not show :(
          for (let i = 0; i < Object.keys(emails).length; i++) {
            mails.forEach(mail => {
              mail.innerHTML += `<div class='inbox-mail'>
            <div class='sender-inbox' id='${emails[i]['id']}'>${emails[i]['recipients']}</div>
            <div class='subject-inbox' id='${emails[i]['id']}'>${emails[i]['subject']}</div>
            <div class='timestamp'><div class='timestamp-inbox' id='${emails[i]['id']}> timestamp + ${emails[i]['timestamp']}</div></div>
          </div>`
            })
          }
        }
      })
  } else if (mailbox === 'archive') {
    var inbox_mails = document.querySelectorAll('#mails-inbox');
    inbox_mails.forEach(mail => {
      mail.innerHTML = ``
    })

    fetch('emails/archive')
      .then(response => response.json())
      .then(emails => {
        if (Object.keys(emails).length > document.getElementsByClassName('inbox-mail').length) {
          var mails = document.querySelectorAll('#mails-inbox');
          mails.forEach(mail => {
            mail.innerHTML = ``
          })

          for (let i = 0; i < Object.keys(emails).length; i++) {
            mails.forEach(mail => {
              mail.innerHTML += `<div class='inbox-mail'>
            <div class='sender-inbox'>${emails[i]['recipients']}</div>
            <div class='subject-inbox'>${emails[i]['subject']}</div>
            <div class='timestamp'><div class='timestamp-inbox'>${emails[i]['timestamp']}</div></div>
          </div>`
            })
          }
        }
      })
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}

// TODO:
// 2. archived mailbox.
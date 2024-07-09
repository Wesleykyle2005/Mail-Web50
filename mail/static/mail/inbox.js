document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-details-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // Create divs for each email
      emails.forEach(singleEmail => {
        const newEmail = document.createElement('div');
        newEmail.className = "list-group-item";
        newEmail.innerHTML = `
          <h3>Enviador: ${singleEmail.sender}</h3>
          <h3>Sujeto: ${singleEmail.subject}</h3>
          <p>Hora de envio: ${singleEmail.timestamp}</p>        
        `;

        newEmail.classList.add('list-group-item', singleEmail.read ? 'read' : 'unread');
        newEmail.addEventListener('click', () => viewEmail(singleEmail.id));
        document.querySelector('#emails-view').append(newEmail);
      });
    });
}

function send_email(event) {
  event.preventDefault(); // Prevenir comportamiento por defecto del formulario

  // Obtener información de los campos
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    });
}

function viewEmail(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email);
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-details-view').style.display = 'block';
      document.querySelector('#email-details-view').innerHTML = `
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action list-group-item-dark"><strong>From: </strong>${email.sender}</a>
          <a href="#" class="list-group-item list-group-item-action list-group-item-dark"><strong>To: </strong>${email.recipients}</a>
          <a href="#" class="list-group-item list-group-item-action list-group-item-dark"><strong>Subject: </strong>${email.subject}</a>
          <a href="#" class="list-group-item list-group-item-action list-group-item-dark"><strong>Timestamp: </strong>${email.timestamp}</a>
          <hr>
          <a href="#" class="list-group-item list-group-item-action list-group-item-dark"><strong>Body: </strong>${email.body}</a>
        </div>
      `;

      if (!email.read) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

      // Archivar Emails
      const archiveButton = document.createElement('button');
      archiveButton.innerHTML = email.archived ? "Unarchive" : "Archive";
      archiveButton.className = email.archived ? "btn btn-success" : "btn btn-danger";
      archiveButton.addEventListener('click', function () {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
          .then(() => {
            load_mailbox(email.archived ? 'inbox' : 'archive');
          });
      });
      document.querySelector('#email-details-view').append(archiveButton);

      // Responder Emails
      const replyButton = document.createElement('button');
      replyButton.innerHTML = "Responder";
      replyButton.className = "btn btn-info";
      replyButton.addEventListener('click', function () {
        compose_email();

        document.querySelector('#compose-recipients').value = email.sender;

        let subject = email.subject;
        if (!subject.startsWith("Re: ")) {
          subject = "Re: " + email.subject;
        }

        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
      });
      document.querySelector('#email-details-view').append(replyButton);
    });
}

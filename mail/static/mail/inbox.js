document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Send an email when the form is submitted
  document.querySelector('#compose-form').addEventListener('submit', function(event) {
    Send_emails(event);
  });
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-emails').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-emails').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch the emails for the mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Clear the emails view
      document.querySelector('#emails-view').innerHTML = '';

      // Add the mailbox name
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      // Load each mail
      emails.forEach(email => {
        const emailBox = document.createElement('div');
        emailBox.className = 'emailBox';
        emailBox.innerHTML = `
          <div class="card ">
            <div class="card-body">
              <h5 class="card-title">${email.subject}</h5>
              <h6 class="card-subtitle">${Array.isArray(email.recipients) ? email.recipients.join(', ') : email.recipients}</h6>
              <p class="card-text"><small class="text-muted">${email.timestamp}</small></p>
              <button class="view-emails-button btn btn-success">View email</button>
              <button class="archive-emails-button btn btn-primary">${email.archived ? 'Unarchive' : 'Archive'}</button>
            </div>
          </div>
        `;

        // Añadir clase adicional al div con clase 'card' según si el correo ha sido leído o no
        if (email.read === false) {
          emailBox.querySelector('.card').classList.add('bg-secondary');
        } else {
          emailBox.querySelector('.card').classList.add('bg-light');
        }

        // Añadir eventos a los botones después de que se hayan creado
        emailBox.querySelector('.view-emails-button').addEventListener('click', function() {
          View_emails(email.id);
        });

        emailBox.querySelector('.archive-emails-button').addEventListener('click', function() {
          if (email.archived) {
            Unarchive_emails(email.id);
          } else {
            Archive_emails(email.id);
          }
        });

        

        document.querySelector('#emails-view').append(emailBox);
      });
    });
}

function Send_emails(event){
  event.preventDefault(); // Previene el comportamiento predeterminado del formulario

  const content_recipients = document.querySelector('#compose-recipients').value;
  const content_subject = document.querySelector('#compose-subject').value;
  const content_body = document.querySelector('#compose-body').value;
  const current_user = document.querySelector('#compose-form input[disabled]').value; // Obtener el correo del usuario actual

  // Verificar si el destinatario es el usuario actual
  if (content_recipients === current_user) {
    alert("No puedes enviarte correos a ti mismo.");
    return;
  }

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: content_recipients,
        subject: content_subject,
        body: content_body
    })
  })
  .then(response => response.json())
  .then(result => {
      if (result.error) {
        alert(result.error);
      } else {
        alert("Correo enviado exitosamente.");
        // Load the sent mailbox
        load_mailbox('sent');
      }
  });
}

function View_emails(email_id) {
  console.log('view email', email_id);
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
      console.log(email);
      // Aquí puedes agregar la lógica para mostrar el correo
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#view-emails').style.display = 'block';
      document.querySelector('#view-emails').innerHTML = `
        <div>
          <h3>${email.subject}</h3>
          <p><strong>From:</strong> ${email.sender}</p>
          <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
          <p><strong>Timestamp:</strong> ${email.timestamp}</p>
          <p>${email.body}</p>
          <button class="btn btn-primary" onclick="compose_reply(${email.id})">Reply</button>
          <button class="btn btn-secondary" onclick="toggle_archive(${email.id}, ${email.archived})">${email.archived ? 'Unarchive' : 'Archive'}</button>
        </div>
      `;

      Readed_emails(email_id);
  });
}

function Readed_emails(email_id) {
  console.log('archive email', email_id);
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function Archive_emails(email_id) {
  console.log('archive email', email_id);
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(() => {
      alert("Correo archivado.");
      // Recargar la bandeja de entrada después de archivar el correo
      load_mailbox('inbox');
  });
}

function Unarchive_emails(email_id) {
  console.log('archive email', email_id);
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(() => {
      alert("Correo desarchivado.");
      load_mailbox('inbox');
  });
}

function toggle_archive(email_id, archived) {
  if (archived) {
    Unarchive_emails(email_id);
  } else {
    Archive_emails(email_id);
  }
}

function compose_reply(email_id) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
      const current_user = document.querySelector('#compose-form input[disabled]').value; // Obtener el correo del usuario actual

      // Verificar si el remitente es el usuario actual
      if (email.sender === current_user) {
        alert("No puedes responder a tus propios correos.");
        return;
      }

      // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#view-emails').style.display = 'none';

      // Pre-fill composition fields
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = `Re: ${email.subject.startsWith('Re:') ? email.subject : 'Re: ' + email.subject}`;
      document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  });
}
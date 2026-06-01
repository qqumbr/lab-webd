console.log('contact route hit');

const axios = require('axios');

module.exports = {
  send: async function (req, res) {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.badRequest({ error: 'Всі поля є обов\'язковими.' });
    }

    try {
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'Лабораторна робота 6',
            email: process.env.MY_EMAIL
          },
          to: [{ email: process.env.MY_EMAIL }],
          subject,
          textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`
        },
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
          }
        }
      );

      return res.json({ success: true });

    }catch (err) {
  
        console.error('Error sending email:', err.response?.data || err.message);
       return res.serverError({
       error: err.response?.data || err.message
    });
    }
  }
};
console.log('MY_EMAIL:', process.env.MY_EMAIL);
console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
console.log('BREVO_API_KEY first 15 chars:', process.env.BREVO_API_KEY?.slice(0,15));

const axios = require('axios');

module.exports = {
  send: async function (req, res) {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.badRequest({ error: 'All fields are required.' });
    }

    try {
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'Portfolio Website',
            email: process.env.MY_EMAIL
          },
          to: [{ email: process.env.MY_EMAIL }],
          subject,
          textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`
        },
        {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      return res.json({ success: true, message: 'Email sent!' });

    } catch (err) {
  console.error('BREVO ERROR:');
  console.error(err.response?.data || err.message || err);

  return res.serverError({
    error: err.response?.data || err.message || 'Failed to send email'
      });
    }
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  if (!form) {
    console.error('contactForm not found in DOM');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const contentType = response.headers.get('content-type');

      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log('Server response:', result);

      if (!response.ok) {
        alert(
          typeof result === 'string'
            ? result
            : result.error || 'Something went wrong'
        );
        return;
      }

      alert(
        typeof result === 'string'
          ? result
          : result.message || 'Message sent successfully!'
      );

      form.reset();

    } catch (err) {
      console.error('Network error:', err);
      alert('Network/server error');

    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
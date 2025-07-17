AOS.init({ duration: 1200, once: true });

document.getElementById('theme-switch').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('theme-switch');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

document.getElementById('connect-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) alert('Sent successfully!');
        else alert('Sending failed.');
    } catch (error) {
        alert('Error occurred.');
    }
});

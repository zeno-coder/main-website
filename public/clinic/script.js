// Tilt effect for 3D hover (optional simple version)
document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        card.style.transform = `rotateY(${dx*10}deg) rotateX(${-dy*10}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'rotateY(0) rotateX(0) scale(1)'; });
});

// Booking Form Submission via WhatsApp
document.getElementById("bookingForm").addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.getElementById("patientName").value;
    const email = document.getElementById("patientEmail").value;
    const phone = document.getElementById("patientPhone").value;
    const doctor = document.getElementById("doctorSelect").value;
    const date = document.getElementById("appointmentDate").value;
    const notes = document.getElementById("notes").value;
    const message = `📅 *Clinic Appointment Request*%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Doctor:* ${doctor}%0A*Date:* ${date}%0A*Notes:* ${notes}`;
    const whatsappURL = `https://wa.me/919496636231?text=${message}`;
    window.open(whatsappURL,"_blank");
});
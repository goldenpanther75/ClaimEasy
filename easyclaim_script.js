document.addEventListener('DOMContentLoaded', () => {

    const btnTake = document.getElementById('btn-take');
    const btnClaim = document.getElementById('btn-claim');
    const btnTrack = document.getElementById('btn-track');

    // Navigation Logic
    // Using placeholder URLs or linking to existing pages where appropriate

    if (btnTake) {
        btnTake.addEventListener('click', () => {
            // "Take Insurance" -> Could go to our Quote flow
            window.location.href = 'quote.html';
        });
    }

    if (btnClaim) {
        btnClaim.addEventListener('click', () => {
            // "Claim Insurance" -> Placeholder for now
            alert("Claim Insurance Feature Coming Soon!");
            // window.location.href = 'claim.html';
        });
    }

    if (btnTrack) {
        btnTrack.addEventListener('click', () => {
            // "Track Insurance" -> Placeholder
            alert("Track Insurance Feature Coming Soon!");
            // window.location.href = 'track.html';
        });
    }

    // Add subtle entrance animation
    const cards = document.querySelectorAll('.action-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });

});

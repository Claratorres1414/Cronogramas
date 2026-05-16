function filter(phase) {
    document.querySelectorAll('.pnav').forEach(b => b.classList.remove('active'));
    if (phase === 'all') {
        document.querySelector('.pnav.all').classList.add('active');
        document.querySelectorAll('.phase-section').forEach(s => s.classList.remove('hidden'));
    } else {
        document.querySelector('.pnav.' + phase).classList.add('active');
        document.querySelectorAll('.phase-section').forEach(s => {
            s.classList.toggle('hidden', !s.classList.contains(phase));
        });
    }
}

function countTickets() {
    const map = { p1:'c1', p2:'c2', p3:'c4', p4:'c5', p5:'c6' };
    ['p1','p2','p3','p4','p5'].forEach(p => {
        const n = document.querySelectorAll('#phase-' + p + ' .ticket').length;
        const el = document.getElementById(map[p]);
        if (el) el.textContent = n;
    });
}

window.filter = filter;
countTickets();
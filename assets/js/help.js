const VAST_EMAILS = ['support@vastvisions.org','team@vastvisions.org'];

const FAQ_DATA = [
    {q: 'What warranty comes with the glasses?', a: 'All classroom/demo units include a 1-year limited warranty covering manufacturing defects. Accidental damage (drops, liquids) is not covered.'},
    {q: 'How do I get a prescription lens added?', a: 'We support prescription inserts for the demo models. Bring a copy of the prescription and contact the team via the contact form; we will arrange fitting instructions.'},
    {q: 'How long does the battery last?', a: 'Typical battery life is 6-8 hours of mixed use. Battery life varies with brightness and continuous use of augmented features.'},
    {q: 'What is your return and refund policy?', a: 'Classroom demo units cannot be returned. Consumer orders made via the Buy page are eligible for a 30-day return if unopened. Contact support for exceptions.'},
    {q: 'Which devices and OS are supported?', a: 'Our software supports Windows 10+, macOS 11+, Android 11+, and iOS 14+. Some features may be limited on older OS versions.'},
    {q: 'How do I clean and maintain the glasses?', a: 'Use a microfiber cloth for lenses and a soft damp cloth for frames. Avoid alcohol or harsh solvents on lens coatings.'},
    {q: 'Is my data private and secure?', a: 'We store only the minimum telemetry required to diagnose issues. We do not sell user data. See our privacy policy for details.'},
    {q: 'Can I use these glasses for live classroom streaming?', a: 'Yes — the glasses support streaming with compatible apps. Check the streaming guide on the Features page for setup steps.'},
    {q: 'How long does shipping take?', a: 'Shipping for classroom/demo units within the same country is typically 3–7 business days. International shipping varies by carrier.'},
    {q: 'Who do I contact during the software engineering class if something fails?', a: 'Use the "Send to VAST" button in this page and mark the subject "URGENT: Class Demo" so team members can prioritize the response.'}
];

const faqList = document.getElementById('faqList');
const searchFaq = document.getElementById('searchFaq');
const resetSearch = document.getElementById('resetSearch');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const askBtn = document.getElementById('askBtn');
const emailBtn = document.getElementById('emailBtn');
const sendMail = document.getElementById('sendMail');
const clearForm = document.getElementById('clearForm');

function renderFaqs(filter = '') {
    faqList.innerHTML = '';
    const query = filter.trim().toLowerCase();

    const matches = FAQ_DATA.filter(item =>
        item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        const li = document.createElement('li');
        li.className = "text-sm text-gray-400";
        li.textContent = 'No FAQs matched your search.';
        faqList.appendChild(li);
        return;
    }

    matches.forEach((item) => {
        const li = document.createElement('li');
        li.className = "rounded-xl border border-white/10 bg-black/30";
        li.innerHTML = `
            <button class="w-full flex items-center justify-between text-left px-4 py-3 hover:bg-white/5 rounded-xl">
            <span class="font-medium">${item.q}</span>
            <i data-lucide="plus" class="w-4 h-4 text-cyan-300 shrink-0"></i>
            </button>
            <div class="hidden px-4 pb-4 text-gray-300">
            <p class="text-sm leading-relaxed">${item.a}</p>
            </div>
        `;
        const btn = li.querySelector('button');
        const ans = li.querySelector('div');
        btn.addEventListener('click', () => {
            ans.classList.toggle('hidden');
            // swap icon
            const iconName = ans.classList.contains('hidden') ? 'plus' : 'minus';
            const icon = btn.querySelector('svg');
            if (icon) icon.remove();
            const i = document.createElement('i');
            i.setAttribute('data-lucide', iconName);
            i.className = 'w-4 h-4 text-cyan-300 shrink-0';
            btn.appendChild(i);
            if (window.lucide) window.lucide.createIcons();
        });
        faqList.appendChild(li);
    });

    if (window.lucide) window.lucide.createIcons();
}

renderFaqs();
if (window.lucide) window.lucide.createIcons();

searchFaq.addEventListener('input', () => renderFaqs(searchFaq.value));
resetSearch.addEventListener('click', () => { searchFaq.value=''; renderFaqs(); searchFaq.focus(); });

function assistantAnswer(question) {
    const q = question.toLowerCase();
    for (const item of FAQ_DATA) {
    if (q.includes(item.q.toLowerCase())) return item.a;
    }
    const keywords = {
    'warrant': 0, 'warranty':0,
    'prescription':1, 'rx':1,
    'battery':2,
    'return':3, 'refund':3,
    'os':4, 'android':4, 'ios':4,
    'clean':5,
    'privacy':6, 'data':6,
    'stream':7, 'streaming':7,
    'shipping':8, 'ship':8,
    'urgent':9
    };
    for (const k in keywords) {
    if (q.includes(k)) return FAQ_DATA[keywords[k]].a;
    }
    return null;
}

function appendMessage(text, who='assistant') {
    const wrap = document.createElement('div');
    wrap.className = `mb-2 flex ${who === 'user' ? 'justify-end' : ''}`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[75%] rounded-2xl px-3 py-2 border ${who === 'user'
    ? 'bg-cyan-900/40 border-cyan-400/30 text-cyan-100'
    : 'bg-black/40 border-white/10 text-gray-100'}`;
    bubble.textContent = text;

    wrap.appendChild(bubble);
    chatWindow.appendChild(wrap);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

askBtn.addEventListener('click', () => {
    const question = chatInput.value.trim();
    if (!question) return;
    appendMessage(question, 'user');
    const ans = assistantAnswer(question);
    if (ans) appendMessage(ans, 'assistant');
    else appendMessage('I don’t have an exact answer. Click “Send to VAST” to email your question to the team and they will reply by email.', 'assistant');
    chatInput.value = '';
    chatInput.focus();
});

chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') askBtn.click(); });

emailBtn.addEventListener('click', () => {
    const lastUser = [...chatWindow.querySelectorAll('.mb-2.flex.justify-end div')].pop();
    const question = lastUser ? lastUser.textContent : (chatInput.value || '');
    const subject = encodeURIComponent('Support request from Help Center');
    const bodyLines = [
    'Hello VAST team,',
    '',
    'A user submitted the following question via the Help Center:',
    question || '(no question provided)',
    '',
    '--- Please reply to the user directly. ---'
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${VAST_EMAILS.join(',')}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
});

clearForm.addEventListener('click', () => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
});

sendMail.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const from = document.getElementById('email').value.trim();
    const subject = (document.getElementById('subject').value.trim() || 'Help Center inquiry');
    const message = document.getElementById('message').value.trim();
    if (!from || !message) {
    alert('Please include your email and a short message before sending.');
    return;
    }
    const body = encodeURIComponent(`From: ${name || 'Anonymous'} (${from})\n\n${message}`);
    const mailto = `mailto:${VAST_EMAILS.join(',')}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
});
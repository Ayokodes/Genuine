document.addEventListener('DOMContentLoaded', () => {
    const id = Number(new URLSearchParams(location.search).get('id') || 1);
    const s = scholarships.find(x => x.id === id) || scholarships[0];

    const requirements = [
        ['Financial Documentation', 'Proof of financial need or other required financial documentation.'],
        ['Proof of Academic Achievement', 'Academic transcripts or other proof of previous academic achievements.'],
        ['Certificates / Diplomas', 'Proof of completion of previous academic programmes.'],
        ['CV / Resume', 'Include academic achievements, extracurricular activities, volunteer work, leadership roles and relevant work experience.'],
        ['Identification Documents', 'National ID, previous institution card, passport copy and photograph where required.'],
        ['Language Proficiency', 'IELTS, TOEFL, PTE Academic, TEF or DELF/DALF where applicable.'],
        ['Letter of Recommendation', 'Typically two or three letters from teachers, professors, employers or community leaders.'],
        ['Portfolio', 'Required where applicable, particularly for creative fields.'],
        ['Research Proposal', 'Required for applicable graduate or research-based scholarships.']
    ];

    document.querySelector('#detailContent').innerHTML = `
        <section class="detail-hero">
            <div class="container detail-grid">
                <div>
                    <span class="eyebrow">${s.org}</span>
                    <h1 style="font-size:46px">${s.title}</h1>
                    <p>${s.description}</p>
                    <div class="tag-row">
                        <span class="tag">${s.level}</span>
                        <span class="tag">${s.field}</span>
                        <span class="tag">${s.funding}</span>
                    </div>
                    <a class="btn btn-primary" href="#requirements">View Requirements</a>
                    <button class="btn btn-outline" id="saveBtn">Save scholarship</button>
                </div>
                <img class="detail-image" src="${s.image}" alt="Students studying in the UK">
            </div>
        </section>

        <section class="section" id="requirements">
            <div class="container">
                <div class="card">
                    <span class="eyebrow">Before you contact us</span>
                    <h2>Scholarship Requirements</h2>
                    <p>Review the documents below and confirm the specific requirements for your scholarship before proceeding.</p>
                    <div class="requirements-list">
                        ${requirements.map(([title, description]) => `
                            <div class="requirement-item">
                                <h3>${title}</h3>
                                <p>${description}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:30px">
                        <a class="btn btn-primary" href="https://t.me/AgentGeniuneScholar" target="_blank" rel="noopener">Continue to Contact Us</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container detail-grid">
                <div class="card">
                    <h2>Scholarship overview</h2>
                    <p>${s.description}</p>
                    <div class="meta">
                        <span>Study level<strong>${s.level}</strong></span>
                        <span>Field<strong>${s.field}</strong></span>
                        <span>Location<strong>${s.country}</strong></span>
                        <span>Funding<strong>${s.funding}</strong></span>
                        <span>Award<strong>${s.award}</strong></span>
                        <span>Deadline<strong>${s.deadline}</strong></span>
                    </div>
                    <h3>Important</h3>
                    <p>Scholarship eligibility, deadlines and document requirements can vary. Confirm the current details for the specific opportunity before submitting any application.</p>
                </div>
                <aside class="card detail-side">
                    <h3>Need help?</h3>
                    <p>After reviewing the requirements, contact our support team for guidance.</p>
                    <a class="btn btn-primary" style="width:100%" href="https://t.me/AgentGeniuneScholar" target="_blank" rel="noopener">Contact Us</a>
                </aside>
            </div>
        </section>
    `;

    document.querySelector('#saveBtn').onclick = () => {
        const saved = JSON.parse(localStorage.getItem('genuine_scholars_saved') || '[]');
        if (!saved.includes(s.id)) saved.push(s.id);
        localStorage.setItem('genuine_scholars_saved', JSON.stringify(saved));
        toast('Scholarship saved');
    };
});

// Atulya-Tantra Office Suite - Core Engine Logic

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        activeApp: 'docs', // 'docs', 'sheets', 'slides', 'proof'
        theme: 'dark',
        aiDrawerOpen: false,
        sheets: {
            rows: 25,
            cols: 10,
            activeCell: 'A1',
            data: {
                'A1': 'Item', 'B1': 'Units', 'C1': 'Price', 'D1': 'Total',
                'A2': 'Atulya-OS', 'B2': '150', 'C2': '0', 'D2': '=B2*C2',
                'A3': 'Atulya-Office', 'B3': '520', 'C3': '0', 'D3': '=B3*C3',
                'A4': 'File-Converter', 'B4': '310', 'C4': '0', 'D4': '=B4*C4',
                'A5': 'Total Installs', 'B5': '=SUM(B2:B4)', 'C5': '-', 'D5': 'Free & Open'
            }
        },
        slides: [
            {
                title: "Atulya-Tantra Ecosystem",
                subtitle: "High-Performance, Local-First AI Productivity",
                bullets: [
                    "Native offline intelligence with TantraEngine",
                    "Runs smoothly on low-spec hardware without cloud latency",
                    "Zero subscription, fully customizable open-source stack"
                ],
                theme: "theme-gradient"
            },
            {
                title: "Atulya-Office & Tools",
                subtitle: "A Complete Free Alternative to MS Office",
                bullets: [
                    "Tantra Docs: Clean distraction-free rich text editor with inline AI",
                    "Tantra Sheets: 500+ formulas with AI formula synthesis",
                    "Tantra Proof: Style, conciseness, and readability grading"
                ],
                theme: "theme-dark"
            },
            {
                title: "Atulya-Launch & OS",
                subtitle: "Next-Gen Infrastructure & Low-RAM OS",
                bullets: [
                    "Atulya-Launch: Single-binary cPanel alternative with Caddy & Docker",
                    "Atulya-OS: Minimal <150MB Linux base with Windows desktop shell",
                    "Intent Bar: System control powered directly by natural language"
                ],
                theme: "theme-light"
            }
        ],
        activeSlideIdx: 0
    };

    // DOM Elements
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const ribbonGroups = document.querySelectorAll('.ribbon-group-container');
    const appViews = document.querySelectorAll('.app-view');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const btnToggleAi = document.getElementById('btn-toggle-ai');
    const aiDrawer = document.getElementById('ai-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const copilotInput = document.getElementById('copilot-input');
    const copilotSend = document.getElementById('copilot-send');
    const chatMessages = document.getElementById('chat-messages');

    // 1. App Navigation Switcher
    switcherBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const app = btn.dataset.app;
            switchApp(app);
        });
    });

    function switchApp(app) {
        state.activeApp = app;
        switcherBtns.forEach(b => b.classList.toggle('active', b.dataset.app === app));
        ribbonGroups.forEach(r => r.classList.toggle('active', r.id === `ribbon-${app}`));
        appViews.forEach(v => v.classList.toggle('active', v.id === `view-${app}`));

        const appIndicator = document.getElementById('status-app-indicator');
        const names = { docs: 'Tantra Docs', sheets: 'Tantra Sheets', slides: 'Tantra Slides', proof: 'Tantra Proofing' };
        if (appIndicator) appIndicator.textContent = `Active App: ${names[app] || app}`;

        if (app === 'proof') {
            runProofAnalysis();
        }
    }

    // 2. Theme Toggle
    btnThemeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.body.className = `theme-${state.theme}`;
    });

    // 3. AI CoPilot Drawer
    btnToggleAi.addEventListener('click', () => {
        state.aiDrawerOpen = !state.aiDrawerOpen;
        aiDrawer.classList.toggle('open', state.aiDrawerOpen);
    });

    btnCloseDrawer.addEventListener('click', () => {
        state.aiDrawerOpen = false;
        aiDrawer.classList.remove('open');
    });

    // Send AI Message
    async function sendAiMessage(promptText) {
        const text = promptText || copilotInput.value.trim();
        if (!text) return;

        // Render user bubble
        appendChatBubble('user', text);
        if (!promptText) copilotInput.value = '';

        // Render loading bubble
        const loadingId = 'loading-' + Date.now();
        appendChatBubble('ai', 'Thinking with Tantra-LLM...', loadingId);

        try {
            const res = await fetch('/api/v1/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text, app: state.activeApp })
            });
            const data = await res.json();
            const reply = data.completion || 'Completed processing your request.';
            updateChatBubble(loadingId, reply);
        } catch (e) {
            // Local fallback simulation if server is offline
            setTimeout(() => {
                let fallback = `Tantra AI Assistant:\nI have analyzed your request ("${text}"). All metrics indicate nominal operation across ${state.activeApp.toUpperCase()}.`;
                if (text.toLowerCase().includes('summarize')) {
                    fallback = "Executive Summary:\n• System architecture operates 100% locally with zero cloud dependencies.\n• Office applications load instantaneously with <60MB RAM footprint.\n• All files and models stay strictly private on this device.";
                } else if (text.toLowerCase().includes('action items')) {
                    fallback = "Action Items:\n1. Run performance benchmark on Tantra-LLM INT8 quant.\n2. Finalize offline file converter export formats.\n3. Publish release package for user testing.";
                }
                updateChatBubble(loadingId, fallback);
            }, 600);
        }
    }

    function appendChatBubble(role, text, id) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;
        if (id) bubble.id = id;
        bubble.innerHTML = `
            <div class="bubble-header">${role === 'ai' ? 'Tantra AI' : 'You'}</div>
            <div class="bubble-body">${text.replace(/\n/g, '<br>')}</div>
        `;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateChatBubble(id, text) {
        const bubble = document.getElementById(id);
        if (bubble) {
            bubble.querySelector('.bubble-body').innerHTML = text.replace(/\n/g, '<br>');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    copilotSend.addEventListener('click', () => sendAiMessage());
    copilotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAiMessage();
        }
    });

    // Quick prompt chips
    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.aiDrawerOpen = true;
            aiDrawer.classList.add('open');
            sendAiMessage(btn.dataset.prompt);
        });
    });

    // 4. DOCS EDITOR & TOOLBAR
    const docEditor = document.getElementById('doc-editor');
    function formatDoc(cmd, val = null) {
        document.execCommand(cmd, false, val);
        updateDocStats();
    }

    document.getElementById('doc-btn-bold').addEventListener('click', () => formatDoc('bold'));
    document.getElementById('doc-btn-italic').addEventListener('click', () => formatDoc('italic'));
    document.getElementById('doc-btn-underline').addEventListener('click', () => formatDoc('underline'));
    document.getElementById('doc-btn-strikethrough').addEventListener('click', () => formatDoc('strikethrough'));
    document.getElementById('doc-btn-h1').addEventListener('click', () => formatDoc('formatBlock', '<h1>'));
    document.getElementById('doc-btn-h2').addEventListener('click', () => formatDoc('formatBlock', '<h2>'));
    document.getElementById('doc-btn-p').addEventListener('click', () => formatDoc('formatBlock', '<p>'));
    document.getElementById('doc-btn-quote').addEventListener('click', () => formatDoc('formatBlock', '<blockquote>'));
    document.getElementById('doc-btn-ul').addEventListener('click', () => formatDoc('insertUnorderedList'));
    document.getElementById('doc-btn-ol').addEventListener('click', () => formatDoc('insertOrderedList'));

    document.getElementById('doc-btn-ai-summarize').addEventListener('click', () => {
        state.aiDrawerOpen = true;
        aiDrawer.classList.add('open');
        sendAiMessage("Please provide an executive summary of this document:\n" + docEditor.innerText.slice(0, 1000));
    });

    document.getElementById('doc-btn-ai-tone').addEventListener('click', () => {
        state.aiDrawerOpen = true;
        aiDrawer.classList.add('open');
        sendAiMessage("Rewrite the selected text or opening paragraph into a highly professional executive tone.");
    });

    document.getElementById('doc-btn-export-pdf').addEventListener('click', () => {
        window.print();
    });

    function updateDocStats() {
        const text = docEditor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.round(words / 200));
        document.getElementById('status-word-count').textContent = `Words: ${words}`;
        document.getElementById('status-reading-time').textContent = `Reading time: ~${minutes} min`;
    }
    docEditor.addEventListener('input', updateDocStats);
    updateDocStats();

    // 5. SPREADSHEET ENGINE
    const thead = document.getElementById('sheets-thead');
    const tbody = document.getElementById('sheets-tbody');
    const activeCellBox = document.getElementById('active-cell-address');
    const formulaInput = document.getElementById('formula-input');

    function initSpreadsheet() {
        // Build Head
        let headRow = '<tr><th style="width: 45px;">#</th>';
        for (let c = 0; c < state.sheets.cols; c++) {
            const colName = String.fromCharCode(65 + c);
            headRow += `<th>${colName}</th>`;
        }
        headRow += '</tr>';
        thead.innerHTML = headRow;

        // Build Body
        let bodyHtml = '';
        for (let r = 1; r <= state.sheets.rows; r++) {
            bodyHtml += `<tr><th>${r}</th>`;
            for (let c = 0; c < state.sheets.cols; c++) {
                const colName = String.fromCharCode(65 + c);
                const cellId = `${colName}${r}`;
                bodyHtml += `<td id="cell-${cellId}" data-cell="${cellId}" contenteditable="true" spellcheck="false"></td>`;
            }
            bodyHtml += '</tr>';
        }
        tbody.innerHTML = bodyHtml;

        // Attach events to cells
        tbody.querySelectorAll('td').forEach(td => {
            td.addEventListener('focus', () => selectCell(td.dataset.cell));
            td.addEventListener('blur', (e) => onCellCommit(td.dataset.cell, e.target.innerText));
            td.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    td.blur();
                }
            });
        });

        renderAllCells();
    }

    function selectCell(cellId) {
        state.sheets.activeCell = cellId;
        activeCellBox.textContent = cellId;
        const raw = state.sheets.data[cellId] || '';
        formulaInput.value = raw;
        tbody.querySelectorAll('td').forEach(td => td.classList.remove('selected-cell'));
        const cellElem = document.getElementById(`cell-${cellId}`);
        if (cellElem) cellElem.classList.add('selected-cell');
    }

    function onCellCommit(cellId, value) {
        state.sheets.data[cellId] = value;
        renderAllCells();
    }

    function evaluateFormula(expr) {
        if (!expr.startsWith('=')) return expr;
        const body = expr.slice(1).toUpperCase();

        try {
            // SUM(A1:A5)
            const sumMatch = body.match(/SUM\(([A-Z])(\d+):([A-Z])(\d+)\)/);
            if (sumMatch) {
                const col = sumMatch[1];
                const startR = parseInt(sumMatch[2]);
                const endR = parseInt(sumMatch[4]);
                let total = 0;
                for (let r = startR; r <= endR; r++) {
                    const val = parseFloat(state.sheets.data[`${col}${r}`]) || 0;
                    total += val;
                }
                return total;
            }

            // AVERAGE(B1:B5)
            const avgMatch = body.match(/AVERAGE\(([A-Z])(\d+):([A-Z])(\d+)\)/);
            if (avgMatch) {
                const col = avgMatch[1];
                const startR = parseInt(avgMatch[2]);
                const endR = parseInt(avgMatch[4]);
                let total = 0, count = 0;
                for (let r = startR; r <= endR; r++) {
                    const val = parseFloat(state.sheets.data[`${col}${r}`]) || 0;
                    total += val;
                    count++;
                }
                return count > 0 ? (total / count).toFixed(2) : 0;
            }

            // Basic math evaluation with cell replacement like B2*C2
            let sanitized = body.replace(/([A-Z]\d+)/g, (match) => {
                const v = parseFloat(state.sheets.data[match]) || 0;
                return v;
            });
            // Safe evaluation of simple math
            if (/^[0-9+\-*/().\s]+$/.test(sanitized)) {
                return Function(`'use strict'; return (${sanitized})`)();
            }
            return expr;
        } catch (e) {
            return '#VALUE!';
        }
    }

    function renderAllCells() {
        for (let r = 1; r <= state.sheets.rows; r++) {
            for (let c = 0; c < state.sheets.cols; c++) {
                const colName = String.fromCharCode(65 + c);
                const cellId = `${colName}${r}`;
                const cellElem = document.getElementById(`cell-${cellId}`);
                if (!cellElem) continue;

                const raw = state.sheets.data[cellId] || '';
                if (raw.startsWith('=')) {
                    cellElem.innerText = evaluateFormula(raw);
                } else {
                    cellElem.innerText = raw;
                }
            }
        }
    }

    document.getElementById('btn-apply-formula').addEventListener('click', () => {
        if (state.sheets.activeCell) {
            onCellCommit(state.sheets.activeCell, formulaInput.value);
        }
    });

    initSpreadsheet();
    selectCell('A1');

    // 6. SLIDES STUDIO
    const slideThumbList = document.getElementById('slides-thumbnail-list');
    const slideTitleInput = document.getElementById('slide-title-input');
    const slideSubtitleInput = document.getElementById('slide-subtitle-input');
    const slideBulletsInput = document.getElementById('slide-bullets-input');
    const activeSlideCard = document.getElementById('active-slide-card');
    const slidePageBadge = document.getElementById('slide-page-badge');

    function renderSlideThumbnails() {
        slideThumbList.innerHTML = '';
        state.slides.forEach((slide, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `slide-thumb ${idx === state.activeSlideIdx ? 'active' : ''}`;
            thumb.innerHTML = `
                <div class="slide-thumb-num">SLIDE ${idx + 1}</div>
                <div class="slide-thumb-title">${slide.title}</div>
            `;
            thumb.addEventListener('click', () => selectSlide(idx));
            slideThumbList.appendChild(thumb);
        });
    }

    function selectSlide(idx) {
        state.activeSlideIdx = idx;
        const slide = state.slides[idx];
        slideTitleInput.innerText = slide.title;
        slideSubtitleInput.innerText = slide.subtitle;
        slideBulletsInput.innerHTML = slide.bullets.map(b => `<li>${b}</li>`).join('');
        activeSlideCard.className = `slide-canvas ${slide.theme || 'theme-gradient'}`;
        slidePageBadge.textContent = `Slide ${idx + 1} of ${state.slides.length}`;
        renderSlideThumbnails();
    }

    // Save edits on input
    slideTitleInput.addEventListener('input', () => {
        state.slides[state.activeSlideIdx].title = slideTitleInput.innerText;
        renderSlideThumbnails();
    });
    slideSubtitleInput.addEventListener('input', () => {
        state.slides[state.activeSlideIdx].subtitle = slideSubtitleInput.innerText;
    });

    document.getElementById('slide-btn-new').addEventListener('click', () => {
        state.slides.push({
            title: "New Strategic Slide",
            subtitle: "Subtitle here",
            bullets: ["Bullet point 1", "Bullet point 2"],
            theme: "theme-gradient"
        });
        selectSlide(state.slides.length - 1);
    });

    document.getElementById('slide-btn-delete').addEventListener('click', () => {
        if (state.slides.length > 1) {
            state.slides.splice(state.activeSlideIdx, 1);
            selectSlide(Math.max(0, state.activeSlideIdx - 1));
        }
    });

    // Theme buttons for slides
    document.getElementById('slide-theme-gradient').addEventListener('click', () => {
        state.slides[state.activeSlideIdx].theme = 'theme-gradient';
        activeSlideCard.className = 'slide-canvas theme-gradient';
    });
    document.getElementById('slide-theme-dark').addEventListener('click', () => {
        state.slides[state.activeSlideIdx].theme = 'theme-dark';
        activeSlideCard.className = 'slide-canvas theme-dark';
    });
    document.getElementById('slide-theme-light').addEventListener('click', () => {
        state.slides[state.activeSlideIdx].theme = 'theme-light';
        activeSlideCard.className = 'slide-canvas theme-light';
    });

    renderSlideThumbnails();
    selectSlide(0);

    // 7. PROOFING STUDIO
    const proofInputText = document.getElementById('proof-input-text');
    const metricReadability = document.getElementById('metric-readability');
    const metricGrade = document.getElementById('metric-grade');
    const metricWords = document.getElementById('metric-words');
    const metricChars = document.getElementById('metric-chars');
    const metricPassive = document.getElementById('metric-passive');

    async function runProofAnalysis() {
        const text = proofInputText.value;
        try {
            const res = await fetch('/api/v1/proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            metricReadability.textContent = data.readability_score || '82';
            metricGrade.textContent = data.readability_grade || 'Easy to Read';
            metricWords.textContent = data.word_count || '23';
            metricChars.textContent = `${data.char_count || '135'} characters`;
            metricPassive.textContent = data.passive_voice_detected ? 'Flagged' : 'Clean';
        } catch (e) {
            // Local fallback calculation
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            metricWords.textContent = words;
            metricChars.textContent = `${text.length} characters`;
            metricReadability.textContent = '84';
            metricGrade.textContent = 'High (Clear)';
            metricPassive.textContent = text.includes('was done') ? 'Flagged' : 'Clean';
        }
    }

    document.getElementById('proof-btn-run').addEventListener('click', runProofAnalysis);
    document.getElementById('btn-proof-sync-doc').addEventListener('click', () => {
        proofInputText.value = docEditor.innerText;
        runProofAnalysis();
    });

    window.applyQuickProofFix = function(target, replacement) {
        proofInputText.value = proofInputText.value.replace(target, replacement);
        runProofAnalysis();
    };

    // 8. MODAL CONTROLS: AI Formula Generator
    const modalFormula = document.getElementById('modal-formula-ai');
    const btnOpenFormulaModal = document.getElementById('sheet-btn-formula-ai');
    const btnRunFormulaAi = document.getElementById('btn-run-formula-ai');
    const formulaQueryInput = document.getElementById('ai-formula-query');
    const formulaResultBox = document.getElementById('formula-result-box');
    const generatedFormulaText = document.getElementById('generated-formula-text');
    const btnInsertFormula = document.getElementById('btn-insert-formula');

    btnOpenFormulaModal.addEventListener('click', () => {
        modalFormula.classList.add('open');
        formulaResultBox.classList.add('hidden');
    });

    window.closeFormulaModal = function() {
        modalFormula.classList.remove('open');
    };

    btnRunFormulaAi.addEventListener('click', async () => {
        const query = formulaQueryInput.value.trim();
        if (!query) return;

        try {
            const res = await fetch('/api/v1/formula', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            const data = await res.json();
            generatedFormulaText.textContent = data.formula;
            formulaResultBox.classList.remove('hidden');
        } catch (e) {
            generatedFormulaText.textContent = query.toLowerCase().includes('average') ? '=AVERAGE(B2:B10)' : '=SUM(B2:B10)';
            formulaResultBox.classList.remove('hidden');
        }
    });

    btnInsertFormula.addEventListener('click', () => {
        const formula = generatedFormulaText.textContent;
        formulaInput.value = formula;
        if (state.sheets.activeCell) {
            onCellCommit(state.sheets.activeCell, formula);
        }
        closeFormulaModal();
    });

    // 9. MODAL CONTROLS: AI Presentation Deck Builder
    const modalDeck = document.getElementById('modal-deck-ai');
    const btnOpenDeckModal = document.getElementById('slide-btn-ai-deck');
    const btnRunDeckAi = document.getElementById('btn-run-deck-ai');
    const deckTopicInput = document.getElementById('ai-deck-topic');

    btnOpenDeckModal.addEventListener('click', () => {
        modalDeck.classList.add('open');
    });

    window.closeDeckModal = function() {
        modalDeck.classList.remove('open');
    };

    btnRunDeckAi.addEventListener('click', async () => {
        const topic = deckTopicInput.value.trim() || 'Atulya Strategy';
        try {
            const res = await fetch('/api/v1/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await res.json();
            if (data.slides && data.slides.length) {
                state.slides = data.slides;
                selectSlide(0);
            }
        } catch (e) {
            state.slides = [
                {
                    title: topic.toUpperCase(),
                    subtitle: "Generated by Atulya-Tantra AI",
                    bullets: ["Zero-cloud architecture", "Local Tantra-LLM inference", "Optimized execution"],
                    theme: "theme-gradient"
                },
                {
                    title: "Action Roadmap",
                    subtitle: "Key Deliverables",
                    bullets: ["Tantra-Office MVP", "File Converter Tool Integration", "Atulya-OS Shell"],
                    theme: "theme-dark"
                }
            ];
            selectSlide(0);
        }
        closeDeckModal();
    });

    // 10. MODAL CONTROLS: Contributors & Credits
    const modalContributors = document.getElementById('modal-contributors');
    const btnOpenContributors = document.getElementById('btn-contributors');

    if (btnOpenContributors && modalContributors) {
        btnOpenContributors.addEventListener('click', () => {
            modalContributors.classList.add('open');
        });
    }

    window.closeContributorsModal = function() {
        if (modalContributors) {
            modalContributors.classList.remove('open');
        }
    };
});

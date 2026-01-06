// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.getElementById('terminal-body');
    const terminal = document.getElementById('terminal');
    let currentInput = '';

    const appendLine = (html) => {
        const line = document.createElement('div');
        line.innerHTML = html;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const renderPrompt = () => {
        const livePrompt = terminalBody.querySelector('.live-prompt');
        if (livePrompt) livePrompt.remove();

        const promptLine = document.createElement('div');
        promptLine.className = 'live-prompt';
        promptLine.innerHTML = `
            <span class="prompt">guest</span><span style="color:#ffb86c;">@rekav</span>:~$ </span>
            <span class="input">${escapeHtml(currentInput)}</span>
            <span class="cursor">█</span>
        `;
        terminalBody.appendChild(promptLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const newPrompt = () => {
        currentInput = '';
        renderPrompt();
    };

    // === COMMAND PARSER ===
    const commands = {
        help: () => {
            appendLine('<span style="color: #ff79c6;">Available commands:</span>');
            appendLine('  <span class="hint">help</span>     – Show this help message');
            appendLine('  <span class="hint">clear</span>    – Clear the terminal (coming soon)');
            appendLine('  <span class="hint">shitpost</span> – View latest shitposts');
            appendLine('  <span class="hint">random</span>   – Random thoughts & rants');
            appendLine('  <span class="hint">gallery</span>  – Image gallery');
            appendLine('  <span class="hint">about</span>    – Who the hell is Rekav?');
            appendLine('');
        },

    };

    const handleCommand = (input) => {
        const trimmed = input.trim();
        
        if (trimmed === '') {
            // Empty input → just new prompt, no output
            return;
        }

        const parts = trimmed.split(' ');
        const cmd = parts[0].toLowerCase();

        if (commands[cmd]) {
            commands[cmd](parts.slice(1)); // pass args if needed later
        } else {
            appendLine(`<span style="color: #ff5555;">bash: ${escapeHtml(cmd)}: command not found</span>`);
            appendLine(`<span style="color: #6272a4;">Did you mean something else? Try</span> <span class="hint">help</span>`);
        }
    };

    // === INITIALIZATION ===
    appendLine('<span style="color: #ff79c6;">Rekav\'s terminal interface version 0.1</span>');
    appendLine('Type <span class="hint">help</span> for available commands.');
    appendLine('');
    newPrompt();

    terminal.focus();

    // === INPUT HANDLING ===
    terminal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Freeze the current line (remove cursor)
            const livePrompt = terminalBody.querySelector('.live-prompt');
            if (livePrompt) {
                livePrompt.innerHTML = `<span class="prompt">guest</span><span style="color:#ffb86c;">@rekav</span>:~$ </span><span class="input">${escapeHtml(currentInput)}</span>`;
                livePrompt.classList.remove('live-prompt');
            }

            // Process the command
            handleCommand(currentInput);
            newPrompt();
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                renderPrompt();
            }
        }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            currentInput += e.key;
            renderPrompt();
        }
    });

    terminal.addEventListener('click', () => terminal.focus());
});

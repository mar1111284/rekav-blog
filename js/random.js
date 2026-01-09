document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("random-container");
    if (!container) return;

    let entries;

    try {
        const response = await fetch("randoms.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        entries = await response.json();
    } catch (err) {
        container.innerHTML = '<p style="color:#f44;text-align:center;padding:3rem;">Failed to load randoms</p>';
        console.error(err);
        return;
    }

    if (!Array.isArray(entries) || entries.length === 0) {
        container.innerHTML = '<p style="text-align:center;opacity:0.6;">No entries yet</p>';
        return;
    }

    entries.sort((a, b) => (a.index || 9999) - (b.index || 9999));

    entries.forEach(entry => {
        const article = document.createElement("article");
        article.className = "preview-item";

        const safeTitle = escapeHtml(entry.title || "Untitled");
        const safeDesc = escapeHtml(entry.description || "");
        const safePreview = entry.preview ? String(entry.preview) : "";
        const safeDate = entry.date || "";

		let mediaHtml = "";
		if (safePreview) {
			const imgSrc = safePreview.replace(/"/g, '&quot;');
			mediaHtml = `
				<img 
				    src="${imgSrc}" 
				    alt="${safeTitle}" 
				    loading="lazy" 
				    class="preview-img"
				>
			`;
		}

        article.innerHTML = `
            <div class="preview-media random">${mediaHtml}</div>
            <h2>${safeTitle}</h2>
            <time datetime="${escapeHtml(safeDate)}">${formatDate(safeDate)}</time>
            <p>${safeDesc}</p>
        `;

        container.appendChild(article);
        
        const img = article.querySelector('.preview-img');
		if (img) {
		img.onload = () => {
		    console.log("Loaded:", img.src);
		    img.classList.add('loaded');
		};
		
		if (img.complete && img.naturalHeight !== 0) {
		    console.log("Cached instant:", img.src);
		    img.classList.add('loaded');
		}
	}
    });
});

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return isNaN(d.getTime())
        ? "Invalid date"
        : d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
          });
}

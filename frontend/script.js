async function submitData() {
    const input = document.getElementById('input').value;
    const resultDiv = document.getElementById('result');
    const rawDiv = document.getElementById('rawJson');

    resultDiv.innerHTML = "<div class='card'>Processing...</div>";
    rawDiv.innerText = "";

    try {
        const data = input.split(',').map(x => x.trim()).filter(x => x);

        const res = await fetch('https://bfhl-project-y68v.onrender.com/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

        if (!res.ok) {
            throw new Error("API error");
        }

        const json = await res.json();

        // Render UI
        renderResult(json);

        // Show raw JSON
        rawDiv.innerText = JSON.stringify(json, null, 2);

    } catch (err) {
        resultDiv.innerHTML = `<div class="card" style="color:red;">Error: ${err.message}</div>`;
    }
}

function renderResult(data) {
    const container = document.getElementById('result');
    container.innerHTML = "";

    // USER INFO
    container.innerHTML += `
        <div class="card">
            <b>User:</b> ${data.user_id} <br>
            <b>Email:</b> ${data.email_id} <br>
            <b>Roll:</b> ${data.college_roll_number}
        </div>
    `;

    // HIERARCHIES
    data.hierarchies.forEach(h => {
        let content = `<b>Root:</b> ${h.root}<br>`;

        if (h.has_cycle) {
            content += `<span style="color:red;">Cycle detected</span>`;
        } else {
            content += `<b>Depth:</b> ${h.depth}<br>`;
            content += renderTree(h.tree);
        }

        container.innerHTML += `<div class="card">${content}</div>`;
    });

    // INVALID
    container.innerHTML += `
        <div class="card">
            <b>Invalid Entries:</b> ${data.invalid_entries.length ? data.invalid_entries.join(', ') : "None"}
        </div>
    `;

    // DUPLICATES
    container.innerHTML += `
        <div class="card">
            <b>Duplicate Edges:</b> ${data.duplicate_edges.length ? data.duplicate_edges.join(', ') : "None"}
        </div>
    `;

    // SUMMARY
    const s = data.summary;
    container.innerHTML += `
        <div class="card">
            <b>Summary:</b><br>
            Trees: ${s.total_trees} <br>
            Cycles: ${s.total_cycles} <br>
            Largest Root: ${s.largest_tree_root || "None"}
        </div>
    `;
}

// Recursive tree renderer
function renderTree(obj) {
    let html = "<div class='tree'>";

    for (let key in obj) {
        html += `<div>${key}`;
        html += renderTree(obj[key]);
        html += `</div>`;
    }

    html += "</div>";
    return html;
}
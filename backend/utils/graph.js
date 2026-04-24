function isValidEdge(str) {
    str = str.trim();
    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(str)) return false;

    const [p, c] = str.split('->');
    if (p === c) return false;

    return true;
}

function processData(data) {
    let invalid_entries = [];
    let duplicate_edges = [];
    let seenEdges = new Set();

    let adj = {};
    let childSet = new Set();

    // STEP 1: Validate + duplicates
    for (let edge of data) {
        let clean = edge.trim();

        if (!isValidEdge(clean)) {
            invalid_entries.push(edge);
            continue;
        }

        if (seenEdges.has(clean)) {
            if (!duplicate_edges.includes(clean)) {
                duplicate_edges.push(clean);
            }
            continue;
        }

        seenEdges.add(clean);

        const [p, c] = clean.split('->');

        if (!adj[p]) adj[p] = [];

        // multi-parent handling
        if (childSet.has(c)) continue;

        adj[p].push(c);
        childSet.add(c);
    }

    // STEP 2: Find all nodes
    let nodes = new Set();
    for (let p in adj) {
        nodes.add(p);
        adj[p].forEach(c => nodes.add(c));
    }

    // STEP 3: Find roots
    let roots = [];
    for (let node of nodes) {
        if (!childSet.has(node)) {
            roots.push(node);
        }
    }

    let visitedGlobal = new Set();
    let hierarchies = [];
    let total_cycles = 0;
    let total_trees = 0;
    let maxDepth = 0;
    let largest_tree_root = "";

    function dfs(node, visited, path) {
        if (path.has(node)) return "cycle";

        path.add(node);

        let children = adj[node] || [];
        let subtree = {};

        let depth = 1;

        for (let child of children) {
            let res = dfs(child, visited, path);

            if (res === "cycle") return "cycle";

            subtree[child] = res.tree;
            depth = Math.max(depth, 1 + res.depth);
        }

        path.delete(node);
        visited.add(node);

        return { tree: subtree, depth };
    }

    // STEP 4: Process roots
    for (let root of roots) {
        if (visitedGlobal.has(root)) continue;

        let visited = new Set();
        let result = dfs(root, visited, new Set());

        if (result === "cycle") {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            total_trees++;
            visited.forEach(n => visitedGlobal.add(n));

            if (result.depth > maxDepth ||
                (result.depth === maxDepth && root < largest_tree_root)) {
                maxDepth = result.depth;
                largest_tree_root = root;
            }

            hierarchies.push({
                root,
                tree: { [root]: result.tree },
                depth: result.depth
            });
        }
    }

    // STEP 5: Handle pure cycles (no roots)
    if (roots.length === 0 && nodes.size > 0) {
        let root = [...nodes].sort()[0];
        total_cycles++;

        hierarchies.push({
            root,
            tree: {},
            has_cycle: true
        });
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processData };
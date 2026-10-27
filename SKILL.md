---
name: find-reference-documents
description: Find documents explicitly referenced by a controlled SOP and return verified titles and hyperlinks, distinguishing references from similar documents.
---

# Find explicitly referenced documents

Follow the centrally loaded agent instructions, including user-target document-code validation, scope, output mode, links and disclaimer rules.

1. Resolve the parent document_key once if unknown, then get_document for its selected version. Confirm the latest requested parent, not the previous turn's parent.
2. Read explicit References/Related Documents text and operative reference statements. Build the exact outgoing reference list before resolving targets. A reference-model category, semantic similarity or general mention is not an outgoing reference. A references B does not establish B references A.
3. For requested links, first use an already returned content row belonging to the referenced document/version. If absent, make one scoped search per unresolved requested target using its exact returned number/title. Take key/title/number/source_path from the same matching row. Do not use the parent's link, page citation URL, image URL or a constructed Veeva URL.
4. Return verified title/code and its own ordinary HTTP(S) link. If no matching target row or valid URL exists, retain the verified reference identity and mark Link unavailable. Track outcomes per target; do not search the same missing reference twice or replace it with a similar document.
5. Do not fetch referenced full text merely to produce a link. Fetch it through the full-content workflow only when the user also requests its content or the answer requires an operative instruction it delegates. Explicit incoming-reference/path requests use the graph skill instead. Stop with partial-coverage disclosure where necessary and one disclaimer. No badges/page citations or images.

Normal MCP count: parent fetch, optional parent discovery, and one lookup per requested unresolved link. Multiple requested references legitimately need multiple distinct lookups; no automatic broad graph search.

Use the branch presentation: Reference documents — PARENT_NUMBER, followed by a compact list of each verified referenced title as an ordinary hyperlink to its own source_path and its exact returned code when present. Deduplicate by verified identity/version; preserve explicitly referenced historical versions. Do not treat a reference-model category as a reference or silently substitute a newer target version.

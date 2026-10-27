---
name: summarize-sop
description: Produce a consistently formatted, source-faithful summary of one controlled document, including its exact purpose in quotation marks when present, without citations or images.
---

# Summarize a document

Follow the centrally loaded agent instructions, including user-target document-code validation, scope, output mode, links and disclaimer rules. Do not answer from discovery snippets.

1. If document_key is known, go directly to step 2. Otherwise run the central one-search key-resolution workflow; clarify ambiguity instead of choosing a convenient source.
2. Call get_document with document_key and selected document_version when available. Check found, returned key/version/status, content_source, content availability and warnings. A chunk-map cap is not a content cap. Reuse this one full response throughout the summary; no graph, inventory, additional discovery, shell or citation-only search.
3. Use these headings in order:
   - Summary — DOCUMENT_NUMBER: DOCUMENT_TITLE, with the title linked to this document/version's own verified source_path; plain version/status.
   - Purpose — complete exact Purpose section in opening and closing double quotation marks when explicitly present. If absent say no explicit Purpose section was found; never infer a quotation.
   - Scope — supported applicability.
   - Key responsibilities — supported roles, distinct from document ownership.
   - Main process and requirements — concise stages in source order, preserving material conditions, limits, exceptions and controls.
   - Records and completion — required records/sign-offs/closeout.
4. Mark missing requested fields as Not stated in retrieved content. If full context is unavailable, label Partial summary and name the gap before the body. Do not silently fill it with broad searches or another source.
5. Stop and append one disclaimer. No badges/page citations or images. Keep the exact Purpose quotation complete; shorten surrounding explanation and duplicate details, not required conditions. Do not reproduce every screen click or repeat the summary at the end.

Normal MCP count: one fetch with a known key, or one discovery plus one fetch with an unknown key.

Preserve the branch template's six headings. Short source-verbatim excerpts for important requirements must be clearly quoted and remain distinct from connective summary text. Do not stitch noncontiguous passages into one apparent quotation or imply a summary is a complete verbatim procedure.

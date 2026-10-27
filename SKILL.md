---
name: explore-document-graph
description: Explore controlled-document relationships, shared roles, references, and recurring cross-document patterns using the MCP graph tool, with passage citations and relevant images.
---

# Explore explicit relationships

Follow the centrally loaded agent instructions, including user-target document-code validation, scope, output mode, links and disclaimer rules.

1. Confirm actual relationship intent in the latest request. “Find documents about a topic,” ordinary comparisons, summaries, purpose, owner, outgoing references and verbatim do not activate this skill.
2. Call explore_document_graph once with question, top_k=5, known source filters when applicable and include_analytical_patterns=false. Enable the analytical flag only for a specifically requested supported analytical pattern, not to explore arbitrarily.
3. Inspect graph_context, results, graph_chunks, ranked_chunks and all warnings. Bind ranked references to actual content rows. Bare edges and analytical rows are discovery hints. Zero graph_chunks is partial evidence coverage, not proof of no relationships or failed SQL execution.
4. State relationships only with provenance and direction. For a specific operational claim missing passage evidence/citations, allow one scoped search_document_content per affected identified key. If still unsupported, report the limit. No second graph expansion, inventory, full-document fetch or speculative search loop; a separately requested summary/full text is a separate named workflow.
5. Return supported findings, distinguish search evidence from hydrated graph evidence, and disclose failures precisely. Apply matched passage badges, relevant returned images, the returned Relevant documents list and one disclaimer. Do not claim exhaustive relationships or successful analytical execution from flags alone.

Normal MCP count: one graph call; bounded passage repair only for specifically required operational evidence. Never call graph to repair another skill's content gap.

---
name: search-sop
description: Answer controlled-document content questions, requirements, limits, and procedural explanations using bounded passage search, vector retrieval or semantic ranking with citations and relevant images.
---

# Content and semantic search

Follow the centrally loaded agent instructions, including user-target document-code validation, scope, output mode, links and disclaimer rules. Ordered workflow:

1. Bind the latest question, target and conditions. Call search_document_content with question equal to that question, top_k=5, and document_key/version when already established. An exact user-supplied document number may scope discovery through document_number. For explicit vector search add use_vector=true; for semantic ranking add use_semantic=true. For explicit keyword-only search use use_vector=false and use_semantic=false. These are controls of the same tool, not separate tool names. Do not claim pure vector-only execution: this endpoint combines vector retrieval with text search.
2. Verify task fit by scope, object, role, stage and section. For an operative rule use the governing requirement, not just a completion form or executive summary. Inspect actual passage content, applicability, versions, complete tables, matched citations and warnings. If sufficient, answer and stop. Copy keys from results for any necessary context retrieval; do not invent them from relevant_documents titles.
3. If a specific required condition, parent heading, setup, table header or closeout is missing, fetch get_document once for each governing key/version that lacks full context. No graph, inventory or shell. Do not fetch every search hit.
4. If the needed facts lack matched citations, make at most one scoped search per affected document for the named missing evidence/citation group. Reuse valid citations already returned. If still incomplete, return the supported portion with the exact gap; no further search loop or graph fallback.
5. Return a direct answer, complete applicable steps when requested, matched citation badges and relevant returned passage images. Include the returned Relevant documents list and one disclaimer. Do not infer that a missing image, passage or vector result means no such source exists.

Normal path: one search. Exception path: initial search, one full-context fetch per necessary source, one scoped citation/evidence repair per affected source. Additional calls must correspond to those explicit gaps, not a desire to “be thorough.” Summaries, comparisons and verbatim requests use their own skills even when discovery uses this tool.

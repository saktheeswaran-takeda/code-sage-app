# SOP agent tools and workflow review

The agent uses four retrieval tools and nine task workflows. This document records the tool/input review and the exact permitted branches. The copy-ready runtime instructions are `skills/veeva-controlled-documents/references/agent-instructions.md`; each task lives in its own `skills/*/SKILL.md`. `src/query-api/mcp_contracts.ts` is the executable source of truth for input schemas. `tools/list` is generated from those same Zod contracts.

## Review findings and changes

| Reviewed area | Existing behavior or gap | Reworked behavior |
| --- | --- | --- |
| Search tool name | Some examples in conversation used search_content | Only search_document_content exists; unknown aliases fail before dispatch |
| Tool descriptions | Repeated citation/rendering rules and broad suggestions to retry | Short tool purpose/input/output/next-step contracts; rendering lives in the main instructions |
| get_document identity | Three optional identifiers, with no advertised required identifier | MCP now requires document_key; a number/title/description without a verified key is resolved through search |
| Schema validation | Handwritten checks skipped null and accepted whitespace-only strings | Strict Zod contracts reject null, blank strings, invalid types/ranges and unknown fields before retrieval |
| Invalid arguments | Generic or unstructured errors could obscure correction | JSON-RPC -32602 with field issues, accepted/required fields, a valid example and correction; no submitted values echoed |
| Input forwarding | Falsy arguments could become an empty object | Only absent arguments default to empty inventory input; valid values are forwarded unchanged |
| Graph boundary | Cross-document wording could attract graph for ordinary work | Graph is limited to explicit relationships; comparison/reference-list/summary/owner/verbatim have no graph branch |
| Full-content tasks | Discovery snippets could become final content, or full text was fetched repeatedly | Resolve key once, fetch each source/version once per active request, then perform the selected task |
| Verbatim verification | A generated source and its copy can falsely appear verified | Persist original tool response; bind identity/hash; extract from its decoded content; compare proposed text with that original span |
| Request identity | A completed response can still repeat the preceding answer | Reset active task/target each message; validate final subject and mode against the latest request |
| Skills after reset | The local skills directory was absent | Rebuilt router, shared instructions and nine bounded task skills |
| Duplicate instruction sets | Multiple copy-ready prompts could drift | One authoritative prompt; integration documentation points to it |

The existing single JSON-text MCP response representation, REST behavior, authentication, security trimming, header filters, lifecycle policy and indexing architecture are preserved. No model setting is changed.

## Agent skills reference branch

The skills and main instructions were reconciled against
`feature/agent-instruct-skills` at `0c3064849446c3558f9bf868df7d6b5777178c89`
(local and origin refs matched during review). Its document-number policy,
navigation links, summary/comparison formats, purpose/verbatim cards, HTML
citation grouping, relevant-document lists, source-language rules and acceptance
scenarios are implemented here.

The current fixed workflows take precedence over the reference branch's older
alternatives: MCP get_document requires a resolved key, graph/inventory do not
repair ordinary lookups, file extraction is mandatory for every verbatim
request, and a single JSON-text result is parsed once. Owner lookup retains the
early stop when verified owner metadata is already present. The branch's
optional comparison shell and size-based verbatim fallback were not carried over.

The imported prefix/six-digit check governs user-selected document numbers in
the agent's instructions. It does not apply to opaque keys/IDs or impose a new
server-side number whitelist. The API retains legacy number filters; its
existing executable validation continues to check supported fields, required
keys, JSON types and ranges. Source text and reference lists preserve legacy
identifiers unchanged. Deployment acceptance cases are in the skill package's
`references/deployment-notes.md`; they have not been run on the live host.

## Tool inputs one field at a time

All provided strings must be nonempty and contain a non-whitespace character. Optional fields must be omitted, not null. No coercion, automatic renaming or silently discarded fields is allowed. Document keys/IDs remain opaque; the API does not impose a custom SOP-prefix whitelist.

### search_document_content and shared graph inputs

| Field | Type and limit | Meaning / workflow use |
| --- | --- | --- |
| question | Required string | Exact user question/target description; never a key in place of a question |
| top_k | Optional integer 1–50 | Workflow starting value 5; service default still applies if omitted |
| document_key | Optional string | Verified canonical key to scope an established source |
| document_number | Optional string | Exact user/source number to scope discovery; not a generated key |
| document_id | Optional string | Verified opaque graph/search ID; never derived from a title |
| document_version | Optional string | Requested or already selected version; keep siblings distinct |
| document_family | Optional string | Actual source family value |
| document_status | Optional string | Explicit status selection; can bypass default lifecycle exclusions |
| page_number | Optional positive safe integer | Source page/slide/sheet filter |
| owning_facility | Optional string | Facility filter, not an access entitlement |
| language_script | Optional string | language_scripts member such as Latin/Han |
| chunk_types | Optional array of nonblank strings | Complete unit types such as table/section_content; an empty array preserves service defaults |
| filter | Optional string | Raw OData only when deployment enables it; normally omit |
| use_vector | Optional boolean | Request vector retrieval; inspect warnings rather than assuming it ran |
| use_semantic | Optional boolean | Request semantic ranking; not evidence of factual correctness |
| include_retired | Optional boolean | Explicit historical scope only; never grants access |

Search returns `results` containing content, identity/version, locations, matched citations and optional images; `answers` are navigation aids. `relevant_documents` groups logical documents across versions and cannot establish a selected version by itself. Copy a key/version from the applicable evidence row, not from a fabricated title-to-ID mapping. A missing key is an evidence/metadata gap, not permission to substitute a document number.

### explore_document_graph additional input

`include_analytical_patterns` is an optional boolean. The workflow normally sends false; enable it only for a requested supported analytical pattern. All other accepted fields are exactly those listed above. Outputs include `graph_context`, hydrated `graph_chunks`, Search `results`, `ranked_chunks`, `relevant_documents`, analytical output and warnings. Bare relationships/analytical rows are discovery, not operational claims or citation objects. A missing graph chunk does not establish why expansion was empty.

### get_document

| Field | Type | Meaning |
| --- | --- | --- |
| document_key | Required nonblank string | Canonical key explicitly supplied as such or returned by tool evidence |
| document_version | Optional nonblank string | Requested/selected source version |
| include_retired | Optional boolean | Explicit historical scope only |

No question, top_k, document_number, document_id, array of keys, metadata-only switch or section-only switch is accepted. This is an intentional MCP contract change: existing MCP clients using a number/ID must resolve a key first. REST `/documents/{id}` and internal `documentQuery` still support their existing identifiers.

Outputs are `found`, `document`, `content`, `content_source`, `content_length`, `chunk_map`, counts and warnings. Metadata includes `document_owner` when available. Full content can be present while the location map is capped at 500 by default. The response is stored extracted text, not an original PDF and not a set of matched passage citation objects. There is no existing metadata-only endpoint to reduce an owner lookup's payload; do not invent one.

### list_documents

| Field | Type and limit | Meaning |
| --- | --- | --- |
| top | Optional integer 1–1,000 | Starting value 10 unless user requests another bound |
| document_family | Optional nonblank string | Actual family filter |
| document_status | Optional nonblank string | Explicit lifecycle status filter |
| owning_facility | Optional nonblank string | Facility filter |
| include_retired | Optional boolean | Explicit historical inventory |

All fields are optional, so omitted arguments can mean `{}` for this tool only. It accepts no question, document key/number/ID/version, top_k or pagination argument. Outputs are returned document-version rows, `document_count`, `total_document_count`, subset grouped counts and warnings. Returned rows, logical documents and total matches are distinct units.

## Fixed workflows

S = search_document_content; D = get_document; G = explore_document_graph; L = list_documents. These are notation only, not tool aliases. “Resolve” means one S with question plus applicable exact number filter, followed by copying a matching row's key/version. If ambiguous or no key exists, stop/clarify.

| Function | Required normal sequence | Only permitted exception | Stop condition |
| --- | --- | --- | --- |
| Content Q&A | S → answer | Named context gap: D per necessary source; missing matched evidence: one scoped S per affected source | Supported result or explicit remaining gap |
| Vector/semantic search | S(use_vector=true for vector, use_semantic=true for semantic ranking) → answer | Same content-Q&A repair; report fallback warnings | No repeated “vector” tool loop; keyword-only uses both false |
| Verbatim | Resolve if needed → D(key) → shell save → select span → extract file → render exact file text | None; missing shell/direct response handoff stops | Exact file span produced or precise failure |
| Summary | Resolve if needed → D(key) → six-section summary | None; missing full content is labeled partial | Requested summary with exact Purpose quote when available |
| Comparison | Resolve unknown sources → D per distinct key/version → compare | None; same-document subjects share one fetched context | Both subjects accounted for or explicit partial coverage |
| Purpose | Resolve if needed → D(key) → exact explicit Purpose section | None; absent Purpose is reported | Exact quote or precise absence/unavailability |
| Owner | Unknown key: S → matching document_owner if present; otherwise D(key) → document_owner | One scoped S only if successful fetch has no owner | Verified nonblank owner metadata stops retrieval immediately |
| Outgoing references | Resolve parent if needed → D(parent) → explicit list | One S per requested unresolved reference link; D(target) only for separately requested/necessary operative content | Every requested target has an outcome |
| Graph relationships | G once | One scoped S per identified source for a required operational passage/citation | Findings plus graph limitations; never another speculative G |
| Inventory | L once → calculate subset counts | Valid explicit follow-up may reuse the same inventory | Requested metadata/limits returned |

No global one-call cap is imposed. A comparison of two different documents needs two source contexts; a list of ten requested unresolved references may legitimately need ten distinct lookups. The prohibited calls are those outside the declared sequence or without a named missing item. A repeated invalid payload cannot resolve an input problem.

## Verbatim example and shell contract

Known key:

```json
{"name":"get_document","arguments":{"document_key":"VERIFIED_KEY","document_version":"5.0"}}
```

Unknown key:

```json
{"name":"search_document_content","arguments":{"question":"Quote the freezer alarm procedure in full.","top_k":5}}
```

Copy the actual applicable result's key/version, then execute the known-key fetch. The example key is not a real source identity. The host writes the original returned response directly to `response.json`; the model must not reconstruct it by hand.

```text
python /installed/retrieve-verbatim/scripts/verbatim.py save --response response.json --out-dir request-1 --document-key VERIFIED_KEY --version 5.0
python /installed/retrieve-verbatim/scripts/verbatim.py extract --source-dir request-1 --selection selection.json
python /installed/retrieve-verbatim/scripts/verbatim.py verify --source-dir request-1 --candidate request-1/verbatim.txt
```

Use the actual installed script path and key; shell-quote arguments safely. `selection.json` is data containing exactly `start` and `end` integer offsets into the preserved Python Unicode string. `end` is exclusive. Use `--whole` instead of `--selection` only for an explicitly requested whole document. A section boundary must be determined from the source, not guessed from a requested section number or ranked chunk order.

The helper retains `tool-response.json`, `source.txt` and a source manifest with key/version and SHA-256 hashes. Extraction produces `verbatim.txt`, escaped expanding `verbatim.html` and an extraction manifest. Verification reloads the original response, checks its content against source.txt and compares the actual proposed text with the selected source span. It does not normalize Unicode/whitespace, remove page artifacts, reconstruct flattened tables, certify PDF layout/currency or prove the final UI rendered unchanged. The text artifact is the byte-faithful delivery; the host must separately verify rendered output if it claims visual fidelity.

## Validation messages and recovery

Invalid inputs return JSON-RPC `-32602`, with `data.error_code=INVALID_TOOL_ARGUMENTS`, selected tool, field-level issues, accepted/required fields, example arguments, correction and `retryable=false`. Unknown names or incorrect tools/call wrappers return `INVALID_TOOL_CALL` and supported tool names. Correct once only when the valid input is established; never retry unchanged, silently strip fields, auto-map search arguments to fetch, or expose submitted content in an error.

For get_document({question, top_k}), the response identifies document_key as required, rejects the search fields and directs the caller to resolve through search_document_content. A found=false result is different from malformed input and from a backend failure. Authorization/backend errors keep their existing safe non-disclosure behavior.

## What is enforced where

| Layer | Enforced here | Not established by this change |
| --- | --- | --- |
| Query API | Exact argument schemas, required key, rejection before retrieval, safe correction data, existing auth/scope/lifecycle | The external host's user intent, active request ID, model reasoning effort or tool order across separate calls |
| Verbatim helper | Identity, original-response/content consistency, hashes, offsets, exact source span, safe HTML escaping | Authentic host provenance of a manually supplied file, source PDF layout/currency or final UI rendering |
| Agent instructions/skills | Explicit phase rules and stopping guidance | A hard runtime guarantee that a model will follow every rule |
| Host workflow controller | Must select task, bind request identity, expose only phase-allowed tools, hand original responses to shell and validate final target | Not implemented in this repository; no myAibou runtime source was supplied |

To make “only this path” a hard runtime property, the host must execute these phases rather than expose every tool at every step. For verbatim, allow S only during resolution, D only during fetch, and no MCP retrieval during shell extraction/rendering. No MCP-only schema change can observe or prevent an unrelated later request from a separate host call. Re-run the frozen feature cases after deployment; structural tests do not prove latency or behavioral improvement.

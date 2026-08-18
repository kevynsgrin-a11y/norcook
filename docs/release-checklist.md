# Release checklist (reusable template)

A property is releasable when every gate below has a status, an owner, and — for
anything that is not `PASS` — an exception note saying why and what would change
it. The point is a truthful record, not a wall of green.

Copy this file into a property, fill in the "How it is enforced" column with
real `file:line` references from that property, and record the result in a dated
`release-record.md` beside it. A gate whose enforcement column reads "manual" is
a gate that will rot; prefer to wire it to a test or a script.

**This template is per-property.** Norcook is a single site with no sibling
properties in this repository, so the record next to it — `docs/release-record.md`
— covers Norcook only. Another property gets its own copy of both files, in its
own repository. A portfolio-wide roll-up cannot live here and should not be
faked here.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| `PASS` | Enforced automatically and currently green. |
| `PARTIAL` | Enforced, but narrower than the gate describes. Note the gap. |
| `FAIL` | Not met. Note what would fix it. |
| `BLOCKED` | Cannot be met yet for a stated product reason. Note the blocker. |

`BLOCKED` is not a softer `FAIL`. It is for gates that depend on a decision
outside the codebase — and it must never be turned into a per-commit CI gate,
because a permanently red pipeline pressures whoever is on call to fabricate the
missing fact rather than wait for it.

## Gates

| Gate | What it asserts | How it is enforced |
| --- | --- | --- |
| `mobileOverflow=false` | No horizontal scroll on a 390×844 viewport across the primary journey. | *(fill in)* |
| `focusVisible=true` | Every interactive element shows a visible focus indicator, from one shared token. | *(fill in)* |
| `skipLink=true` | A skip link is the first focusable element and lands in a `<main>` landmark. | *(fill in)* |
| `dialogFocusManaged=true` | Dialogs take focus on open, trap Tab, close on Escape, and restore focus to the opener. | *(fill in)* |
| `securityHeaders=true` | CSP, nosniff, referrer policy, permissions policy, frame options and HSTS are served. | *(fill in)* |
| `consentInventoryCurrent=true` | Every event, its properties and its exclusions are documented, dated and owned, and match the code. | *(fill in)* |
| `manifestDecisionDocumented=true` | The PWA posture — display mode, icon set, service worker or its absence — is a written decision. | *(fill in)* |
| `sitemapAll200=true` | Every `<loc>` in the sitemap returns 200 and is indexable; noindex routes are absent. | *(fill in)* |
| `structuredDataValid=true` | Structured data parses, carries required fields, and asserts nothing unsupported. | *(fill in)* |
| `policyOperatorPublished=true` | The legal operator, jurisdiction and privacy contact are published. | *(fill in)* |
| `safetyOwnersNamed=true` | Safety-sensitive content names a qualified reviewer with scope, evidence, date and decision. | *(fill in)* |
| `thirdPartyBudgetWithinLimit=true` | Third-party requests and total page weight stay inside the stated budget. | *(fill in)* |
| `desktopMobileScreenshotsReviewed=true` | Key routes are captured at both viewports and a human has looked at them. | *(fill in)* |

## Rules of use

1. **Never fabricate a fact to turn a gate green.** `policyOperatorPublished`
   and `safetyOwnersNamed` are the obvious traps: inventing an operator or a
   reviewer to clear a checklist is worse than shipping with the gate red.
2. **Record the date and the commit** the record was taken at. A record with no
   date is a claim about nothing.
3. **Owner may be "unassigned".** Write that rather than inventing a name.
4. **Re-run the record on every release**, not once. A stale record that reads
   green is more dangerous than no record.

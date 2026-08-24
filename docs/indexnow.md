# IndexNow operating guide

Norcook has a root IndexNow ownership file at:

```text
https://www.norcook.app/279f5e63061085792b5a0624353b2647c5d3cde9cc5ea0d1.txt
```

Its complete UTF-8 response must be the key itself. The public file name and
contents must remain identical to `INDEXNOW_KEY`. The protocol key is not an
application secret; `INDEXNOW_AUTH_TOKEN` is the server-only secret that guards
Norcook's dispatch endpoint.

## Enable the dispatch route

Set these production environment variables before calling the route:

```text
INDEXNOW_KEY=279f5e63061085792b5a0624353b2647c5d3cde9cc5ea0d1
INDEXNOW_AUTH_TOKEN=<a separate high-entropy secret>
```

After deployment, first verify the root key file over public HTTPS. Then an
authorized release job may notify only canonical URLs that appear in the live
sitemap:

```bash
curl -X POST https://www.norcook.app/api/indexnow \
  -H "Authorization: Bearer $INDEXNOW_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"urls":["https://www.norcook.app/recipes/gravlaks"]}'
```

The endpoint rejects malformed URLs, non-Norcook origins, URLs not in the
canonical sitemap, batches over 10,000 URLs, and unauthenticated calls. It does
not run during builds, deploys, page views, or sitemap generation. Do not bulk
submit the historic archive when enabling the feature; notify only URLs added
or materially changed after this integration is live. The protected endpoint
intentionally does not submit deleted URLs, because it accepts only URLs that
are still in the canonical sitemap.

An HTTP 200 or 202 from IndexNow confirms receipt, not indexing or ranking.
The protocol details and response meanings are maintained by
[IndexNow](https://www.indexnow.org/documentation); Bing also documents setup
and receipt monitoring in [Bing Webmaster Tools](https://www.bing.com/indexnow/getstarted).

## Bing verification remains external

This repository does not contain a Bing Webmaster verification token and does
not claim Bing Webmaster ownership. A verified owner must obtain a Bing
verification token, choose the supported verification method, and provide the
exact token or file instruction before this application can publish it. The
IndexNow key file proves ownership to the IndexNow protocol only; it is not a
substitute for Bing Webmaster Tools site ownership.

## Rotate deliberately

To rotate the protocol key, generate a new 8-128 character key using only
letters, numbers, and dashes; replace the root key file; update `INDEXNOW_KEY`;
deploy; verify the new public key file; and only then send new notifications.
Rotate `INDEXNOW_AUTH_TOKEN` separately. Do not reuse either value for any
other service.

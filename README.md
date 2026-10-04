# Sigani Studios personal website

An orange-themed, responsive portfolio with GachaTime first, the Quote Order
project second, and standalone GachaTime policy pages. Plain HTML/CSS/JavaScript;
no framework, install step, API, database, or production build is required.

## Preview locally

With Node.js 20 or newer installed, run these commands from this directory:

```powershell
node scripts/check.mjs
node scripts/preview.mjs
```

Open <http://127.0.0.1:4280>. The preview server honors this site's Azure route
rewrites and security headers. Stop it with Ctrl+C.

## Deploy to Azure Static Web Apps (Free)

1. Use the website repository:
   [sigani/sigani-studios-website](https://github.com/sigani/sigani-studios-website).
   Keep its `public/` folder intact; it contains the files Azure should serve.
2. Sign in to the [Azure portal](https://portal.azure.com), search for
   **Static Web Apps**, and choose **Create**.
3. Select your subscription and a resource group. Name the resource something
   like `sigani-studios`. Select the **Free** hosting plan.
4. Choose **GitHub** as the deployment source and authorize the website
   repository. Select organization **sigani**, repository
   **sigani-studios-website**, and branch **main**.
5. Under build details, use these values:

   | Setting | Value |
   | --- | --- |
   | Build preset | **Custom** / **No Framework**, depending on portal wording |
   | App location | `/public` |
   | API location | Leave empty |
   | Output location | Leave empty |

6. Select **Review + create**, then **Create**. Azure adds a GitHub Actions
   workflow and deployment secret. Wait for the repository's **Actions** run
   to succeed, then open the generated `*.azurestaticapps.net` address.
7. In the generated workflow, keep the deploy step's paths as shown below.
   Set `skip_app_build: true` to upload this ready-made static folder
   directly; retain Azure's generated token reference and other workflow fields.

   ```yaml
   app_location: "/public"
   api_location: ""
   output_location: ""
   skip_app_build: true
   ```

Future pushes to the selected branch redeploy the site. `public/` is the whole
deployment artifact, including `staticwebapp.config.json`; repository scripts
and this README are outside it.

References: [Microsoft's portal quickstart](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal?pivots=github&tabs=vanilla-javascript),
[build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration).

## Connect siganistudios.com

Use the **apex domain**, `siganistudios.com`, so your requested RevenueCat URLs
work exactly as written.

1. Open your Static Web App → **Settings → Custom domains → Add**. Enter
   `siganistudios.com` and use TXT validation. Copy Azure's generated token.
2. At your DNS provider, add the TXT record specified by Azure (the documented
   apex example uses host `@`) with that token as its value.
3. Add an apex **ALIAS**, **ANAME**, or provider-supported **CNAME flattening**
   record pointing to your app's `*.azurestaticapps.net` hostname. Do not include
   `https://` or a path in a DNS target.
4. Finish domain validation in Azure and wait for HTTPS provisioning. DNS
   changes may take time to propagate. Azure provides the TLS certificate.
5. Optionally add `www.siganistudios.com` as the second custom domain and point
   its CNAME to the same Azure hostname.

If your DNS provider cannot alias the apex, Microsoft's guide also describes
an A record using Azure's `stableInboundIP` or forwarding to `www`. An A record
reduces global routing benefits. To preserve your exact policy URLs, prefer
direct apex mapping; if you use forwarding, ensure it preserves paths and HTTPS.
Azure DNS is an alternative with separate pricing; it is not required.

References: [apex domain setup](https://learn.microsoft.com/en-us/azure/static-web-apps/apex-domain-external),
[custom domains](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain).

The Free plan currently includes two custom domains and automatic TLS, with a
250 MB per-app size limit and no SLA. This site is far below that size limit.
Domain registration and any paid DNS service are separate costs.
[Hosting-plan details](https://learn.microsoft.com/en-us/azure/static-web-apps/plans).

## Verify before adding RevenueCat links

After deployment and DNS validation, open these directly in a private browser
window, then refresh each:

- <https://siganistudios.com/gachatime/privacy>
- <https://siganistudios.com/gachatime/terms>

Both must return their own document over HTTPS without login. Trailing-slash
variants are also mapped. Missing URLs show a real 404 page, rather than
silently displaying the homepage. Once the policies are finalized and publicly
available, paste these exact URLs into the corresponding RevenueCat fields.
The pages contain the Canada-launch policies; verify that the released app's
data practices match them before submitting a production release.

## Launch readiness

The policies were updated on October 3, 2026 for Jaren operating as Sigani
Studios, using `jaren@siganistudios.com`, a Canada launch, and a recommended 13+
audience. Accounts, leaderboard, and ads are addressed with development versus
available features distinguished. Production purchases are not offered.
See [LAUNCH-NOTES.md](LAUNCH-NOTES.md) for app-side work still required.

- Match the production data flows, Google consent configuration, audience,
  online providers, retention, and deletion process to the policies.
- Update both policies before changing billing, audience, or data practices.
- Replace the LinkedIn feed link with your public profile URL in
  `public/index.html`. The current link is explicitly labeled as a feed link.
- Expand the Quote Order summary once its repository has content. Its supplied
  [repository](https://github.com/sigani/quote-order-system-demo) is retained here
  for reference. Replace the homepage's “View demo site / Coming soon” label
  with a link when the public demo URL is configured.
- Add actual store download links when available. The GachaTime section uses
  the three supplied app screenshots. CSS crops their display to hide phone
  status and gesture bars while preserving the original image files.

## File map

| File | Purpose |
| --- | --- |
| `public/index.html` | Portfolio and project descriptions |
| `public/assets/site.css` | Shared responsive orange theme |
| `public/assets/site.js` | Footer year |
| `public/gachatime/privacy/index.html` | Privacy policy |
| `public/gachatime/terms/index.html` | Terms of use |
| `public/staticwebapp.config.json` | Azure routing, headers, and 404 handling |
| `scripts/preview.mjs` | Local static preview server |
| `scripts/check.mjs` | Local references, anchors, and route checks |

No deployment credentials belong in these files. Let Azure manage the GitHub
deployment secret.

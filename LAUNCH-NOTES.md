# GachaTime launch settings and policy implementation

The privacy and terms pages identify Jaren, operating as Sigani Studios, and
`jaren@siganistudios.com` as the support/privacy contact. They describe a Canada
release with optional rewarded ads, accounts, and leaderboard participation.
Production purchases are held back; GachaTime+ is planned as a one-time product.

13+ with parental permission below the applicable age of majority is the
recommended starting audience. This recommendation is not a store content
rating or a guarantee of compliance. Set the actual store audience, advertising
configuration, and consent flow to match; update the policies if the audience
changes. Avoid behavioural tracking/profiling of young users.

## What must match before the app launch

- Account sign-in and cloud backup are currently preparation, not enabled
  Flutter features. The policies disclose that distinction. Confirm the actual
  sign-in methods and whether cloud backups will be offered before launch.
- The prepared identity provider is Firebase Authentication. Confirm the live
  provider and hosting configuration; revise disclosures if either changes.
- An account deletion request must remove the Firebase identity and associated
  app records, including backups and any linked leaderboard record. The
  existing backup DELETE endpoint alone is insufficient; it leaves a revision
  tombstone and does not delete the identity.
- The public web deletion route is the privacy page's “Access, correction, and
  deletion” section. It provides an email request method. For Google Play,
  provide a discoverable in-app request path too. Test the actual handling
  process before enabling public account creation.
- Document and enforce operational retention: account records, leaderboard
  records, support messages, logs, and provider/server backups. The policy uses
  purpose-based retention rather than inventing fixed periods. Explain lawful
  exceptions to a requester and avoid restoring deleted records from backups.
- Configure AdMob consent/privacy options and audience treatment. The policy
  does not turn using the app into consent for optional advertising. Simulated
  and test ads are not proof that a live ad consent setup works.
- Confirm the leaderboard deployment, HTTPS, request logging, and deletion
  handling. Anonymous installation identifiers are separate from Firebase IDs.
- Do not enable production RevenueCat billing without revising the policy and
  terms, completing store setup, and defining the actual purchase offer.
- Keep the privacy/contact inbox monitored. Verify ownership without asking
  users to email passwords. Respond within applicable legal deadlines.

Publishing these pages does not implement any of the account, consent, hosting,
or deletion features in the GachaTime app. The app repository was not changed
as part of this website request.

## Sources

- [Canadian consent guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/)
- [Canadian advertising privacy guidance](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/gl_ba_1112/)
- [Google Play account-deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Google Mobile Ads consent setup](https://developers.google.com/admob/flutter/privacy)
- [Firebase privacy information](https://firebase.google.com/support/privacy)

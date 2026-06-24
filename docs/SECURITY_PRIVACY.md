# Security And Privacy

## Data Handling

- Collect public-interest data only.
- Do not collect private addresses, private phone numbers, personal profiles, or sensitive personal data.
- Keep official public contact data clearly attributed.
- Avoid copying complaint text into third-party systems unless a user explicitly asks in a future workflow.

## Scraping And Automation

- Respect robots.txt, terms, rate limits, and local law.
- Do not bypass logins, captchas, paywalls, access controls, or anti-bot systems.
- Prefer official APIs, downloads, and partner feeds.

## Product Safety

- Show confidence labels.
- Show source URLs and last checked dates.
- Label missing fields as not publicly available.
- Provide correction flow and moderation before public changes.

## Correction Queue

- Treat correction messages as untrusted user input.
- Do not collect email addresses, phone numbers, or other personal follow-up details in correction intake.
- Do not publish correction content directly into search results.
- Keep local `data/corrections/*.json` artifacts out of Git.
- Replace the local file queue with authenticated, access-controlled storage before public launch.

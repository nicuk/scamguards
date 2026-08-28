type SlackBlock = Record<string, unknown>;

/**
 * Posts to the incoming webhook in SLACK_WEBHOOK_URL.
 *
 * Never throws: notification is best-effort and must not fail the request that
 * triggered it (the underlying record is already persisted by then). Returns
 * whether the message was delivered, for logging only.
 */
export async function notifySlack(
  text: string,
  blocks?: SlackBlock[]
): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    // Loud on the server, silent to the visitor. A missing webhook means a
    // real enquiry was saved with nobody notified, which is worth seeing in
    // the logs rather than discovering weeks later.
    console.warn(
      "[notify-slack] SLACK_WEBHOOK_URL is not set — notification skipped. " +
        "The record was still saved."
    );
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `text` doubles as the notification/fallback text for mobile push
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Slack webhook rejected:", res.status, await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Slack webhook error:", error);
    return false;
  }
}

/** Slack mrkdwn treats these three characters as markup. */
function escapeMrkdwn(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * The webhook posts into #aeorival-signals, which already carries alerts from
 * another property. Every message leads with the site so the two are never
 * confused at a glance.
 */
const SITE_NAME = "ScamGuards";

export type SponsorEnquiryNotification = {
  name: string;
  email: string;
  website?: string | null;
  bidAmount: number;
  message?: string | null;
  topBid: number;
};

export function buildSponsorEnquiryMessage(
  enquiry: SponsorEnquiryNotification
) {
  const beatsTopBid = enquiry.bidAmount > enquiry.topBid;
  const name = escapeMrkdwn(enquiry.name);
  const email = escapeMrkdwn(enquiry.email);

  const fields = [
    `*Name*\n${name}`,
    `*Email*\n${email}`,
    `*Bid*\n$${enquiry.bidAmount}${beatsTopBid ? " 🔥 tops the board" : ""}`,
    `*Current top bid*\n$${enquiry.topBid}`,
  ];

  if (enquiry.website) {
    fields.push(`*Website*\n${escapeMrkdwn(enquiry.website)}`);
  }

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: beatsTopBid
          ? `💰 ${SITE_NAME} — sponsor bid beats the top slot`
          : `💬 ${SITE_NAME} — sponsorship enquiry`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: fields.map((text) => ({ type: "mrkdwn", text })),
    },
  ];

  if (enquiry.message) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Message*\n>${escapeMrkdwn(enquiry.message).slice(0, 1500)}`,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `${SITE_NAME} · sponsored slots · scamguards.app`,
      },
    ],
  });

  return {
    text: `${SITE_NAME}: sponsorship enquiry from ${name} — $${enquiry.bidAmount}`,
    blocks,
  };
}

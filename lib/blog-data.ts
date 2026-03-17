export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  excerpt: string;
  keywords: string[];
  sections: { heading: string; content: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-spot-tcg-scam-malaysia",
    title: "How to Spot a TCG Card Scam in Malaysia (2025 Guide)",
    metaTitle:
      "How to Spot a TCG Card Scam in Malaysia - One Piece, Pokemon | ScamGuards",
    metaDescription:
      "Complete guide to spotting fake TCG sellers in Malaysia. Covers WhatsApp groups, Carousell, Facebook. Protect yourself from One Piece and Pokemon card scams.",
    publishedAt: "2025-03-15",
    updatedAt: "2025-03-18",
    readingTime: "5 min read",
    excerpt:
      "The TCG scene in Malaysia is booming — and so are the scammers. Here's exactly how to protect yourself when buying One Piece, Pokemon, or Dragon Ball cards online.",
    keywords: [
      "tcg scam malaysia",
      "one piece card scam",
      "pokemon card scam",
      "how to spot fake tcg seller",
      "whatsapp group scam",
    ],
    sections: [
      {
        heading: "Why TCG Scams Are Exploding in Malaysia",
        content:
          "The One Piece TCG and Pokemon card markets have exploded in Malaysia. Rare cards sell for hundreds or even thousands of ringgit. Where there's money, scammers follow. WhatsApp groups, Facebook Marketplace, and Carousell have become hunting grounds for fake sellers who post stolen photos of rare cards, collect bank transfers, and vanish.\n\nThe founder of ScamGuards was personally scammed in a WhatsApp group called \"COZ on One Piece\" that claimed to filter out scammers. They didn't. This is why ScamGuards exists.",
      },
      {
        heading: "The 5 Biggest Red Flags",
        content:
          "1. **Direct bank transfer only** — Legitimate sellers are happy to use COD or platform escrow. Scammers insist on direct transfers because they can't be reversed.\n\n2. **New accounts with no history** — Check how long the seller's account has existed and whether reviews look genuine.\n\n3. **Stolen product photos** — Do a reverse image search. Scammers download photos from Japanese or US sellers.\n\n4. **Too-good prices** — A RM500 card listed for RM200 isn't a deal. It's bait.\n\n5. **Pressure to pay fast** — \"Someone else wants it\" or \"I have 3 people messaging me\" — classic pressure tactics.",
      },
      {
        heading: "How to Protect Yourself",
        content:
          "**Before paying anyone, do this:**\n\n1. Copy the seller's phone number or bank account number\n2. Paste it into ScamGuards (scamguards.app/search)\n3. Check if there are existing reports against them\n4. If clean, still use COD or platform-protected payment\n5. Ask for a video call showing the cards with your name on paper\n\nThis 10-second check could save you hundreds of ringgit.",
      },
      {
        heading: "What to Do If You Got Scammed",
        content:
          "1. **Report to ScamGuards immediately** — paste the scammer's phone number, bank account, and your story at scamguards.app/submit. This warns the next buyer.\n\n2. **Contact your bank** — ask them to attempt a recall on the transfer. The faster you do this, the better chance you have.\n\n3. **File a police report** — go to your nearest balai polis and file a report. Bring screenshots of the chat, payment proof, and the listing.\n\n4. **Report to the platform** — if it was on Carousell or Facebook, report the account so it gets banned.\n\n5. **Warn the community** — post in the WhatsApp group or Facebook community so others know.",
      },
    ],
  },
  {
    slug: "what-to-do-if-scammed-whatsapp-malaysia",
    title: "What to Do If You Got Scammed on WhatsApp in Malaysia",
    metaTitle:
      "Got Scammed on WhatsApp? What to Do in Malaysia | ScamGuards",
    metaDescription:
      "Step-by-step guide for Malaysians who got scammed through WhatsApp. How to report to police, bank recall, and protect others from the same scammer.",
    publishedAt: "2025-03-16",
    updatedAt: "2025-03-18",
    readingTime: "4 min read",
    excerpt:
      "Scammed through WhatsApp? Don't panic. Here are the exact steps to take right now — from bank recall to police report to warning others.",
    keywords: [
      "scammed on whatsapp",
      "what to do after scam malaysia",
      "report whatsapp scammer",
      "kena tipu whatsapp",
      "how to report scammer malaysia",
    ],
    sections: [
      {
        heading: "First 30 Minutes Are Critical",
        content:
          "If you've just been scammed, the clock is ticking. The faster you act, the higher the chance of recovering your money. Here's what to do right now, in this order:\n\n1. **Call your bank immediately** — Use the fraud/scam hotline, not the general line. Tell them you want to request a fund recall. The receiving bank can freeze the account if the money hasn't been withdrawn yet.\n\n2. **Screenshot everything** — Before the scammer blocks you, screenshot the entire WhatsApp conversation, their profile photo, phone number, and any bank account details they sent.\n\n3. **Do NOT delete the chat** — You'll need it as evidence for the police report.",
      },
      {
        heading: "File a Police Report",
        content:
          "Go to your nearest police station and file a report. Bring:\n\n- Screenshots of the WhatsApp conversation\n- Bank transfer receipt/proof\n- The scammer's phone number and bank account details\n- Any other communications (emails, social media)\n\nAsk for the report number — you'll need it for your bank's investigation. You can also report online through CCID's portal or call the CCID hotline at 03-2610 1559.",
      },
      {
        heading: "Report on ScamGuards",
        content:
          "This is where you help the next person. Go to scamguards.app/submit and:\n\n1. Paste the scammer's phone number, bank account, and any other details\n2. Select the scam type (e-commerce, investment, etc.)\n3. Describe what happened\n\nOur AI will extract the key identifiers from your report and add them to our database. The next person who checks that phone number or bank account will see the warning — and hopefully avoid losing their money.\n\nYou can report anonymously. No sign-up needed.",
      },
      {
        heading: "Bank Fraud Hotlines in Malaysia",
        content:
          "Keep these numbers saved in your phone:\n\n- **Maybank**: 03-5891 4744 (24/7 fraud hotline)\n- **CIMB**: 03-6204 7788\n- **Public Bank**: 03-2176 6000\n- **RHB**: 03-9206 8118\n- **Hong Leong**: 03-7626 8899\n- **Bank Islam**: 03-2690 0900\n- **AmBank**: 03-2178 8888\n- **CCID (Police)**: 03-2610 1559\n- **BNM LINK & BNMTELELINK**: 1-300-88-5465\n\nCall your bank's fraud line first — they can initiate a recall faster than a general customer service line.",
      },
    ],
  },
  {
    slug: "protect-yourself-online-scams-malaysia",
    title: "10 Rules to Protect Yourself from Online Scams in Malaysia",
    metaTitle:
      "10 Rules to Avoid Online Scams in Malaysia (2025) | ScamGuards",
    metaDescription:
      "Simple, practical rules every Malaysian should follow to avoid online scams. From shopping to investing to dating — protect your money with these habits.",
    publishedAt: "2025-03-17",
    updatedAt: "2025-03-18",
    readingTime: "6 min read",
    excerpt:
      "You don't need to be tech-savvy to avoid scams. These 10 simple rules cover shopping, investing, dating, and phone calls — the 4 areas where Malaysians lose the most money.",
    keywords: [
      "how to avoid scams malaysia",
      "online safety malaysia",
      "protect from scammers",
      "cara elak penipu",
      "online scam prevention",
    ],
    sections: [
      {
        heading: "Rule 1-3: Before You Pay",
        content:
          "**Rule 1: Check first, pay later.** Before you transfer money to anyone you don't personally know, spend 10 seconds checking their details on ScamGuards (scamguards.app/search). Paste their phone number, bank account, or email. It's free.\n\n**Rule 2: Never pay outside the platform.** If you're buying on Shopee, Carousell, or Lazada — ALWAYS pay through the platform. If the seller asks you to \"deal direct\" via bank transfer, they're removing your buyer protection on purpose.\n\n**Rule 3: If it sounds too good, it is.** A PS5 for RM800? A rare One Piece card for half price? An investment with 10% monthly returns? There are no shortcuts. Unrealistic prices and returns are the #1 tool scammers use.",
      },
      {
        heading: "Rule 4-6: Red Flags to Watch",
        content:
          "**Rule 4: Urgency is a weapon.** \"Pay now or lose the deal.\" \"Your account will be frozen in 1 hour.\" \"Only 2 slots left.\" Scammers create urgency because they don't want you to think. Real opportunities wait. Scams don't.\n\n**Rule 5: No legitimate authority asks for money over the phone.** Police, LHDN, courts, banks — none of them will ever call you and ask you to transfer money. If someone calls claiming to be from an authority and asks for money, hang up immediately.\n\n**Rule 6: Verify independently.** If someone claims to be from Maybank, hang up and call Maybank yourself at the number on their website. If someone says they're police, call 999. Never use a phone number the caller gives you — they'll just redirect you to another scammer.",
      },
      {
        heading: "Rule 7-8: Protect Your Information",
        content:
          "**Rule 7: Your IC number is not a password.** Many Malaysians share their IC number freely. Scammers use leaked IC data to build credibility (\"We have your IC number, this is a real investigation\"). Having your IC doesn't make someone legitimate.\n\n**Rule 8: Don't click links from strangers.** Phishing links look exactly like real bank login pages. If you get an SMS from \"Maybank\" with a link, don't click it. Open the Maybank app directly or type the URL yourself. This applies to emails, WhatsApp messages, and social media DMs.",
      },
      {
        heading: "Rule 9-10: When In Doubt",
        content:
          "**Rule 9: Talk to someone first.** Scammers isolate you. They say \"don't tell anyone\" or \"this is confidential.\" The moment someone asks you not to talk to your family or friends about a financial decision, it's a massive red flag. Always discuss with someone you trust before making large transfers.\n\n**Rule 10: Report even if you're embarrassed.** Thousands of Malaysians get scammed every day — including smart, educated people. Scammers are professionals. There is no shame in being targeted. But by reporting (on ScamGuards, to police, to your bank), you prevent the next victim. Your report matters.",
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

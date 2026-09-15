/** One step in a numbered step diagram. `body` supports **bold**. */
export interface BlogStep {
  title: string;
  body: string;
}

/** A screenshot shown under a section. Dimensions are the file's intrinsic size. */
export interface BlogFigure {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface BlogSection {
  heading: string;
  content: string;
  /** Rendered as a numbered step diagram after the section text. */
  steps?: BlogStep[];
  /** Short label above the step diagram, e.g. "Report in 3 steps". */
  stepsLabel?: string;
  /** Screenshots after the text (and diagram), side by side on wider screens. */
  figures?: BlogFigure[];
}

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
  /** Article language. Omitted means English. */
  language?: "en" | "ms";
  /**
   * The same article in the other language. Drives the language link under the
   * title and the hreflang alternates. (Named with a capital S on purpose: the
   * content verifier counts `slug:` occurrences to find posts.)
   */
  translationSlug?: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-spot-tcg-scam-malaysia",
    title: "How to Spot a TCG Card Scam in Malaysia (2025 Guide)",
    metaTitle:
      "How to Spot a TCG Card Scam in Malaysia | ScamGuards",
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
          "The One Piece TCG and Pokemon card markets have exploded in Malaysia. Rare cards sell for hundreds or even thousands of ringgit. Where there's money, scammers follow.\n\nIn 2024, Malaysia recorded 14,881 e-commerce fraud cases with RM123.7 million in losses (Source: CCID/PDRM). WhatsApp groups, Facebook Marketplace, and Carousell have become hunting grounds for fake sellers who post stolen photos of rare cards, collect bank transfers, and vanish. MCMC removed 66,507 scam-related posts in 2024 alone.\n\nThe founder of ScamGuards was personally scammed in a WhatsApp group called \"COZ on One Piece\" that claimed to filter out scammers. They didn't. This is why ScamGuards exists.",
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
          "If you've just been scammed, the clock is ticking. The faster you act, the higher the chance of recovering your money. In 2025, Malaysians lost RM2.77 billion to scams — a 76% increase from 2024 (Source: Home Ministry/PDRM). Most of this money is unrecoverable because victims wait too long.\n\nHere's what to do right now, in this order:\n\n1. **Call your bank immediately** — Use the fraud/scam hotline, not the general line. Tell them you want to request a fund recall. The receiving bank can freeze the account if the money hasn't been withdrawn yet.\n\n2. **Screenshot everything** — Before the scammer blocks you, screenshot the entire WhatsApp conversation, their profile photo, phone number, and any bank account details they sent.\n\n3. **Do NOT delete the chat** — You'll need it as evidence for the police report.",
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
          "Malaysia lost RM2.77 billion to scams in 2025 and RM1.57 billion in 2024 (Source: Home Ministry/PDRM). That's over RM4 billion in two years. These three rules alone would have prevented most of it.\n\n**Rule 1: Check first, pay later.** Before you transfer money to anyone you don't personally know, spend 10 seconds checking their details on ScamGuards (scamguards.app/search). Paste their phone number, bank account, or email. It's free.\n\n**Rule 2: Never pay outside the platform.** If you're buying on Shopee, Carousell, or Lazada — ALWAYS pay through the platform. If the seller asks you to \"deal direct\" via bank transfer, they're removing your buyer protection on purpose.\n\n**Rule 3: If it sounds too good, it is.** A PS5 for RM800? A rare One Piece card for half price? An investment with 10% monthly returns? There are no shortcuts. Unrealistic prices and returns are the #1 tool scammers use.",
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
  {
    slug: "how-to-report-scammer-malaysia",
    title: "How to Report a Scammer in Malaysia: Complete Guide (2025)",
    metaTitle:
      "How to Report a Scammer in Malaysia - Step by Step Guide | ScamGuards",
    metaDescription:
      "Complete guide to reporting scammers in Malaysia. Report to police (PDRM), CCID, NSRC 997, Bank Negara, MCMC, and ScamGuards. Step-by-step with hotline numbers.",
    publishedAt: "2025-03-19",
    updatedAt: "2025-03-23",
    readingTime: "7 min read",
    excerpt:
      "Got scammed? Here's every way to report a scammer in Malaysia — police, bank, CCID, NSRC, MCMC, and community databases. With exact hotline numbers and what to bring.",
    keywords: [
      "how to report scammer malaysia",
      "report scammer malaysia",
      "lapor penipu malaysia",
      "CCID report scam",
      "NSRC 997",
      "report online scam malaysia",
      "how to file scam report malaysia",
      "report fraud malaysia police",
    ],
    sections: [
      {
        heading: "Where to Report a Scammer in Malaysia (All Channels)",
        content:
          "There is no single place to report scammers in Malaysia. You need to report to multiple channels to maximise your chance of recovering money and getting the scammer caught. Here is every channel available to Malaysians, in the order you should use them.\n\n**The golden rule: act within 30 minutes.** After 30 minutes, the scammer has likely withdrawn your money. Every minute counts.\n\nHere are the 6 channels, ranked by urgency:\n\n1. **Your bank's fraud hotline** — to freeze and recall the transfer\n2. **NSRC (National Scam Response Centre) — 997** — coordinates between banks, telcos, and police\n3. **Police report (PDRM)** — official record needed for bank investigation\n4. **CCID (Commercial Crime Investigation Department)** — 03-2610 1559\n5. **MCMC** — to report scam phone numbers, websites, and social media accounts\n6. **ScamGuards** — community database that warns the next person",
      },
      {
        heading: "Step 1: Call Your Bank Immediately",
        content:
          "This is the single most important step. Call your bank's **fraud hotline** (not general customer service) and request a **fund recall**. The bank contacts the receiving bank to freeze the scammer's account before they can withdraw.\n\n**Bank fraud hotlines (save these now):**\n\n- **Maybank**: 03-5891 4744 (24/7)\n- **CIMB**: 03-6204 7788\n- **Public Bank**: 03-2176 6000\n- **RHB**: 03-9206 8118\n- **Hong Leong**: 03-7626 8899\n- **Bank Islam**: 03-2690 0900\n- **AmBank**: 03-2178 8888\n- **Bank Rakyat**: 03-2612 9600\n- **BSN**: 1-300-88-1900\n- **Affin Bank**: 03-2055 9000\n\nTell the operator: \"I've been scammed. I need a fund recall on a transfer I just made.\" Give them the transaction reference, amount, time, and the recipient's account number.",
      },
      {
        heading: "Step 2: Call NSRC at 997",
        content:
          "The **National Scam Response Centre (NSRC)** was launched by Bank Negara Malaysia in October 2022 specifically to handle scam cases. Call **997** (operating hours: 8am to 8pm daily).\n\nNSRC coordinates between your bank, the receiving bank, and telcos in real time. They can freeze suspicious accounts faster than going through individual banks.\n\n**What to tell NSRC:**\n- Your name and IC number\n- The bank and account number you transferred FROM\n- The bank and account number you transferred TO\n- The amount and time of transfer\n- Brief description of the scam\n\nNSRC will assign a case reference number. Keep this — you'll need it for the police report.",
      },
      {
        heading: "Step 3: File a Police Report",
        content:
          "Go to your nearest **balai polis** and file a report under commercial crime. You can also report online at https://sfrv2.rmp.gov.my/ (SFRV2 system).\n\n**Bring these documents:**\n- Screenshots of ALL conversations with the scammer (WhatsApp, Telegram, etc.)\n- Bank transfer receipt / proof of payment\n- The scammer's phone number, bank account, email, or social media profile\n- NSRC case reference number (if you called 997)\n- Any product listings or advertisements you responded to\n\nThe police will give you a report number. Your bank may require this to proceed with the fund recall investigation.\n\nFor complex cases, contact **CCID** directly at **03-2610 1559** or visit the CCID office at Menara KPJ, Bukit Aman.",
      },
      {
        heading: "Step 4: Report to MCMC and the Platform",
        content:
          "**MCMC (Malaysian Communications and Multimedia Commission)** handles scam phone numbers, fake websites, and fraudulent social media accounts. In 2024, MCMC removed 66,507 scam-related posts and blocked 209,990 scam phone numbers.\n\nReport to MCMC:\n- Website: https://aduan.skmm.gov.my/\n- Email: aduan@mcmc.gov.my\n- Hotline: 1-800-888-030\n\n**Platform-specific reporting:**\n- **WhatsApp**: Long-press the message → Report → Block\n- **Telegram**: Tap the profile → Report\n- **Facebook/Instagram**: Profile → Report → Scam or fraud\n- **Shopee**: Order page → Report seller\n- **Carousell**: Listing → Report → Scam\n- **Lazada**: Contact customer service via chat",
      },
      {
        heading: "Step 5: Report on ScamGuards (Warn the Next Person)",
        content:
          "Official channels protect you. ScamGuards protects everyone else.\n\nGo to **scamguards.app/submit** and paste the scammer's details — phone number, bank account, email, or your entire chat conversation. Our AI extracts the identifiers automatically.\n\nWhy this matters: the next time someone is about to pay this scammer, they can check their details on ScamGuards first and see your warning. Your report could save someone else's money.\n\n**It takes 2 minutes. No sign-up needed. Completely anonymous.**\n\nSince launch, ScamGuards reports have been checked thousands of times. Every report makes the database smarter and the community safer.",
      },
      {
        heading: "What Happens After You Report?",
        content:
          "**Realistic expectations:**\n\n- **Bank fund recall**: Success depends on speed. If reported within 30 minutes, there's a reasonable chance. After 24 hours, recovery drops to near zero for domestic transfers.\n- **Police investigation**: CCID investigates but cases take weeks to months. Complex syndicates may take longer.\n- **MCMC action**: Phone numbers get blocked, websites get taken down, social media accounts get removed. This prevents the scammer from reaching new victims.\n- **ScamGuards**: Your report is live immediately. Anyone who checks that phone number or bank account will see the warning.\n\n**Don't blame yourself.** In 2025, Malaysians lost RM2.77 billion to scams — a 76% increase from 2024. Scammers are professionals running industrial-scale operations. The fact that you're reporting means you're already helping to fight back.",
      },
    ],
  },
  {
    slug: "malaysia-scam-statistics-2025",
    title: "Malaysia Scam Statistics 2025: RM2.77 Billion Lost",
    metaTitle:
      "Malaysia Scam Statistics 2025 - How Much Are We Losing? | ScamGuards",
    metaDescription:
      "Malaysia lost RM2.77 billion to scams in 2025 (76% increase). Breakdown by scam type, year-over-year trends, and official PDRM/CCID data with sources.",
    publishedAt: "2025-03-20",
    updatedAt: "2025-03-23",
    readingTime: "6 min read",
    excerpt:
      "Malaysians lost RM2.77 billion to scams in 2025 alone — a 76% increase from 2024. Here's the full breakdown by scam type, with official PDRM and Home Ministry data.",
    keywords: [
      "malaysia scam statistics 2025",
      "how much lost to scams malaysia",
      "scam losses malaysia",
      "PDRM scam data",
      "CCID scam statistics",
      "penipuan statistik malaysia",
      "scam trend malaysia",
    ],
    sections: [
      {
        heading: "The Numbers: RM5.62 Billion Lost in 3 Years",
        content:
          "Malaysia's scam epidemic is accelerating. Here are the official figures from PDRM (Royal Malaysia Police), CCID (Commercial Crime Investigation Department), and the Home Ministry:\n\n**Year-by-year losses:**\n- **2023**: RM1.28 billion (Source: Home Ministry)\n- **2024**: RM1.57 billion across 67,735 cases (Source: CCID annual report)\n- **2025**: RM2.77 billion — a **76% increase** from 2024 (Source: Home Ministry)\n\n**Three-year total: RM5.62 billion.** That's more than the annual budget of several Malaysian ministries combined.\n\nThe trend is clear: scam losses are not just growing — they're accelerating. 2025's RM2.77 billion is more than double the 2023 figure.",
      },
      {
        heading: "Breakdown by Scam Type (2024 CCID Data)",
        content:
          "CCID's 2024 annual data provides the most detailed breakdown available:\n\n**By financial losses:**\n- **Investment scams**: RM1.37 billion — the biggest money drain by far. Fake forex platforms, crypto schemes, and \"guaranteed returns\" operations.\n- **Telecom/Macau scams**: RM715.7 million — phone impersonation of police, judges, or bank officers demanding immediate transfers.\n- **E-finance scams**: RM458.1 million — online banking fraud, unauthorised access, and SIM swap attacks.\n- **E-commerce scams**: RM123.7 million across 14,881 cases — fake sellers on Shopee, Carousell, WhatsApp, and Facebook Marketplace.\n- **Love scams**: RM43.7 million — romance scams on dating apps and social media.\n\n**By case count:**\nMacau scams (phone impersonation) have the highest case count, even though investment scams cause bigger per-case losses. This means Macau scams affect more people but for smaller amounts, while investment scams destroy fewer victims but for devastating sums.",
      },
      {
        heading: "Who Gets Scammed?",
        content:
          "**Scams do not discriminate.** Common misconceptions:\n\n- \"Only old people get scammed\" — **False.** CCID data shows victims span all age groups. Young adults (25-40) are heavily represented in investment and e-commerce scams.\n- \"Only uneducated people get scammed\" — **False.** Professionals, doctors, lawyers, and engineers are common victims of Macau scams and investment fraud. The scams are designed by professionals.\n- \"Only greedy people get scammed\" — **False.** Love scams target loneliness. Job scams target desperation. Macau scams target fear of authority.\n\n**The average Malaysian encounters 3-5 scam attempts per month** through SMS, WhatsApp, phone calls, and social media. The question is not whether you'll be targeted — it's whether you'll recognise it when it happens.",
      },
      {
        heading: "MCMC Enforcement Actions (2024)",
        content:
          "The Malaysian Communications and Multimedia Commission (MCMC) reported the following enforcement actions in 2024:\n\n- **66,507 scam-related posts removed** from social media platforms\n- **209,990 scam phone numbers blocked** from the telecommunications network\n- **Coordination with Meta, TikTok, and Telegram** for faster content takedown\n\nDespite these efforts, scam losses increased 76% in 2025. The volume of scam operations is outpacing enforcement capacity. This is why community-driven tools like ScamGuards exist — to fill the gap between official enforcement and the speed at which scammers operate.",
      },
      {
        heading: "What Can You Do?",
        content:
          "**Before you pay anyone online:**\n1. Check their phone number, email, or bank account on **ScamGuards** (scamguards.app/search) — it takes 10 seconds and it's free\n2. Never pay outside platform escrow (Shopee, Lazada, Carousell)\n3. If it sounds too good to be true, it is\n\n**If you've been scammed:**\n1. Call your bank's fraud hotline immediately\n2. Call NSRC at 997\n3. File a police report\n4. Report on ScamGuards (scamguards.app/submit) to warn others\n\n**The statistics are alarming, but every report helps.** When you report a scammer on ScamGuards, the next person who checks that number sees your warning. Community intelligence is the fastest defence against fraud.\n\n**Sources:** PDRM Annual Report 2024, CCID Commercial Crime Statistics 2024, Home Ministry Parliament Reply 2025, MCMC Annual Report 2024, Bank Negara Malaysia NSRC Report.",
      },
    ],
  },
  {
    slug: "how-to-get-money-back-scammed-malaysia",
    title: "How to Get Your Money Back After Being Scammed in Malaysia",
    metaTitle:
      "Get Money Back After Scam in Malaysia - Fund Recall Guide | ScamGuards",
    metaDescription:
      "Scammed and want your money back? Step-by-step fund recall guide for Malaysia. 30-minute window, bank hotlines, NSRC 997, and realistic recovery expectations.",
    publishedAt: "2025-03-21",
    updatedAt: "2025-03-23",
    readingTime: "5 min read",
    excerpt:
      "Lost money to a scammer? You have a 30-minute window to act. Here's exactly how the fund recall process works in Malaysia and what your realistic chances are.",
    keywords: [
      "get money back after scam malaysia",
      "fund recall malaysia",
      "recover money from scammer",
      "bank recall transfer malaysia",
      "scam money recovery malaysia",
      "boleh dapat balik duit kena tipu",
    ],
    sections: [
      {
        heading: "The 30-Minute Window: Why Speed Is Everything",
        content:
          "When you transfer money to a scammer, it doesn't disappear instantly. The money sits in the receiving bank account until someone withdraws it. This is your window.\n\n**Within 30 minutes:** High chance of recovery. The receiving bank can freeze the account before withdrawal.\n**Within 1-3 hours:** Moderate chance. Depends on whether the scammer has already moved the money.\n**Within 24 hours:** Low chance. Most scammers withdraw or transfer within hours.\n**After 24 hours:** Very low chance for domestic transfers. Near zero for international transfers.\n\nThis is why the first thing you must do — before screenshots, before police reports, before anything else — is **call your bank's fraud hotline**.",
      },
      {
        heading: "Step 1: Call Your Bank's Fraud Hotline (Right Now)",
        content:
          "Do NOT use the general customer service line. Use the **fraud/scam-specific hotline**:\n\n- **Maybank**: 03-5891 4744 (24/7)\n- **CIMB**: 03-6204 7788\n- **Public Bank**: 03-2176 6000\n- **RHB**: 03-9206 8118\n- **Hong Leong**: 03-7626 8899\n- **Bank Islam**: 03-2690 0900\n- **AmBank**: 03-2178 8888\n\nSay exactly this: **\"I've been scammed. I need a fund recall on my last transfer.\"**\n\nGive them:\n- Transaction date and time\n- Amount transferred\n- Recipient's bank and account number\n- Transaction reference number (from your banking app)\n\nThe bank will contact the receiving bank to request an account freeze. If the money is still there, it gets frozen pending investigation.",
      },
      {
        heading: "Step 2: Call NSRC at 997",
        content:
          "Immediately after your bank, call **997** — the National Scam Response Centre.\n\nNSRC operates as a coordination hub between banks, telcos, and law enforcement. They can:\n- **Fast-track the freeze request** across banks\n- **Block the scammer's phone number** through telcos\n- **Assign a case reference** that links your police report, bank investigation, and MCMC complaint\n\nOperating hours: 8am to 8pm daily. Outside these hours, your bank's fraud hotline is the primary channel.\n\nNSRC was launched in October 2022 and has processed thousands of cases. Having an NSRC case reference strengthens your bank's investigation.",
      },
      {
        heading: "Step 3: File a Police Report (Required for Bank Investigation)",
        content:
          "Your bank will likely require a police report number to proceed with the fund recall investigation. Go to your nearest **balai polis** or file online at https://sfrv2.rmp.gov.my/.\n\n**What to bring:**\n- IC card\n- Phone with all chat screenshots\n- Bank transfer receipt\n- NSRC case reference (if you called 997)\n- Scammer's details (phone, bank account, email, social media)\n\nThe police report creates an official record. CCID may contact you for additional details if the case is linked to a larger syndicate.\n\nOnce you have the police report number, call your bank again and provide it. This usually triggers a formal investigation.",
      },
      {
        heading: "Realistic Expectations: Will I Actually Get My Money Back?",
        content:
          "**Honest answer: it depends on speed and luck.**\n\n- **Reported within 30 minutes, money still in account:** Good chance of full recovery. The freeze works and the money is returned after investigation (typically 14-30 working days).\n- **Reported within hours, money partially withdrawn:** You may recover whatever remains in the account.\n- **Reported after 24 hours:** Recovery is unlikely for the original transfer. However, if the scammer is caught later, there may be restitution through the court process.\n- **International transfers:** Extremely difficult to recover. Cross-border fund recalls require coordination between countries and can take months with no guarantee.\n\n**What you should NOT do:**\n- Don't pay anyone who claims they can \"recover\" your money for a fee — this is a **recovery scam**, the second scam after the first.\n- Don't engage with the scammer further — they may try to extract more money.\n- Don't delete any evidence — screenshots, chat logs, transfer receipts.\n\n**Regardless of recovery chances, always report.** Your police report and ScamGuards report (scamguards.app/submit) help catch the scammer and protect others.",
      },
    ],
  },
  {
    slug: "shopee-carousell-scams-malaysia",
    title: "Shopee & Carousell Scams in Malaysia: How to Check a Seller Before You Pay",
    metaTitle:
      "Is This Shopee or Carousell Seller a Scam? How to Check | ScamGuards",
    metaDescription:
      "Seller moved you to WhatsApp or asked for a bank transfer? That's the top scam sign on Shopee, Carousell and Lazada in Malaysia. How to check a seller first.",
    publishedAt: "2025-03-22",
    updatedAt: "2025-03-23",
    readingTime: "6 min read",
    excerpt:
      "E-commerce fraud cost Malaysians RM123.7 million in 2024. Here's how to spot fake sellers on Shopee, Carousell, and Lazada — and what to do if you've already paid.",
    keywords: [
      "shopee scammer malaysia",
      "carousell scam malaysia",
      "lazada scam",
      "fake seller malaysia",
      "online shopping scam malaysia",
      "e-commerce fraud malaysia",
      "penipu shopee",
    ],
    sections: [
      {
        heading: "RM123.7 Million Lost to E-Commerce Scams in 2024",
        content:
          "E-commerce scams are the most common type of fraud in Malaysia by case count. CCID recorded **14,881 cases** in 2024 with total losses of **RM123.7 million** (Source: CCID 2024).\n\nThe scam is simple: a seller lists a product (often at an attractive price), collects payment, and disappears. Or they send a fake/empty package and dispute your refund claim.\n\nThe three most targeted platforms in Malaysia:\n- **Shopee** — largest user base, most scam reports\n- **Carousell** — peer-to-peer selling with less built-in protection\n- **Facebook Marketplace / WhatsApp groups** — zero buyer protection\n\nLazada and Mudah.my also see scam activity, but Shopee and Carousell dominate the reports.",
      },
      {
        heading: "Red Flags: How to Spot a Fake Seller",
        content:
          "**On Shopee:**\n- New shop (less than 3 months old) with suspiciously high ratings but few reviews\n- Product photos look too professional or are clearly from another listing\n- Price significantly below market (a RM300 item for RM99)\n- Seller asks you to \"deal outside Shopee\" via WhatsApp or direct bank transfer\n- Vague or copied product descriptions\n\n**On Carousell:**\n- Account created recently with no prior listings or reviews\n- Only accepts bank transfer (refuses meetup or COD)\n- Multiple high-value items listed simultaneously — looks like a catalogue, not a personal seller\n- Refuses to video call or show the actual item\n- Uses pressure: \"another buyer is waiting\" or \"price valid today only\"\n\n**Universal red flags:**\n- **Any seller who asks you to pay outside the platform** is removing your buyer protection on purpose. This is the single biggest red flag.\n- **Stolen product photos** — do a reverse image search on Google Images.\n- **Refuses COD or meetup** for local transactions.",
      },
      {
        heading: "How to Protect Yourself When Buying Online",
        content:
          "**Before you pay:**\n\n1. **Check the seller on ScamGuards** — go to scamguards.app/search and paste their phone number or bank account. Takes 10 seconds.\n2. **ALWAYS pay through the platform** — Shopee Guarantee and Carousell Protection exist for a reason. If you pay via bank transfer, you have zero recourse.\n3. **Check the seller's history** — look at review dates, review content (are they all generic?), how long the shop has been active, and response rate.\n4. **Ask for a live photo or video** — request a photo of the item with a piece of paper showing your username and today's date. Real sellers will comply; scammers won't.\n5. **Use COD when possible** — especially for high-value items and local transactions. Inspect before you pay.\n\n**For Carousell specifically:**\nUse **CarouPay** or **Carousell Protection** for payment. This holds the money in escrow until you confirm receipt. Never bank transfer to a Carousell seller you haven't verified.",
      },
      {
        heading: "What to Do If You've Been Scammed on Shopee or Carousell",
        content:
          "**If you paid through the platform:**\n1. Open a dispute immediately — Shopee: go to Order → Request Return/Refund. Carousell: open a dispute through Carousell Protection.\n2. Upload all evidence — screenshots of the listing, chat with seller, photos of what you received (or didn't receive).\n3. The platform will mediate and usually refund if you used their payment system.\n\n**If you paid via bank transfer (outside the platform):**\n1. **Call your bank's fraud hotline immediately** — request a fund recall. Speed matters.\n2. **Call NSRC at 997** — National Scam Response Centre.\n3. **File a police report** at your nearest balai polis.\n4. **Report on ScamGuards** (scamguards.app/submit) — paste the scammer's phone number, bank account, and your conversation. AI extracts the details.\n5. **Report the seller on the platform** — even though you paid outside it, getting the account banned prevents the next victim.\n\n**Important:** If you paid outside the platform, the platform (Shopee, Carousell) cannot help you with refunds. This is exactly why scammers ask you to pay outside.",
      },
      {
        heading: "Common E-Commerce Scam Tactics in Malaysia",
        content:
          "**The \"COD but actually bank transfer\" trick:**\nSeller agrees to COD but then messages you: \"Sorry, I can't COD today. Can you bank transfer first? I'll deliver tomorrow.\" Once you transfer, they disappear.\n\n**The empty box scam:**\nSeller ships an empty box or a cheap random item. When you file a dispute, they show a \"proof of delivery\" with tracking. Platforms sometimes side with the seller if tracking shows delivered.\n\n**The bait-and-switch:**\nListing shows a high-quality product. You receive a cheap knockoff. Seller claims \"what you see is what you get\" and refuses refund.\n\n**The \"pay deposit\" scam:**\nSeller claims the item is in high demand and asks for a deposit (20-50%) via bank transfer to \"reserve\" it. After deposit, they ask for the full amount. After full payment, they vanish.\n\n**The WhatsApp group reseller scam:**\nSellers in WhatsApp groups claim to resell from Shopee/Lazada at a discount. They collect multiple orders, take payments via bank transfer, and disappear once they've collected enough money.\n\nAll of these scams have one thing in common: **they try to move you off the platform's payment system.** Stay on platform. Use escrow. Check on ScamGuards first.",
      },
    ],
  },
  {
    slug: "whatsapp-scammer-malaysia-how-to-check",
    title: "WhatsApp Scammer Malaysia: How to Check a Number Before You Pay (2025)",
    metaTitle:
      "WhatsApp Scammer Malaysia - Check Any Number Before Paying | ScamGuards",
    metaDescription:
      "How to check if a WhatsApp number is a scammer in Malaysia. Red flags to spot, how to verify before paying, and how to report WhatsApp scammers. Free AI scammer checker.",
    publishedAt: "2025-03-23",
    updatedAt: "2025-03-23",
    readingTime: "6 min read",
    excerpt:
      "Someone contacted you on WhatsApp wanting to sell something or offer a deal? Check the number first. Here's how to spot a WhatsApp scammer in Malaysia before you lose your money.",
    keywords: [
      "whatsapp scammer malaysia",
      "check whatsapp scammer",
      "scammer numbers malaysia check",
      "whatsapp scammer phone number",
      "how to spot whatsapp scammer malaysia",
      "malaysia whatsapp scam",
      "verify whatsapp seller malaysia",
      "whatsapp scam malaysia 2025",
    ],
    sections: [
      {
        heading: "WhatsApp Scams Are Surging in Malaysia",
        content:
          "WhatsApp is Malaysia's default communication platform — and scammers know it. Whether it's a seller in a buy-sell group, someone offering a job, a \"bank officer\" calling about your account, or a stranger offering investment returns, WhatsApp is now the primary tool for fraud in Malaysia.\n\nThe CCID recorded **14,881 e-commerce scam cases** in 2024 — the vast majority initiated via WhatsApp or Telegram. Many victims only realise they've been scammed after transferring money to a stranger they met in a WhatsApp group.\n\n**The safest move: check the number before you pay.** It takes 10 seconds and costs nothing.",
      },
      {
        heading: "How to Check if a WhatsApp Number Is a Scammer",
        content:
          "**Method 1: ScamGuards (fastest)**\n1. Copy the WhatsApp number\n2. Go to **scamguards.app/search**\n3. Paste the number\n4. The AI cross-references it against the Malaysian scammer database and returns a risk score in seconds\n\nIf the number has been reported before, you'll see the scam type, risk level, and report count. If it's clean, that's a good sign — though not a guarantee.\n\n**Method 2: Google the number**\nPaste the number into Google with quotes: `\"+60123456789 scammer\"`. If it shows up in Lowyat forums, Facebook scam groups, or other complaint sites, it's been flagged before.\n\n**Method 3: Check on Semak Mule (PDRM)**\nThe police run a portal at https://ccid.rmp.gov.my/semakmule/ where you can check if a bank account number has been flagged as a \"mule account\" used in financial crime.\n\n**Method 4: Reverse lookup**\nApps like GetContact or Truecaller sometimes have community-tagged labels. If a number is widely tagged as \"SCAMMER\" or \"FRAUD\", that's a clear warning.",
      },
      {
        heading: "Red Flags: How to Spot a WhatsApp Scammer",
        content:
          "**Profile red flags:**\n- New account (no profile picture, or stock photo profile pic)\n- Profile shows foreign country code but claims to be in Malaysia\n- No mutual groups or contacts\n- Account created recently (you can sometimes see this via WhatsApp Business)\n\n**Conversation red flags:**\n- **Pressure tactics:** \"Offer only valid today\", \"Another buyer is waiting\", \"Need to confirm now\"\n- **Too good to be true pricing:** Selling RM500 items for RM100, claiming it's urgent sale\n- **Asks to move off-platform:** Wants you to contact via a different number or app\n- **Refuses video call:** Won't show the item live on camera\n- **Wants bank transfer only:** Refuses DuitNow QR, refuses meetup, refuses COD\n- **Sends fake receipts or screenshots:** Payment confirmations that look off\n\n**The biggest red flag:** Any seller who insists on bank transfer before you receive the item and refuses all other arrangements is almost certainly a scammer.",
      },
      {
        heading: "Common WhatsApp Scam Types in Malaysia (2025)",
        content:
          "**Buy-sell group scams**\nScammer joins Facebook or WhatsApp buy-sell groups, lists in-demand items (PS5, iPhones, concert tickets, trading cards) at attractive prices, collects payment, and disappears. The item never arrives.\n\n**\"Bank officer\" scams (Macau Scam variant)**\nCaller claims to be from your bank or PDRM, says your account is compromised, and instructs you to transfer funds to a \"safe account\". Bank officers will **never** ask you to transfer money.\n\n**Job scam via WhatsApp**\nSomeone messages you about a high-paying work-from-home job. After you \"accept\", they ask for a deposit or training fee. No job exists.\n\n**Investment group scams**\nAdded to a WhatsApp group with testimonials of high returns. Early \"investors\" (all fake accounts) show profit screenshots. You invest. You lose everything.\n\n**Parcel scam**\nMessage claiming you have an undelivered parcel and need to pay a customs/release fee via link. The link steals your banking credentials.",
      },
      {
        heading: "What to Do If You've Already Paid a WhatsApp Scammer",
        content:
          "Act immediately — the first 30 minutes matter most.\n\n1. **Call your bank's fraud hotline** (not the general line) and request a fund recall:\n   - Maybank: 03-5891 4744\n   - CIMB: 03-6204 7788\n   - Public Bank: 03-2176 6000\n   - RHB: 03-9206 8118\n\n2. **Call NSRC at 997** — National Scam Response Centre coordinates cross-bank freezing of scammer accounts (8am–8pm daily)\n\n3. **Make a police report** at your nearest station or online at https://sfrv2.rmp.gov.my/\n\n4. **Report the number at ScamGuards** — go to **scamguards.app/submit**, paste the WhatsApp number and your conversation. This warns the next person who checks that number.\n\n5. **Report and block on WhatsApp** — open the chat → tap the contact name → Report → Block. This flags the account to WhatsApp for removal.\n\nFor a complete step-by-step guide: [How to Report a Scammer in Malaysia](/blog/how-to-report-scammer-malaysia)",
      },
      {
        heading: "How to Report a WhatsApp Scammer's Number",
        content:
          "Reporting to multiple channels maximises impact:\n\n**ScamGuards** (warns the public immediately):\n- scamguards.app/submit — paste the number and conversation\n\n**MCMC** (gets the number blocked by telcos):\n- https://aduan.skmm.gov.my/\n- Hotline: 1-800-888-030\n- MCMC blocked 209,990 scammer numbers in 2024\n\n**WhatsApp itself:**\n- Open chat → Tap contact name → Scroll down → Report\n\n**PDRM Semak Mule:**\n- If they gave you a bank account: report at https://ccid.rmp.gov.my/semakmule/\n\nThe more reports a number accumulates in ScamGuards, the higher its risk score — making it easier for the next person to avoid the same trap.",
      },
    ],
  },
  {
    slug: "cara-lapor-penipu-malaysia",
    title: "Cara Lapor Penipu di Malaysia: Panduan Lengkap (2025)",
    metaTitle:
      "Cara Lapor Penipu di Malaysia - Panduan Langkah demi Langkah | ScamGuards",
    metaDescription:
      "Panduan lengkap cara lapor penipu di Malaysia. Report ke polis (PDRM), CCID, NSRC 997, Bank Negara, MCMC, dan ScamGuards. Semua nombor hotline disertakan.",
    publishedAt: "2025-03-22",
    updatedAt: "2025-03-23",
    readingTime: "7 minit bacaan",
    excerpt:
      "Kena tipu? Ini semua cara untuk lapor penipu di Malaysia — polis, bank, CCID, NSRC, MCMC, dan pangkalan data komuniti. Dengan nombor hotline dan apa yang perlu dibawa.",
    keywords: [
      "cara lapor penipu malaysia",
      "lapor scammer malaysia",
      "report penipu",
      "kena tipu apa nak buat",
      "cara report scammer",
      "nombor CCID",
      "NSRC 997",
      "cara buat laporan polis penipuan",
    ],
    sections: [
      {
        heading: "6 Saluran Untuk Lapor Penipu di Malaysia",
        content:
          "Tiada satu tempat sahaja untuk lapor penipu di Malaysia. Anda perlu lapor ke beberapa saluran untuk tingkatkan peluang dapat balik duit dan tangkap penipu tersebut.\n\n**Peraturan emas: bertindak dalam 30 minit.** Selepas 30 minit, penipu berkemungkinan besar sudah keluarkan duit anda. Setiap minit penting.\n\nIni 6 saluran, disusun mengikut keutamaan:\n\n1. **Hotline penipuan bank anda** — untuk bekukan dan tarik balik pemindahan\n2. **NSRC (Pusat Respons Scam Kebangsaan) — 997** — koordinasi antara bank, telco, dan polis\n3. **Laporan polis (PDRM)** — rekod rasmi yang diperlukan untuk siasatan bank\n4. **CCID (Jabatan Siasatan Jenayah Komersil)** — 03-2610 1559\n5. **MCMC** — untuk lapor nombor telefon, laman web, dan akaun media sosial penipu\n6. **ScamGuards** — pangkalan data komuniti yang memberi amaran kepada orang seterusnya",
      },
      {
        heading: "Langkah 1: Hubungi Hotline Penipuan Bank Anda SEKARANG",
        content:
          "Ini langkah paling penting. Hubungi **hotline penipuan** bank anda (bukan talian am) dan minta **fund recall** (tarik balik dana). Bank akan hubungi bank penerima untuk bekukan akaun penipu sebelum mereka sempat keluarkan duit.\n\n**Hotline penipuan bank (simpan nombor ini sekarang):**\n\n- **Maybank**: 03-5891 4744 (24/7)\n- **CIMB**: 03-6204 7788\n- **Public Bank**: 03-2176 6000\n- **RHB**: 03-9206 8118\n- **Hong Leong**: 03-7626 8899\n- **Bank Islam**: 03-2690 0900\n- **AmBank**: 03-2178 8888\n- **Bank Rakyat**: 03-2612 9600\n- **BSN**: 1-300-88-1900\n- **Affin Bank**: 03-2055 9000\n\nBeritahu operator: **\"Saya kena tipu. Saya nak minta fund recall untuk pemindahan yang saya baru buat.\"** Berikan rujukan transaksi, jumlah, masa, dan nombor akaun penerima.",
      },
      {
        heading: "Langkah 2: Hubungi NSRC di 997",
        content:
          "**Pusat Respons Scam Kebangsaan (NSRC)** dilancarkan oleh Bank Negara Malaysia pada Oktober 2022 khusus untuk mengendalikan kes penipuan. Hubungi **997** (waktu operasi: 8 pagi hingga 8 malam setiap hari).\n\nNSRC bertindak sebagai pusat koordinasi antara bank anda, bank penerima, dan syarikat telco secara masa nyata. Mereka boleh:\n- **Percepatkan permintaan pembekuan** merentasi bank\n- **Sekat nombor telefon penipu** melalui telco\n- **Berikan nombor rujukan kes** yang menghubungkan laporan polis, siasatan bank, dan aduan MCMC anda\n\nNSRC telah memproses ribuan kes sejak penubuhannya. Nombor rujukan NSRC mengukuhkan siasatan bank anda.",
      },
      {
        heading: "Langkah 3: Buat Laporan Polis",
        content:
          "Pergi ke **balai polis** terdekat dan buat laporan di bawah jenayah komersil. Anda juga boleh membuat laporan secara dalam talian di https://sfrv2.rmp.gov.my/.\n\n**Bawa dokumen ini:**\n- Tangkap layar SEMUA perbualan dengan penipu (WhatsApp, Telegram, dll.)\n- Resit pemindahan bank / bukti pembayaran\n- Nombor telefon, akaun bank, emel, atau profil media sosial penipu\n- Nombor rujukan kes NSRC (jika anda sudah hubungi 997)\n- Sebarang iklan atau penyenaraian produk yang anda respons\n\nPolis akan berikan nombor laporan. Bank anda mungkin memerlukan ini untuk meneruskan siasatan fund recall.\n\nUntuk kes yang rumit, hubungi **CCID** terus di **03-2610 1559** atau lawati pejabat CCID di Menara KPJ, Bukit Aman.",
      },
      {
        heading: "Langkah 4: Lapor ke MCMC dan Platform",
        content:
          "**MCMC (Suruhanjaya Komunikasi dan Multimedia Malaysia)** mengendalikan nombor telefon penipuan, laman web palsu, dan akaun media sosial penipuan. Pada 2024, MCMC membuang 66,507 pos berkaitan penipuan dan menyekat 209,990 nombor telefon penipu.\n\nLapor ke MCMC:\n- Laman web: https://aduan.skmm.gov.my/\n- Emel: aduan@mcmc.gov.my\n- Talian: 1-800-888-030\n\n**Lapor di platform:**\n- **WhatsApp**: Tekan lama mesej → Report → Block\n- **Telegram**: Tekan profil → Report\n- **Facebook/Instagram**: Profil → Report → Penipuan\n- **Shopee**: Halaman pesanan → Report seller\n- **Carousell**: Penyenaraian → Report → Scam",
      },
      {
        heading: "Langkah 5: Lapor di ScamGuards (Lindungi Orang Lain)",
        content:
          "Saluran rasmi melindungi anda. ScamGuards melindungi semua orang lain.\n\nPergi ke **scamguards.app/submit** dan tampal butiran penipu — nombor telefon, akaun bank, emel, atau keseluruhan perbualan anda. AI kami akan ekstrak maklumat pengenalan secara automatik.\n\nKenapa ini penting: bila orang seterusnya hendak bayar penipu ini, mereka boleh semak butiran di ScamGuards terlebih dahulu dan nampak amaran anda. Laporan anda mungkin selamatkan duit orang lain.\n\n**Hanya ambil 2 minit. Tak perlu daftar akaun. Sepenuhnya tanpa nama.**\n\nMalaysia kehilangan **RM2.77 bilion** kepada penipu pada 2025 — peningkatan 76% daripada 2024 (Sumber: Kementerian Dalam Negeri/PDRM). Setiap laporan menjadikan pangkalan data lebih pintar dan komuniti lebih selamat.",
      },
    ],
  },
  {
    slug: "kena-tipu-online-apa-nak-buat",
    title: "Kena Tipu Online? Ini Apa Yang Perlu Anda Buat Segera",
    metaTitle:
      "Kena Tipu Online? Apa Nak Buat Segera | ScamGuards",
    metaDescription:
      "Kena tipu online? Jangan panik. Panduan langkah demi langkah untuk dapatkan balik duit anda — dalam masa 30 minit. Nombor hotline bank, NSRC 997, dan cara buat laporan.",
    publishedAt: "2025-03-22",
    updatedAt: "2025-03-23",
    readingTime: "5 minit bacaan",
    excerpt:
      "Baru kena tipu? Anda ada 30 minit untuk bertindak. Ini cara dapat balik duit anda di Malaysia — dari fund recall bank hingga laporan polis.",
    keywords: [
      "kena tipu online",
      "kena scam apa nak buat",
      "cara dapat balik duit kena tipu",
      "kena tipu whatsapp",
      "kena tipu shopee",
      "fund recall malaysia",
      "boleh dapat balik duit kena scam",
      "kena tipu transfer duit",
    ],
    sections: [
      {
        heading: "30 Minit Pertama: Masa Paling Penting",
        content:
          "Bila anda pindahkan duit kepada penipu, duit tu tidak hilang serta-merta. Duit masih berada dalam akaun bank penerima sehingga seseorang mengeluarkannya. Ini peluang anda.\n\n**Dalam 30 minit:** Peluang tinggi untuk dapat balik. Bank penerima boleh bekukan akaun sebelum pengeluaran.\n**Dalam 1-3 jam:** Peluang sederhana. Bergantung sama ada penipu sudah pindahkan duit.\n**Dalam 24 jam:** Peluang rendah. Kebanyakan penipu keluarkan duit dalam beberapa jam.\n**Selepas 24 jam:** Peluang sangat rendah untuk pemindahan domestik.\n\nJadi perkara PERTAMA yang anda perlu buat — sebelum tangkap layar, sebelum laporan polis, sebelum apa-apa pun — ialah **hubungi hotline penipuan bank anda**.",
      },
      {
        heading: "Langkah 1: Hubungi Bank Anda Sekarang",
        content:
          "JANGAN guna talian am. Guna **hotline penipuan/scam** khusus:\n\n- **Maybank**: 03-5891 4744 (24 jam)\n- **CIMB**: 03-6204 7788\n- **Public Bank**: 03-2176 6000\n- **RHB**: 03-9206 8118\n- **Hong Leong**: 03-7626 8899\n- **Bank Islam**: 03-2690 0900\n- **AmBank**: 03-2178 8888\n\nCakap macam ni: **\"Saya kena tipu. Saya nak fund recall untuk transfer terakhir saya.\"**\n\nBerikan:\n- Tarikh dan masa transaksi\n- Jumlah yang dipindahkan\n- Bank dan nombor akaun penerima\n- Nombor rujukan transaksi (dari app banking anda)\n\nBank akan hubungi bank penerima untuk minta pembekuan akaun. Kalau duit masih ada, ia akan dibekukan sementara menunggu siasatan.",
      },
      {
        heading: "Langkah 2: Hubungi NSRC di 997",
        content:
          "Selepas hubungi bank, terus hubungi **997** — Pusat Respons Scam Kebangsaan.\n\nNSRC boleh:\n- **Percepatkan pembekuan** merentasi bank-bank\n- **Sekat nombor telefon penipu** melalui syarikat telco\n- **Berikan nombor rujukan kes** untuk laporan polis anda\n\nWaktu operasi: 8 pagi hingga 8 malam setiap hari.\n\nKalau di luar waktu operasi, hotline penipuan bank anda adalah saluran utama.",
      },
      {
        heading: "Langkah 3: Buat Laporan Polis",
        content:
          "Pergi ke **balai polis** terdekat. Bawa:\n- Kad pengenalan\n- Telefon dengan semua tangkap layar perbualan\n- Resit pemindahan bank\n- Nombor rujukan NSRC (jika sudah hubungi 997)\n- Butiran penipu (nombor telefon, akaun bank, emel)\n\nMinta nombor laporan polis — bank anda mungkin memerlukannya untuk siasatan.\n\nAnda juga boleh buat laporan dalam talian di https://sfrv2.rmp.gov.my/",
      },
      {
        heading: "Langkah 4: Lapor di ScamGuards (Lindungi Orang Lain)",
        content:
          "Pergi ke **scamguards.app/submit** dan tampal butiran penipu. AI kami akan ekstrak nombor telefon, akaun bank, dan maklumat lain secara automatik.\n\nOrang seterusnya yang semak nombor atau akaun bank penipu tu akan nampak amaran anda. Anda mungkin selamatkan duit orang lain.\n\n**Tak perlu daftar. Tanpa nama. 2 minit sahaja.**",
      },
      {
        heading: "Boleh Dapat Balik Duit Ke? (Jujurnya)",
        content:
          "**Jawapan jujur: bergantung kepada kelajuan anda bertindak.**\n\n- **Lapor dalam 30 minit, duit masih dalam akaun:** Peluang baik untuk pulihan penuh. Pembekuan berjaya dan duit dipulangkan selepas siasatan (biasanya 14-30 hari bekerja).\n- **Lapor dalam beberapa jam, duit sebahagian dikeluarkan:** Anda mungkin dapat balik baki yang masih ada.\n- **Lapor selepas 24 jam:** Pulihan tidak mungkin untuk pemindahan domestik.\n\n**JANGAN bayar sesiapa yang kata mereka boleh \"recover\" duit anda dengan bayaran** — ini adalah **recovery scam**, penipuan kedua selepas yang pertama.\n\n**JANGAN padam apa-apa bukti** — tangkap layar, log perbualan, resit pemindahan.\n\n**Walaupun peluang pulihan rendah, tetap lapor.** Laporan polis anda dan laporan ScamGuards (scamguards.app/submit) membantu tangkap penipu dan lindungi orang lain. Pada 2025, rakyat Malaysia kehilangan RM2.77 bilion kepada penipu. Setiap laporan penting.",
      },
    ],
  },
  {
    slug: "scam-shopee-carousell-malaysia-bm",
    title: "Scam Shopee & Carousell Malaysia: Cara Kenal Pasti dan Lapor",
    metaTitle:
      "Scam Shopee & Carousell: Kenal Penjual Palsu | ScamGuards",
    metaDescription:
      "Cara kenal pasti penipu di Shopee, Carousell, dan Lazada Malaysia. Red flag, tips perlindungan pembeli, dan apa nak buat kalau kena tipu.",
    publishedAt: "2025-03-22",
    updatedAt: "2025-03-23",
    readingTime: "6 minit bacaan",
    excerpt:
      "Penipuan e-dagang menyebabkan rakyat Malaysia kerugian RM123.7 juta pada 2024. Ini cara untuk kenal pasti penjual palsu di Shopee, Carousell, dan Lazada.",
    keywords: [
      "penipu shopee malaysia",
      "scam carousell malaysia",
      "penipu lazada",
      "penjual palsu malaysia",
      "kena tipu shopee",
      "kena tipu carousell",
      "scam beli online malaysia",
      "cara elak penipu online",
    ],
    sections: [
      {
        heading: "RM123.7 Juta Kerugian E-Dagang Pada 2024",
        content:
          "Penipuan e-dagang adalah jenis penipuan paling biasa di Malaysia berdasarkan bilangan kes. CCID merekodkan **14,881 kes** pada 2024 dengan jumlah kerugian **RM123.7 juta** (Sumber: CCID 2024).\n\nModusnya mudah: penjual menyenaraikan produk (biasanya pada harga menarik), mengutip bayaran, dan hilang. Atau menghantar bungkusan palsu/kosong dan mempertikaikan tuntutan bayaran balik anda.\n\nTiga platform paling disasarkan di Malaysia:\n- **Shopee** — pangkalan pengguna terbesar, paling banyak laporan penipuan\n- **Carousell** — jualan peer-to-peer dengan perlindungan terbina kurang\n- **Facebook Marketplace / Grup WhatsApp** — tiada perlindungan pembeli langsung",
      },
      {
        heading: "Red Flag: Cara Kenal Pasti Penjual Palsu",
        content:
          "**Di Shopee:**\n- Kedai baru (kurang 3 bulan) dengan rating tinggi yang mencurigakan tetapi sedikit ulasan\n- Gambar produk kelihatan terlalu profesional atau jelas dari senarai lain\n- Harga jauh di bawah pasaran (barang RM300 dijual RM99)\n- Penjual minta anda \"deal luar Shopee\" melalui WhatsApp atau transfer bank terus\n\n**Di Carousell:**\n- Akaun baru dibuat tanpa senarai atau ulasan terdahulu\n- Hanya terima bank transfer (tolak meetup atau COD)\n- Banyak barang bernilai tinggi disenaraikan serentak — nampak macam katalog, bukan penjual peribadi\n- Enggan video call atau tunjuk barang sebenar\n- Guna tekanan: \"ada pembeli lain tengah tunggu\" atau \"harga sah hari ini sahaja\"\n\n**Red flag universal:**\n- **Mana-mana penjual yang minta anda bayar luar platform** sedang membuang perlindungan pembeli anda dengan sengaja. Ini red flag paling besar.\n- **Gambar produk dicuri** — buat reverse image search di Google Images.\n- **Tolak COD atau meetup** untuk transaksi tempatan.",
      },
      {
        heading: "Cara Lindungi Diri Bila Beli Online",
        content:
          "**Sebelum anda bayar:**\n\n1. **Semak penjual di ScamGuards** — pergi ke scamguards.app/search dan tampal nombor telefon atau akaun bank mereka. 10 saat sahaja.\n2. **SENTIASA bayar melalui platform** — Shopee Guarantee dan Carousell Protection wujud untuk sebab tertentu. Kalau anda bayar melalui bank transfer, anda tiada jalan balik.\n3. **Semak sejarah penjual** — tengok tarikh ulasan, kandungan ulasan (adakah semuanya generik?), berapa lama kedai aktif, dan kadar respons.\n4. **Minta foto atau video langsung** — minta gambar barang dengan sekeping kertas yang menunjukkan username anda dan tarikh hari ini. Penjual sebenar akan beri; penipu tidak.\n5. **Guna COD bila boleh** — terutamanya untuk barang bernilai tinggi. Periksa sebelum bayar.\n\n**Untuk Carousell khususnya:**\nGuna **CarouPay** atau **Carousell Protection** untuk pembayaran. Ini menahan duit dalam escrow sehingga anda sahkan penerimaan.",
      },
      {
        heading: "Kena Tipu di Shopee atau Carousell? Ini Apa Nak Buat",
        content:
          "**Jika anda bayar melalui platform:**\n1. Buka dispute segera — Shopee: pergi ke Pesanan → Minta Pulangan/Bayaran Balik. Carousell: buka dispute melalui Carousell Protection.\n2. Muat naik semua bukti — tangkap layar senarai produk, perbualan dengan penjual, gambar apa yang anda terima (atau tak terima).\n3. Platform akan jadi orang tengah dan biasanya bayar balik jika anda guna sistem pembayaran mereka.\n\n**Jika anda bayar melalui bank transfer (luar platform):**\n1. **Hubungi hotline penipuan bank anda segera** — minta fund recall\n2. **Hubungi NSRC di 997**\n3. **Buat laporan polis** di balai polis terdekat\n4. **Lapor di ScamGuards** (scamguards.app/submit) — tampal nombor telefon penipu, akaun bank, dan perbualan anda\n5. **Lapor penjual di platform** — walaupun anda bayar di luar, ban akaun penipu menghalang mangsa seterusnya\n\n**Penting:** Jika anda bayar di luar platform, platform (Shopee, Carousell) TIDAK BOLEH bantu anda dengan bayaran balik. Ini sebab tepat kenapa penipu minta anda bayar di luar.",
      },
      {
        heading: "Taktik Penipuan E-Dagang Biasa di Malaysia",
        content:
          "**Helah \"COD tapi sebenarnya bank transfer\":**\nPenjual setuju COD tapi kemudian mesej anda: \"Maaf, saya tak boleh COD hari ini. Boleh bank transfer dulu? Saya hantar esok.\" Selepas anda transfer, mereka hilang.\n\n**Scam kotak kosong:**\nPenjual hantar kotak kosong atau barang murah rawak. Bila anda buka dispute, mereka tunjuk \"bukti penghantaran\" dengan tracking. Platform kadang-kadang berpihak kepada penjual jika tracking tunjuk sudah dihantar.\n\n**Bait-and-switch:**\nSenarai tunjuk produk berkualiti tinggi. Anda terima barang tiruan murah. Penjual kata \"apa yang anda nampak itulah yang anda dapat.\"\n\n**Scam \"bayar deposit\":**\nPenjual kata barang dalam permintaan tinggi dan minta deposit (20-50%) melalui bank transfer untuk \"tempah.\" Selepas deposit, mereka minta jumlah penuh. Selepas bayaran penuh, mereka hilang.\n\nSemua penipuan ini ada satu persamaan: **mereka cuba pindahkan anda daripada sistem pembayaran platform.** Kekal di platform. Guna escrow. Semak di ScamGuards dulu.",
      },
    ],
  },
  {
    slug: "semak-nombor-telefon-scammer-malaysia",
    title: "Semak Nombor Telefon Scammer Malaysia: 4 Cara Cepat (2026)",
    metaTitle:
      "Semak Nombor Telefon Scammer Malaysia — 4 Cara Check Percuma | ScamGuards",
    metaDescription:
      "Cara semak nombor telefon scammer di Malaysia. Guna ScamGuards AI, Semak Mule PDRM, Google, dan Truecaller untuk check nombor penipu percuma sebelum anda bayar.",
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readingTime: "6 min read",
    excerpt:
      "Nak semak kalau nombor telefon tu penipu? Ini 4 cara percuma untuk check nombor scammer di Malaysia — termasuk Semak Mule PDRM dan AI.",
    keywords: [
      "semak nombor telefon scammer",
      "semak no telefon scammer",
      "check scammer phone number malaysia",
      "semak scammer online",
      "check scammer online malaysia",
      "semak mule",
      "semakmule PDRM",
      "nombor telefon penipu",
      "cara semak nombor penipu",
      "how to check if someone is a scammer malaysia",
    ],
    sections: [
      {
        heading: "Kenapa Anda Perlu Semak Nombor Telefon Sebelum Bayar",
        content:
          "Malaysia kehilangan **RM2.77 bilion** kepada penipu pada 2025 — peningkatan 76% daripada tahun sebelumnya (Sumber: Kementerian Dalam Negeri/PDRM). Kebanyakan penipuan bermula dengan satu nombor telefon: penjual di WhatsApp, \"pegawai bank\" yang menelefon, atau orang yang anda baru jumpa online.\n\nSemak nombor telefon sebelum anda transfer duit adalah langkah paling mudah dan paling berkesan untuk elak kena tipu. Ia ambil 10 saat. Percuma. Dan ia boleh selamatkan anda ribuan ringgit.\n\nIni 4 cara terbaik untuk semak nombor telefon scammer di Malaysia.",
      },
      {
        heading: "Cara 1: ScamGuards (AI — Paling Cepat)",
        content:
          "**Masa: 10 saat | Kos: Percuma | Perlu daftar: Tidak**\n\n1. Pergi ke **scamguards.app/search**\n2. Tampal nombor telefon yang anda nak semak\n3. Klik \"Semak Sekarang\"\n\nAI ScamGuards akan cari nombor tersebut dalam ribuan laporan penipuan komuniti dan tunjukkan tahap risiko — mencurigakan, selamat, atau tidak diketahui — dengan skor keyakinan.\n\n**Kelebihan:** Carian AI yang pantas, merangkumi nombor telefon, akaun bank, dan emel dalam satu carian. Pangkalan data dikemaskini secara langsung oleh laporan komuniti.\n\n**Bila guna:** Sebelum anda bayar sesiapa yang anda jumpa online — penjual WhatsApp, Carousell, Facebook Marketplace, atau sesiapa yang minta transfer bank.",
      },
      {
        heading: "Cara 2: Semak Mule PDRM (Rasmi Kerajaan)",
        content:
          "**Masa: 1 minit | Kos: Percuma | Perlu daftar: Tidak**\n\nSemak Mule adalah portal rasmi CCID PDRM untuk semak sama ada nombor akaun bank atau nombor telefon telah dilaporkan dalam kes jenayah komersil.\n\n1. Pergi ke **ccid.rmp.gov.my/semakmule/**\n2. Pilih jenis carian (nombor telefon atau akaun bank)\n3. Masukkan nombor dan klik \"Semak\"\n\n**Kelebihan:** Data rasmi daripada Polis Diraja Malaysia. Jika nombor muncul di sini, ia telah terlibat dalam kes jenayah yang dilaporkan.\n\n**Had:** Hanya merangkumi kes yang telah dilaporkan kepada polis. Banyak penipuan tidak dilaporkan. Antara muka mungkin lambat pada waktu puncak.\n\n**Tip:** Guna Semak Mule bersama ScamGuards. Semak Mule merangkumi kes rasmi. ScamGuards merangkumi laporan komuniti yang mungkin belum sampai ke polis.",
      },
      {
        heading: "Cara 3: Google Nombor Telefon",
        content:
          "**Masa: 30 saat | Kos: Percuma**\n\nCara paling mudah yang ramai orang lupa:\n\n1. Buka Google\n2. Taip nombor telefon dalam tanda petik: **\"+60123456789 scammer\"** atau **\"+60123456789 penipu\"**\n3. Tengok keputusan\n\nJika nombor tersebut pernah dilaporkan di forum Lowyat, Facebook group, atau mana-mana laman web, ia akan muncul dalam keputusan carian.\n\n**Kelebihan:** Merangkumi seluruh internet — forum, media sosial, blog, dan laman aduan.\n\n**Had:** Tidak terstruktur. Anda perlu baca sendiri dan tentukan sama ada ia relevan. Nombor baru tidak akan muncul.",
      },
      {
        heading: "Cara 4: Truecaller / GetContact",
        content:
          "**Masa: 10 saat | Kos: Percuma (versi asas)**\n\nAplikasi seperti **Truecaller** dan **GetContact** menggunakan pangkalan data pengguna untuk menunjukkan nama dan label yang dikaitkan dengan nombor telefon.\n\n1. Muat turun Truecaller atau GetContact dari App Store / Play Store\n2. Cari nombor telefon\n3. Tengok jika ada label \"SCAMMER\", \"FRAUD\", atau \"SPAM\"\n\n**Kelebihan:** Cepat. Jika ramai pengguna telah melabelkan nombor sebagai penipu, ia akan ditunjukkan.\n\n**Had:** Bergantung kepada pengguna lain yang melabelkan nombor. Tidak semua penipu dilabelkan. Data mungkin tidak terkini untuk nombor Malaysia.",
      },
      {
        heading: "Cara Terbaik: Guna Lebih Daripada Satu Kaedah",
        content:
          "Tiada satu kaedah yang sempurna. Setiap satu merangkumi aspek yang berbeza:\n\n- **ScamGuards**: Laporan komuniti terkini + analisis AI\n- **Semak Mule**: Kes rasmi yang dilaporkan kepada polis\n- **Google**: Seluruh internet\n- **Truecaller/GetContact**: Label daripada pengguna lain\n\n**Cadangan terbaik:** Mulakan dengan ScamGuards (paling cepat dan komprehensif), kemudian semak Semak Mule untuk pengesahan rasmi. Ini ambil kurang daripada 2 minit dan boleh selamatkan anda daripada kehilangan wang.\n\n**Kalau nombor bersih di semua platform — masih berhati-hati.** Penipu sering guna nombor baru. Guna COD atau pembayaran platform (Shopee Guarantee, Carousell Protection) bila boleh.",
      },
      {
        heading: "Apa Nak Buat Kalau Nombor Itu Memang Penipu?",
        content:
          "Jika semakan anda mendapati nombor itu pernah dilaporkan:\n\n1. **JANGAN bayar atau transfer wang**\n2. **Tangkap layar semua perbualan** — nombor telefon, profil, senarai produk\n3. **Lapor di ScamGuards** (scamguards.app/submit) — tampal butiran penipu supaya orang lain diberi amaran\n4. **Lapor di WhatsApp** — tekan nama kontrak → Report → Block\n5. **Lapor ke MCMC** — aduan.skmm.gov.my atau hotline 1-800-888-030\n\nJika anda sudah bayar: hubungi hotline penipuan bank anda segera, kemudian NSRC di 997, kemudian buat laporan polis. Baca panduan lengkap kami: [Kena Tipu Online? Apa Nak Buat](/blog/kena-tipu-online-apa-nak-buat).",
      },
    ],
  },
  {
    slug: "love-scam-malaysia",
    title: "Love Scam Malaysia: Cara Kenal Pasti dan Lindungi Diri (2026)",
    metaTitle:
      "Love Scam Malaysia — Cara Kenal Pasti & Lapor Penipu Cinta | ScamGuards",
    metaDescription:
      "Love scam di Malaysia semakin meningkat. Ketahui tanda-tanda penipu cinta, cara semak identiti mereka, dan langkah lapor jika anda menjadi mangsa. Panduan lengkap 2026.",
    publishedAt: "2026-04-14",
    updatedAt: "2026-04-14",
    readingTime: "7 min read",
    excerpt:
      "Love scam adalah penipuan paling emosional dan paling sukar dikesan. Ini tanda-tanda utama, cara untuk semak, dan apa nak buat kalau anda atau orang yang anda sayang terlibat.",
    keywords: [
      "love scam malaysia",
      "love scam",
      "penipu cinta malaysia",
      "romance scam malaysia",
      "scam dating app malaysia",
      "tanda love scam",
      "cara kenal pasti love scam",
      "lapor love scam malaysia",
      "kena love scam apa nak buat",
    ],
    sections: [
      {
        heading: "Love Scam di Malaysia: RM43.7 Juta Kerugian pada 2024",
        content:
          "Love scam — juga dikenali sebagai romance scam atau penipuan cinta — melibatkan penipu yang berpura-pura mempunyai hubungan romantik dengan mangsa untuk mendapatkan wang.\n\nPada 2024, CCID melaporkan kerugian **RM43.7 juta** daripada love scam di Malaysia sahaja (Sumber: CCID 2024). Dan ini hanyalah kes yang dilaporkan — ramai mangsa malu untuk tampil ke hadapan.\n\nLove scam berbeza daripada penipuan lain kerana ia menyasarkan **emosi, bukan ketamakan**. Mangsa bukan orang bodoh atau lemah — mereka adalah orang biasa yang sedang mencari hubungan. Penipu menggunakan teknik manipulasi psikologi yang sama digunakan oleh sindiket profesional.",
      },
      {
        heading: "Bagaimana Love Scam Berfungsi (Peringkat demi Peringkat)",
        content:
          "Love scam mengikuti corak yang boleh diramal:\n\n**Peringkat 1: Pendekatan**\nPenipu menghubungi mangsa melalui dating app (Tinder, Bumble, MalaysianCupid), Facebook, Instagram, atau WhatsApp. Mereka guna gambar profil yang menarik — biasanya dicuri daripada model atau orang sebenar.\n\n**Peringkat 2: Membina Hubungan**\nPenipu meluangkan minggu atau bulan membina hubungan emosi. Mesej setiap hari. Kata-kata cinta. Rancangan masa depan bersama. Mereka belajar tentang kehidupan anda dan gunakan maklumat itu untuk membina kepercayaan.\n\n**Peringkat 3: Krisis**\nTiba-tiba, penipu menghadapi \"kecemasan\" — masalah perubatan, masalah undang-undang, tiket kapal terbang untuk datang jumpa anda, atau peluang pelaburan. Mereka memerlukan wang segera.\n\n**Peringkat 4: Permintaan Wang**\nPenipu minta anda transfer wang — \"sementara sahaja\", \"saya bayar balik minggu depan\", \"kalau anda benar-benar sayang saya\". Permintaan akan berulang dan jumlahnya semakin besar.\n\n**Peringkat 5: Hilang atau Terus Meminta**\nSelepas mendapat wang, penipu sama ada hilang atau mencipta krisis baru untuk mendapatkan lebih banyak wang.",
      },
      {
        heading: "10 Tanda Love Scam yang Perlu Anda Tahu",
        content:
          "**Tanda-tanda awal:**\n\n1. **Hubungan berkembang terlalu cepat** — \"I love you\" dalam masa beberapa hari atau minggu.\n2. **Tidak pernah video call** — selalu ada alasan: kamera rosak, internet lambat, sedang bekerja. Mereka boleh hantar gambar tetapi tidak boleh video call secara langsung.\n3. **Berasa terlalu sempurna** — mereka berkata semua yang anda ingin dengar. Minat yang sama. Nilai yang sama. Seolah-olah \"jodoh\".\n4. **Profil tidak konsisten** — gambar kelihatan terlalu profesional, cerita berubah-ubah, atau butiran tidak masuk akal.\n5. **Mendakwa berada di luar negara** — tentera, jurutera minyak, doktor di luar negara, atau usahawan antarabangsa. Ini memberi alasan untuk tidak boleh jumpa secara fizikal.\n\n**Tanda-tanda bahaya besar:**\n\n6. **Minta wang dalam apa jua bentuk** — bank transfer, cryptocurrency, kad hadiah. Tidak kira alasannya.\n7. **\"Jangan beritahu sesiapa\"** — penipu mengasingkan anda daripada keluarga dan kawan supaya tiada siapa boleh memberi amaran.\n8. **Krisis berterusan** — setiap kali satu masalah selesai, masalah baru timbul. Semua memerlukan wang.\n9. **Menolak untuk jumpa** — rancangan untuk bertemu sentiasa dibatalkan pada saat akhir.\n10. **Meminta maklumat peribadi** — nombor IC, butiran bank, kata laluan. Maklumat ini boleh digunakan untuk penipuan identiti.",
      },
      {
        heading: "Cara Semak Kalau Seseorang Itu Penipu Cinta",
        content:
          "**Semak nombor telefon mereka:**\n- Pergi ke **scamguards.app/search** dan tampal nombor telefon, emel, atau mana-mana butiran yang mereka berikan. AI akan tunjukkan jika nombor itu pernah dilaporkan.\n\n**Reverse image search gambar profil:**\n- Simpan gambar profil mereka\n- Pergi ke **images.google.com** → klik ikon kamera → muat naik gambar\n- Jika gambar yang sama muncul di profil lain dengan nama berbeza, ia kemungkinan besar dicuri.\n\n**Semak konsistensi cerita:**\n- Catat butiran yang mereka kongsi (tempat kerja, universiti, kampung halaman)\n- Google butiran tersebut — adakah ia masuk akal?\n- Tanya soalan terperinci dan lihat jika jawapan berubah\n\n**Minta video call secara langsung:**\n- Bukan video yang dirakam. Video call langsung di mana anda boleh minta mereka melambai atau menunjukkan sesuatu.\n- Jika mereka sentiasa menolak video call selepas berminggu-minggu berhubung, itu red flag besar.",
      },
      {
        heading: "Apa Nak Buat Kalau Anda Sudah Menjadi Mangsa",
        content:
          "**Pertama: Jangan malu.** Love scam bukan salah anda. Penipu ini adalah profesional yang dilatih oleh sindiket untuk memanipulasi emosi. Doktor, peguam, dan ahli perniagaan juga menjadi mangsa.\n\n**Langkah segera:**\n\n1. **Hentikan semua komunikasi** — jangan balas mesej atau panggilan. Sekat nombor.\n2. **Hubungi hotline penipuan bank anda** jika anda telah transfer wang — minta fund recall. Semakin cepat, semakin baik.\n3. **Hubungi NSRC di 997** — Pusat Respons Scam Kebangsaan boleh koordinasi pembekuan akaun.\n4. **Buat laporan polis** di balai polis terdekat. Bawa semua bukti — tangkap layar perbualan, resit pemindahan, butiran profil penipu.\n5. **Lapor di ScamGuards** (scamguards.app/submit) — tampal nombor telefon, akaun bank, dan cerita anda. AI akan keluarkan butiran penting secara automatik. Ini memberi amaran kepada mangsa seterusnya.\n\n**Penting:** Jangan bayar sesiapa yang tiba-tiba muncul dan kata mereka boleh \"recover\" duit anda. Ini adalah **recovery scam** — penipuan kedua yang menyasarkan mangsa love scam.",
      },
      {
        heading: "Soalan Lazim Tentang Love Scam",
        content:
          "**Bolehkah saya dapat balik duit yang hilang?**\nIa bergantung kepada berapa cepat anda bertindak. Jika anda lapor dalam 30 minit, bank mungkin boleh bekukan akaun penerima. Selepas 24 jam, peluang sangat rendah. Untuk pemindahan antarabangsa, hampir mustahil.\n\n**Adakah love scam hanya berlaku pada orang tua?**\nTidak. CCID melaporkan mangsa merangkumi semua peringkat umur dari 20-an hingga 60-an. Penipu menyesuaikan pendekatan mereka mengikut profil mangsa.\n\n**Apa beza love scam dan sugar daddy/baby scam?**\nLove scam melibatkan hubungan romantik palsu. Sugar scam melibatkan tawaran kewangan palsu (\"Saya bayar RM5,000 sebulan untuk perbualan\") yang memerlukan anda membayar \"yuran pendaftaran\" terlebih dahulu. Kedua-duanya adalah penipuan.\n\n**Bagaimana kalau penipu mengugut nak sebar gambar/video peribadi saya?**\nIni dipanggil **sextortion** dan ia adalah jenayah serius. JANGAN bayar — pembayaran tidak akan menghentikan mereka. Lapor kepada polis segera dan hubungi MCMC di 1-800-888-030 untuk membuang kandungan tersebut.",
      },
    ],
  },
  {
    slug: "expose-scammer-malaysia",
    title: "Want to Expose a Scammer in Malaysia? 3 Steps That Actually Hurt Them",
    metaTitle: "Expose a Scammer in Malaysia Legally | ScamGuards",
    metaDescription:
      "Angry at a scammer? Posting their photo can backfire. Freeze their money, put their number and bank account on record, and warn others in 3 simple steps.",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    readingTime: "7 min read",
    excerpt:
      "Posting a scammer's face and bank account online feels like justice, but it rarely stops them and can put you on the wrong side of Malaysia's doxxing law. Here's the revenge that works: three steps, mostly copy and paste.",
    keywords: [
      "expose scammer malaysia",
      "shame scammer malaysia",
      "punish scammer malaysia",
      "report scammer bank account malaysia",
      "scammer phone number malaysia",
      "997 scam hotline",
      "doxxing law malaysia",
    ],
    language: "en",
    translationSlug: "cara-dedah-scammer-malaysia",
    sections: [
      {
        heading: "The short answer: 3 steps that hit a scammer where it hurts",
        content:
          "If you've just been scammed, the urge to post their face, name and bank account everywhere is completely understandable. It's also the move that does the least damage to the scammer.\n\nWhat actually hurts a scammer is losing the money, losing the account, and being caught out by the next person before that person pays. You can set all three in motion today, and most of it is copy and paste.",
        stepsLabel: "Report a scammer in 3 steps",
        steps: [
          {
            title: "Call 997 right away",
            body: "The National Scam Response Centre can move to **freeze the money** before it's withdrawn. The call also counts as your police report.",
          },
          {
            title: "Copy and paste it into ScamGuards",
            body: "Paste the chat or your story at **scamguards.app/submit**. AI pulls out the bank account, phone number and other details for you to check, then you send it.",
          },
          {
            title: "Warn people the safe way",
            body: "Share the ScamGuards check, not their photo. The next person who searches that number or account sees the warning **before** they pay.",
          },
        ],
      },
      {
        heading: "A common story, and the post that backfires",
        content:
          "A common pattern looks like this. Someone in a Facebook group is selling concert tickets below the official price. The seller replies fast, sends a screenshot of the tickets and asks for a deposit to hold them. You transfer. The replies stop, the post disappears, and your WhatsApp messages sit on one grey tick.\n\nThe next thing many victims do is post the seller's profile photo, the name on the bank account and the phone number in every group they're in, with a warning in capital letters. It feels like justice. In practice it tends to go wrong in three ways.\n\n**The name on the account is often not the scammer.** Syndicates move money through mule accounts (akaun keldai), often rented or bought from people who aren't running the scam. The law already goes after those accounts: since October 2024, letting someone else use your account is an offence under Penal Code section 424B, carrying one to seven years' jail, and carrying out the unlawful transactions under section 424C carries three to ten years ([Low & Partners](https://www.lowpartners.com/keldai-accounts-when-helping-a-friend-becomes-a-criminal-offence)).\n\n**The face may be stolen.** Profile photos are often lifted from real, unrelated people. Posting them passes the harm on to someone else.\n\n**You can end up the one facing charges.** Penal Code amendments that came into force on 11 July 2025 made distributing someone's personal information without permission, known as doxxing, a serious crime punishable by up to three years in prison ([Bernama](https://www.bernama.com/en/news.php?id=2444315)).\n\nMeanwhile the scammer simply switches numbers. A viral post warns people for a day or two. A record attached to their number and account keeps warning people for as long as it's there.",
      },
      {
        heading: "Step 1: Call 997 before you post anything",
        content:
          "Money sent to a scammer usually sits in the receiving account for a short while before it's pushed on through other accounts. That window is your best chance, which is why the first call is to **997**, the National Scam Response Centre (NSRC).\n\nThe NSRC is led by the Royal Malaysia Police together with Bank Negara Malaysia, MCMC and the National Anti-Financial Crime Centre, and it now runs 24 hours a day ([Fintech News Malaysia](https://fintechnews.my/56987/security/malaysia-scam-centre/), March 2026). In January 2026 alone it intercepted RM2.408 billion across 19,438 scam-related calls. The Deputy Home Minister urged victims to call within the golden period of less than 24 hours, because late reports give syndicates time to move the money in layers ([The Sun](https://thesun.my/news/malaysia-news/people-issues/nsrc-freezes-rm2-4-billion-in-scam-funds-in-january-2026/)).\n\nYou don't need a separate trip to the balai polis either. Speaking in March 2026, Fahmi Fadzil said: “We no longer need to make a separate police report; 997 is enough” ([The Star](https://www.thestar.com.my/news/nation/2026/03/04/call-997-if-you-are-scammed-says-fahmi)).\n\nBefore you dial, have these ready: your bank, the amount and time of each transfer, the transaction reference, and the account number you paid. Acting fast improves your chances of getting money back, but recovery is never guaranteed. For the bank side in detail, read our guide on [getting your money back after a scam](/blog/how-to-get-money-back-scammed-malaysia).",
      },
      {
        heading: "Step 2: Copy, paste, done. Put their details on record",
        content:
          "Once the money side is moving, make sure the scammer's details are recorded where the next victim will actually look. You don't need to fill in a form field by field.\n\nGo to [scamguards.app/submit](/submit) and use **Tell My Story**. Paste the WhatsApp chat, the seller's post, or just describe what happened in your own words, then tap **Read My Story**. The AI reads it, writes a short summary, and picks out what it finds, such as the bank account, the WhatsApp number, the scam type and the platform. It shows you all of it before anything is sent. Remove anything wrong, then tap **Report This Scammer**. If it missed something, choose **Edit Before Reporting** and add it yourself.\n\nThe numbers, bank accounts and emails in your report are saved with it. When anyone later searches one of them on ScamGuards, your report comes up, and reported numbers and accounts get their own page on the site. That's the version of exposing a scammer that's still working long after a viral post has been buried, because the warning appears at the exact moment someone is about to transfer money.\n\nTwo things make your report count. **Write what happened and include every detail you have**: reports with a proper description, more than one detail and a specific scam type are published straight away, while very thin ones are held for review first. And it's fair both ways: anyone who believes they were reported by mistake can file a dispute, and ScamGuards presents reports as community information, not legal proof.\n\nHere's what it looks like on a phone. The number and account are masked examples, not a real person.",
        figures: [
          {
            src: "/blog/expose-scammer-malaysia/report-paste.webp",
            alt: "The Tell My Story box on the ScamGuards report page with a scam story pasted in, mentioning a Maybank account and a WhatsApp number, masked as 5641 XXXX XXXX and 012-XXX XXXX",
            caption: "Paste the chat or write what happened, then tap Read My Story.",
            width: 672,
            height: 788,
          },
          {
            src: "/blog/expose-scammer-malaysia/report-found.webp",
            alt: "ScamGuards showing Done! Here's what we found: an AI summary of the ticket scam, scam type E-commerce Scam, platform Facebook, and three details found: a masked bank account, a masked WhatsApp number and the Facebook group, with Report This Scammer and Edit Before Reporting buttons",
            caption: "The AI finds the bank account and WhatsApp number for you. Nothing is sent until you tap Report This Scammer.",
            width: 672,
            height: 1404,
          },
        ],
      },
      {
        heading: "Step 3: Warn the next person, and check before you pay again",
        content:
          "Instead of sharing a scammer's face, share the check. Tell your group chat the number or account has been reported and send people to [scamguards.app/search](/search). Anyone can paste the details and see the reports for themselves, and nobody's personal photos get passed around.\n\nThe same tool protects you next time. If the result shows reports, don't pay, and add your own report so the warning gets stronger. If it shows none, remember the results page's own caution: it's based on what people have reported and isn't proof by itself. Pay through the platform or by cash on delivery where you can, and you can also cross-check a bank account on PDRM's Semak Mule at semakmule.rmp.gov.my.",
        stepsLabel: "Check a seller in 2 steps",
        steps: [
          {
            title: "Paste the message",
            body: "Copy the seller's message, or just their number or bank account, into **scamguards.app/search** and tap **Scan This Message**. AI finds the contact details in it.",
          },
          {
            title: "Search and read the result",
            body: "Tap **Search for Reports** to see if it's been reported. **No reports isn't a green light**, it only means nobody has reported it yet.",
          },
        ],
        figures: [
          {
            src: "/blog/expose-scammer-malaysia/check-found.webp",
            alt: "The Paste a Message box on the ScamGuards search page after scanning a ticket seller's message, showing Found 2 contact details, a masked bank account and WhatsApp number, a suggestion that it looks like an ecommerce scam, and a Search for Reports button",
            caption: "It picks the bank account and WhatsApp number out of the message. Then tap Search for Reports.",
            width: 672,
            height: 1322,
          },
          {
            src: "/blog/expose-scammer-malaysia/check-result.webp",
            alt: "The ScamGuards result screen for a masked phone number, showing No Reports Found and an explanation that no matching reports were found",
            caption: "No reports found only means nobody has reported it yet.",
            width: 780,
            height: 974,
          },
        ],
      },
      {
        heading: "How ScamGuards helps",
        content:
          "ScamGuards is a community-driven scam checker for Malaysia. It exists because its founder was scammed in a WhatsApp trading card group that claimed to filter out scammers. Every report someone submits makes the next person's check more useful.\n\nThe stakes are big. Malaysians lost about RM2.8 billion to scams in 2025, according to Bank Negara Malaysia's 2025 Annual Report ([Fintech News Malaysia](https://fintechnews.my/57531/cyber-security/malaysians-lost-rm2-8-billion-to-scams-in-2025-is-bnms-response-matching-the-crisis/)), and a lot of it starts with one number or bank account nobody thought to check.\n\nSo when you're angry, point that anger somewhere that works. **Call 997** first. Then [report the scammer on ScamGuards](/submit) by pasting the chat, and [check any seller before you pay](/search). If it happened to you, it isn't your fault, and you're far from powerless.",
      },
    ],
  },
  {
    slug: "cara-dedah-scammer-malaysia",
    title: "Nak Dedah Scammer? 3 Langkah Yang Betul-Betul Buat Mereka Rugi",
    metaTitle: "Cara Dedah Scammer Malaysia Dengan Selamat | ScamGuards",
    metaDescription:
      "Geram kena tipu? Viralkan gambar scammer boleh makan diri. Bekukan duit, simpan nombor dan akaun bank mereka dalam rekod, dan beri amaran dalam 3 langkah.",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    readingTime: "6 minit bacaan",
    excerpt:
      "Viralkan muka dan akaun bank scammer memang puas hati, tapi jarang hentikan mereka, malah boleh buat anda sendiri kena di bawah undang-undang doxxing. Ini cara balas yang betul: tiga langkah, kebanyakannya salin dan tampal.",
    keywords: [
      "dedah scammer",
      "senarai scammer malaysia",
      "viralkan scammer",
      "lapor akaun bank scammer",
      "akaun keldai",
      "NSRC 997",
      "undang-undang doxxing malaysia",
    ],
    language: "ms",
    translationSlug: "expose-scammer-malaysia",
    sections: [
      {
        heading: "Jawapan ringkas: 3 langkah yang betul-betul kena pada scammer",
        content:
          "Baru kena tipu, memang rasa nak sebar gambar, nama dan nombor akaun scammer tu ke semua group. Perasaan tu normal. Masalahnya, itulah langkah yang paling kurang menyusahkan scammer.\n\nYang betul-betul buat scammer rugi ialah duit kena bekukan, akaun kena tutup, dan mangsa seterusnya dapat tahu sebelum sempat bayar. Ketiga-tiganya boleh anda mulakan hari ini juga, dan kebanyakannya cuma salin dan tampal.",
        stepsLabel: "Lapor scammer dalam 3 langkah",
        steps: [
          {
            title: "Telefon 997 segera",
            body: "Pusat Respons Scam Kebangsaan boleh bertindak untuk **bekukan duit** sebelum dikeluarkan. Panggilan itu juga dikira sebagai laporan polis anda.",
          },
          {
            title: "Salin dan tampal ke ScamGuards",
            body: "Tampal perbualan atau cerita anda di **scamguards.app/submit**. AI keluarkan akaun bank, nombor telefon dan butiran lain untuk anda semak, kemudian hantar.",
          },
          {
            title: "Beri amaran dengan cara selamat",
            body: "Kongsi semakan ScamGuards, bukan gambar mereka. Orang seterusnya yang cari nombor atau akaun itu akan nampak amaran **sebelum** bayar.",
          },
        ],
      },
      {
        heading: "Cerita yang selalu berlaku, dan post yang makan diri",
        content:
          "Corak biasa macam ni. Ada orang dalam group Facebook jual tiket konsert bawah harga rasmi. Penjual balas laju, hantar tangkap layar tiket, dan minta deposit untuk simpan tiket. Anda pun transfer. Lepas tu dia senyap, post hilang, dan mesej WhatsApp anda tinggal satu tick kelabu.\n\nRamai mangsa terus post gambar profil penjual, nama pada akaun bank dan nombor telefon ke semua group, siap dengan amaran huruf besar. Rasa macam dapat keadilan. Tapi selalunya ia jadi masalah dalam tiga cara.\n\n**Nama pada akaun selalunya bukan scammer.** Sindiket guna akaun keldai, yang kerap disewa atau dibeli daripada orang yang bukan dalang scam itu. Undang-undang sudah pun kejar akaun-akaun ini: sejak Oktober 2024, benarkan orang lain guna akaun anda adalah kesalahan di bawah seksyen 424B Kanun Keseksaan dengan penjara satu hingga tujuh tahun, dan melakukan transaksi haram di bawah seksyen 424C membawa penjara tiga hingga sepuluh tahun ([Low & Partners](https://www.lowpartners.com/keldai-accounts-when-helping-a-friend-becomes-a-criminal-offence)).\n\n**Gambar tu mungkin dicuri.** Gambar profil scammer selalunya diambil daripada orang lain yang tak ada kena-mengena. Sebar gambar itu cuma pindahkan mudarat kepada orang yang tak bersalah.\n\n**Anda pula yang boleh didakwa.** Pindaan Kanun Keseksaan yang berkuat kuasa pada 11 Julai 2025 menjadikan penyebaran maklumat peribadi orang lain tanpa izin, atau doxxing, satu jenayah serius yang boleh dihukum penjara sehingga tiga tahun ([Bernama](https://www.bernama.com/en/news.php?id=2444315)).\n\nScammer pula cuma tukar nombor. Post viral beri amaran sehari dua. Rekod pada nombor dan akaun mereka terus beri amaran selagi ia ada.",
      },
      {
        heading: "Langkah 1: Telefon 997 dulu, jangan post dulu",
        content:
          "Duit yang anda hantar kepada scammer biasanya duduk dalam akaun penerima sekejap sebelum dipindahkan ke akaun lain. Tempoh itulah peluang terbaik anda, sebab itu panggilan pertama ialah ke **997**, Pusat Respons Scam Kebangsaan (NSRC).\n\nNSRC diketuai Polis Diraja Malaysia bersama Bank Negara Malaysia, MCMC dan Pusat Kawalan Jenayah Kewangan Nasional, dan kini beroperasi 24 jam sehari ([Fintech News Malaysia](https://fintechnews.my/56987/security/malaysia-scam-centre/), Mac 2026). Pada Januari 2026 sahaja, NSRC memintas RM2.408 bilion daripada 19,438 panggilan berkaitan scam. Timbalan Menteri Dalam Negeri menggesa mangsa menelefon dalam tempoh emas kurang 24 jam, kerana laporan lewat memberi sindiket masa untuk pindahkan duit berlapis-lapis ([The Sun](https://thesun.my/news/malaysia-news/people-issues/nsrc-freezes-rm2-4-billion-in-scam-funds-in-january-2026/)).\n\nAnda juga tak perlu ke balai polis secara berasingan. Bercakap pada Mac 2026, Fahmi Fadzil berkata: “We no longer need to make a separate police report; 997 is enough” ([The Star](https://www.thestar.com.my/news/nation/2026/03/04/call-997-if-you-are-scammed-says-fahmi)), iaitu laporan polis berasingan tidak lagi diperlukan kerana 997 sudah memadai.\n\nSebelum dail, sediakan: nama bank anda, jumlah dan masa setiap pemindahan, nombor rujukan transaksi, dan nombor akaun yang anda bayar. Bertindak cepat meningkatkan peluang dapat balik duit, tetapi pulangan tidak pernah dijamin. Untuk langkah dengan pihak bank, baca panduan kami [Kena Tipu Online? Apa Nak Buat](/blog/kena-tipu-online-apa-nak-buat).",
      },
      {
        heading: "Langkah 2: Salin, tampal, siap. Simpan butiran mereka dalam rekod",
        content:
          "Bila urusan duit sudah bergerak, pastikan butiran scammer direkodkan di tempat mangsa seterusnya betul-betul akan cari. Anda tak perlu isi borang satu per satu.\n\nPergi ke [scamguards.app/submit](/submit) dan guna **Tell My Story**. Tampal perbualan WhatsApp, post penjual, atau tulis sahaja apa yang berlaku dalam bahasa anda sendiri, kemudian tekan **Read My Story**. AI akan baca, tulis ringkasan pendek, dan keluarkan apa yang dijumpai, seperti akaun bank, nombor WhatsApp, jenis scam dan platform. Semuanya ditunjukkan kepada anda sebelum apa-apa dihantar. Buang yang salah, kemudian tekan **Report This Scammer**. Kalau ada yang tertinggal, pilih **Edit Before Reporting** dan tambah sendiri.\n\nNombor telefon, akaun bank dan emel dalam laporan anda disimpan bersama laporan itu. Bila sesiapa cari salah satu daripadanya di ScamGuards, laporan anda akan keluar, dan nombor serta akaun yang pernah dilaporkan mendapat halaman sendiri di laman ini. Inilah cara dedah scammer yang masih berkesan lama selepas post viral tenggelam, kerana amaran muncul tepat ketika seseorang hendak transfer duit.\n\nDua perkara buat laporan anda lebih bermakna. **Ceritakan apa yang berlaku dan masukkan semua butiran yang ada**: laporan yang ada penerangan, lebih daripada satu butiran dan jenis scam yang jelas diterbitkan terus, manakala laporan yang terlalu nipis disemak dahulu. Ia juga adil untuk semua pihak: sesiapa yang rasa dilaporkan secara salah boleh buat pertikaian, dan ScamGuards memaparkan laporan sebagai maklumat komuniti, bukan bukti undang-undang.\n\nBeginilah rupanya di telefon. Nombor dan akaun di bawah adalah contoh yang ditutup, bukan orang sebenar. Paparan borang di laman ini dalam Bahasa Inggeris.",
        figures: [
          {
            src: "/blog/cara-dedah-scammer-malaysia/report-paste.webp",
            alt: "Kotak Tell My Story di halaman laporan ScamGuards dengan cerita scam dalam Bahasa Melayu ditampal, menyebut akaun Maybank dan nombor WhatsApp yang ditutup sebagai 5641 XXXX XXXX dan 012-XXX XXXX",
            caption: "Tampal perbualan atau tulis apa yang berlaku, kemudian tekan Read My Story.",
            width: 672,
            height: 788,
          },
          {
            src: "/blog/cara-dedah-scammer-malaysia/report-found.webp",
            alt: "ScamGuards memaparkan Done! Here's what we found: ringkasan AI tentang scam tiket, jenis E-commerce Scam, platform Facebook group, serta akaun bank dan nombor WhatsApp yang ditutup, dengan butang Report This Scammer dan Edit Before Reporting",
            caption: "AI jumpa akaun bank dan nombor WhatsApp untuk anda. Tiada apa dihantar sehingga anda tekan Report This Scammer.",
            width: 672,
            height: 1188,
          },
        ],
      },
      {
        heading: "Langkah 3: Beri amaran kepada orang lain, dan semak sebelum bayar lagi",
        content:
          "Daripada kongsi muka scammer, kongsi semakannya. Beritahu group anda yang nombor atau akaun itu sudah dilaporkan dan hantar mereka ke [scamguards.app/search](/search). Sesiapa pun boleh tampal butiran dan tengok laporannya sendiri, tanpa gambar peribadi sesiapa disebarkan.\n\nAlat yang sama melindungi anda lain kali. Kalau keputusan menunjukkan ada laporan, jangan bayar, dan tambah laporan anda supaya amaran jadi lebih kuat. Kalau tiada laporan, ingat peringatan pada halaman keputusan itu sendiri: ia berdasarkan apa yang dilaporkan orang dan bukan bukti semata-mata. Bayar melalui platform atau secara COD bila boleh, dan anda juga boleh semak akaun bank di Semak Mule PDRM di semakmule.rmp.gov.my.",
        stepsLabel: "Semak penjual dalam 2 langkah",
        steps: [
          {
            title: "Tampal mesej",
            body: "Salin mesej penjual, atau nombor telefon atau akaun bank sahaja, ke **scamguards.app/search** dan tekan **Scan This Message**. AI akan cari butiran hubungan di dalamnya.",
          },
          {
            title: "Cari dan baca keputusan",
            body: "Tekan **Search for Reports** untuk tahu sama ada ia pernah dilaporkan. **Tiada laporan bukan lampu hijau**, ia cuma bermaksud belum ada orang yang melaporkannya.",
          },
        ],
        figures: [
          {
            src: "/blog/cara-dedah-scammer-malaysia/check-found.webp",
            alt: "Kotak Paste a Message di halaman carian ScamGuards selepas mengimbas mesej penjual tiket dalam Bahasa Melayu, menunjukkan Found 2 contact details, akaun bank dan nombor WhatsApp yang ditutup, cadangan bahawa ia kelihatan seperti ecommerce scam, dan butang Search for Reports",
            caption: "Ia keluarkan akaun bank dan nombor WhatsApp daripada mesej. Kemudian tekan Search for Reports.",
            width: 672,
            height: 1322,
          },
          {
            src: "/blog/cara-dedah-scammer-malaysia/check-result.webp",
            alt: "Skrin keputusan ScamGuards untuk nombor telefon yang ditutup, menunjukkan No Reports Found dan penerangan bahawa tiada laporan sepadan dijumpai",
            caption: "Tiada laporan hanya bermaksud belum ada orang yang melaporkannya.",
            width: 780,
            height: 974,
          },
        ],
      },
      {
        heading: "Bagaimana ScamGuards membantu",
        content:
          "ScamGuards ialah platform semakan scam berasaskan komuniti untuk Malaysia. Ia wujud kerana pengasasnya sendiri pernah kena tipu dalam group WhatsApp kad dagangan yang mendakwa menapis scammer. Setiap laporan yang dihantar menjadikan semakan orang seterusnya lebih berguna.\n\nTaruhannya besar. Rakyat Malaysia kerugian kira-kira RM2.8 bilion akibat scam pada 2025, menurut Laporan Tahunan 2025 Bank Negara Malaysia ([Fintech News Malaysia](https://fintechnews.my/57531/cyber-security/malaysians-lost-rm2-8-billion-to-scams-in-2025-is-bnms-response-matching-the-crisis/)), dan banyak daripadanya bermula dengan satu nombor atau akaun bank yang tidak disemak.\n\nJadi bila geram, salurkan ke tempat yang berkesan. **Telefon 997** dahulu. Kemudian [lapor scammer di ScamGuards](/submit) dengan menampal perbualan, dan [semak mana-mana penjual sebelum bayar](/search). Kalau ia berlaku kepada anda, itu bukan salah anda, dan anda bukannya tak berdaya.",
      },
    ],
  },
  {
    slug: "scam-victim-help-malaysia",
    title: "Lost Your Savings to a Scam? Free Help for Scam Victims in Malaysia",
    metaTitle: "Scam Victim Help Malaysia: Free Support | ScamGuards",
    metaDescription:
      "Lost money to a scam in Malaysia? Free help for what comes next: 997 runs 24/7, AKPK for debt, a free loan check, fake recovery offers and who to talk to.",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    readingTime: "7 min read",
    excerpt:
      "The first hour is about stopping the money. After that come the bills, the debt, fake \"we can get your money back\" offers, and the shame. This guide shows you where to get free help.",
    keywords: [
      "scam victim help malaysia",
      "lost savings to scam malaysia",
      "scam victim support malaysia",
      "akpk debt help after scam",
      "fund recovery scam malaysia",
      "free credit report eccris",
      "fmos complaint bank fraud",
    ],
    language: "en",
    translationSlug: "bantuan-mangsa-scam-malaysia",
    sections: [
      {
        heading: "The Short Answer: Where to Get Free Help",
        content:
          "First, this is not your fault. A scam is a crime done to you.\n\nYou are not alone, either. In 2025, Malaysians reported **66,204 online scam cases** and lost **RM2.97 billion**, police figures show ([theSun](https://thesun.my/news/malaysia-news/crime/online-scam-losses-hit-rm2-97-billion-in-2025-says-igp/)).\n\n**Did the money leave your account in the last few hours?** Stop reading. Call your bank now, then call **997**. The 997 scam hotline (NSRC) is open **24 hours a day** ([MyGOV](https://www.malaysia.gov.my/en/categories/safety-and-community/cybersecurity/nsrc-997-hotline)). After that, read [how to get your money back](/blog/how-to-get-money-back-scammed-malaysia).\n\nThis guide is for the days and weeks after. Everything below is free.\n\n**Numbers to save in your phone:**\n- **997:** scam hotline, 24 hours\n- **03-2616 7766:** AKPK, free help with debt\n- **03-7627 2929:** Befrienders, someone to talk to, 24 hours\n- **15555:** Talian HEAL, mental health support, 8am to midnight",
        stepsLabel: "Your first week, in 3 steps",
        steps: [
          {
            title: "Report it",
            body: "Call **997** and your bank. Make a police report within 24 hours. Keep the report number, because you will need it.",
          },
          {
            title: "Protect what you have left",
            body: "Check that nobody took a loan in your name. Never pay anyone who says they can get your money back.",
          },
          {
            title: "Get help with debt and stress",
            body: "AKPK helps with bank debt for free. Befrienders (03-7627 2929) will listen, day or night.",
          },
        ],
      },
      {
        heading: "In Debt Because of the Scam? Go to AKPK First",
        content:
          "After a big loss, many people borrow more money to cover the gap. This usually makes things worse. Talk to AKPK before you borrow.\n\n**What is AKPK?** It is an agency set up by Bank Negara Malaysia. It gives free advice about money and debt ([AKPK](https://www.akpk.org.my/debt-management)).\n\n**How it helps:** AKPK runs a free **Debt Management Programme**. An adviser looks at all your bank debts. Then they make one repayment plan for you, and ask your banks to agree to it.\n\n**Who can join** ([AKPK FAQ](https://www.akpk.org.my/faq-details/16)):\n- You owe money to banks, for example on credit cards, personal loans, a car loan or a house loan\n- You owe RM5 million or less in total\n- You are finding it hard to pay\n- You have not been made bankrupt\n\n**Good to know before you join:**\n- AKPK does not lend money\n- It cannot help with debts to moneylenders\n- Your credit cards will be cancelled\n- AKPK never uses agents. If someone asks you for a fee to \"apply for you\", they are not from AKPK\n\n**How to contact AKPK:** call **03-2616 7766**, apply online at [customer.akpk.org.my](https://customer.akpk.org.my), or visit a branch on a weekday.\n\n**Thinking of borrowing from a moneylender?** First check that they have a licence. Use the government's **i-KrediKom** app, or go to kpkt.gov.my. A licensed lender cannot charge more than 18% interest a year. If the loan is secured with something like property, the limit is 12% ([KPKT](https://www.kpkt.gov.my/index.php/pages/view/585)). Lenders without a licence (ah long) are illegal. Report them to the police.",
      },
      {
        heading: "Did Anyone Take a Loan in Your Name?",
        content:
          "Did you send the scammer a photo of your IC, a selfie with your MyKad, or your bank login? Then someone may try to use your details.\n\n**Check your loan record for free.** Bank Negara keeps a record of the loans in your name. It is called **CCRIS**. You can see it online for free through **eCCRIS** ([BNM](https://www.bnm.gov.my/ccris)).\n\n**How to see your CCRIS record:**\n1. Go to eccris.bnm.gov.my\n2. Sign up with your MyKad and your online banking\n3. If you need help, go to any AKPK branch\n\n**CTOS** also gives you a free basic report, twice a year ([CTOS](https://ctoscredit.com.my/)). It shows court cases and bankruptcy. It does not show your bank loans, so check both.\n\n**Found a loan or card you never asked for?**\n1. Call that bank or lender now. Tell them it is not yours\n2. Make a police report. Give the lender the report number\n3. Tell your own bank that your details were stolen in a scam\n\nCCRIS only shows the last 12 months, and not every lender is on it. Check again in a few months.",
      },
      {
        heading: "Beware the Second Scam: \"We Can Get Your Money Back\"",
        content:
          "Scammers often go after the same victim again. This time, they pretend to help.\n\nYou may see a Facebook ad, or get a WhatsApp message. The person says they are a recovery agent, or even an officer from 997 (NSRC). They promise to get your money back. But first, they want a fee.\n\n**The police have warned about this.** In April 2026, police said fake \"NSRC officers\" were taking fees from victims, bit by bit ([Malay Mail](https://www.malaymail.com/news/malaysia/2026/04/13/pay-more-lose-more-police-warn-of-double-scam-trapping-victims-with-fake-recovery-offers/216147)). Police have also warned about a fake Facebook ad that used the PDRM logo ([Malay Mail](https://www.malaymail.com/news/malaysia/2025/05/18/scam-ad-promising-to-recover-scam-money-is-a-scam-itself-pdrm-warn/177151)). And about fake letters saying a government agency gives scam money back ([The Vibes](https://www.thevibes.com/articles/news/117151/police-warn-public-against-fake-fund-recovery-documents)).\n\n**Remember three things:**\n- The police, 997 and your bank never charge a fee to return your money\n- Nobody can promise to get your money back\n- If you must pay a \"fee\", \"tax\" or \"release charge\" first, it is a scam\n\n**Not sure about a message?** Copy it and paste it into scamguards.app/search. The **Paste a Message** box finds the phone numbers, bank accounts and emails in it. Then you can see if anyone has reported them.",
      },
      {
        heading: "What If the Bank Won't Give Your Money Back?",
        content:
          "Banks do not refund every scam. It depends on one question: **did you allow the payment?**\n\n**If you did NOT allow it,** your bank must follow Bank Negara's rules. For example, you clicked a fake link and scammers used your bank account. These rules started on 1 October 2024 ([BNM](https://www.bnm.gov.my/-/pd-fair-treatment24)). Your bank must:\n- tell you within 3 working days what information it needs\n- tell you to make a police report\n- give you its answer in writing\n\nIf the bank's checks take more than 14 working days, it must offer to put back up to RM5,000 for now. You pay no interest on it.\n\n**If you made the transfer yourself** because you were tricked, these rules may not help you. Still, ask the bank to give you its answer in writing.\n\n**Don't agree with the bank's answer?** You can complain to **FMOS**. It is a free service that settles disputes between customers and banks. It used to be called OFS ([FMOS](https://www.fmos.org.my/en/faq/)).\n1. First, complain to your bank or e-wallet\n2. Then go to FMOS within 6 months of the bank's final answer\n3. If the bank has not replied within 60 days, you can go to FMOS straight away\n\nFor payments you did not allow, FMOS handles claims of up to RM250,000. Call FMOS on **03-2272 2811**. You can also complain about how your bank treated you to Bank Negara, through BNMLINK on **1-300-88-5465**.",
      },
      {
        heading: "You Don't Have to Face This Alone",
        content:
          "Many victims feel ashamed and keep quiet. In August 2026, a counsellor told The Star that shame and guilt stop some victims from reporting ([The Star](https://www.thestar.com.my/news/nation/2026/08/31/scams-that-steal-more-than-money)).\n\nScams are run by organised groups who are very good at tricking people. Being tricked by them does not mean you are foolish.\n\n**Free people to talk to:**\n- **Befrienders KL:** 03-7627 2929. Open 24 hours. Free and private ([Befrienders](https://www.befrienders.org.my/))\n- **Talian HEAL 15555:** the Ministry of Health's mental health line. 8am to midnight, every day ([The Star](https://www.thestar.com.my/news/nation/2026/07/09/malaysias-mental-health-helpline-received-more-than-230000-calls-since-launch-says-health-ministry))\n- **Talian Kasih 15999**, or WhatsApp 019-261 5999. Open 24 hours, for counselling and welfare help ([MyGOV](https://www.malaysia.gov.my/en/topics/talian-kasih-15999))\n\n**If you feel like ending your life,** call Befrienders now, or go to the nearest hospital emergency department.\n\n**How ScamGuards helps.** Your money may be gone. But the scammer may still be using the same phone number and bank account on other people. You can help stop that:\n1. Go to scamguards.app/submit and choose **Tell My Story**\n2. Paste your chat with the scammer, then press **Read My Story**. It picks out details like the phone number for you to check\n3. Press **Report This Scammer**. Nothing is sent until you do\n\nOnce your report is live, that number or account gets its own public page. The next person who searches for it will see your warning.",
      },
    ],
  },
  {
    slug: "bantuan-mangsa-scam-malaysia",
    title: "Hilang Duit Simpanan Kena Scam? Bantuan Percuma untuk Mangsa di Malaysia",
    metaTitle: "Bantuan Mangsa Scam Malaysia: Sokongan Percuma | ScamGuards",
    metaDescription:
      "Kena scam dan hilang duit? Bantuan percuma selepas itu: talian 997 24 jam, AKPK untuk hutang, semak CCRIS percuma, tawaran pemulihan palsu dan tempat mengadu.",
    publishedAt: "2026-09-15",
    updatedAt: "2026-09-15",
    readingTime: "7 minit bacaan",
    excerpt:
      "Jam pertama ialah untuk menyekat duit. Selepas itu datang bil, hutang, tawaran palsu \"kami boleh dapatkan balik duit anda\", dan rasa malu. Panduan ini tunjuk di mana anda boleh dapat bantuan percuma.",
    keywords: [
      "bantuan mangsa scam",
      "mangsa scam malaysia",
      "hilang duit simpanan kena scam",
      "kena scam banyak hutang",
      "akpk bantuan hutang",
      "semak ccris percuma",
      "scam pemulihan dana",
    ],
    language: "ms",
    translationSlug: "scam-victim-help-malaysia",
    sections: [
      {
        heading: "Jawapan Ringkas: Di Mana Nak Dapat Bantuan Percuma",
        content:
          "Pertama, ini bukan salah anda. Scam ialah jenayah yang dilakukan terhadap anda.\n\nAnda juga tidak keseorangan. Pada 2025, rakyat Malaysia melaporkan **66,204 kes scam dalam talian** dan rugi **RM2.97 bilion**, menurut angka polis ([theSun](https://thesun.my/news/malaysia-news/crime/online-scam-losses-hit-rm2-97-billion-in-2025-says-igp/)).\n\n**Duit baru keluar dari akaun dalam beberapa jam lepas?** Berhenti membaca. Telefon bank anda sekarang, kemudian telefon **997**. Talian scam 997 (NSRC) dibuka **24 jam sehari** ([MyGOV](https://www.malaysia.gov.my/en/categories/safety-and-community/cybersecurity/nsrc-997-hotline)). Selepas itu, baca [apa nak buat bila kena tipu online](/blog/kena-tipu-online-apa-nak-buat).\n\nPanduan ini untuk hari dan minggu selepas itu. Semua bantuan di bawah percuma.\n\n**Nombor untuk disimpan dalam telefon:**\n- **997:** talian scam, 24 jam\n- **03-2616 7766:** AKPK, bantuan hutang percuma\n- **03-7627 2929:** Befrienders, tempat meluah perasaan, 24 jam\n- **15555:** Talian HEAL, sokongan kesihatan mental, 8 pagi hingga 12 tengah malam",
        stepsLabel: "Minggu pertama anda, dalam 3 langkah",
        steps: [
          {
            title: "Buat laporan",
            body: "Telefon **997** dan bank anda. Buat laporan polis dalam masa 24 jam. Simpan nombor laporan, sebab anda akan memerlukannya.",
          },
          {
            title: "Lindungi apa yang masih ada",
            body: "Pastikan tiada orang buat pinjaman guna nama anda. Jangan bayar sesiapa yang kata boleh dapatkan balik duit anda.",
          },
          {
            title: "Dapatkan bantuan hutang dan tekanan",
            body: "AKPK bantu urus hutang bank secara percuma. Befrienders (03-7627 2929) sedia mendengar, siang atau malam.",
          },
        ],
      },
      {
        heading: "Berhutang Sebab Kena Scam? Pergi ke AKPK Dulu",
        content:
          "Selepas rugi besar, ramai orang pinjam lagi untuk tutup kekurangan. Selalunya ini buat keadaan lebih teruk. Jumpa AKPK dulu sebelum anda pinjam.\n\n**Apa itu AKPK?** Ia agensi yang ditubuhkan oleh Bank Negara Malaysia. AKPK beri nasihat percuma tentang duit dan hutang ([AKPK](https://www.akpk.org.my/debt-management)).\n\n**Cara AKPK membantu:** AKPK ada **Program Pengurusan Kredit (PPK)** yang percuma. Penasihat akan tengok semua hutang bank anda. Kemudian mereka buat satu pelan bayaran balik untuk anda, dan minta bank anda bersetuju.\n\n**Siapa boleh sertai** ([Soalan Lazim AKPK](https://www.akpk.org.my/faq-details/16)):\n- Anda berhutang dengan bank, contohnya kad kredit, pinjaman peribadi, pinjaman kereta atau pinjaman rumah\n- Jumlah hutang anda RM5 juta atau kurang\n- Anda susah nak bayar\n- Anda belum diisytiharkan bankrap\n\n**Perlu tahu sebelum sertai:**\n- AKPK tidak memberi pinjaman\n- AKPK tidak boleh bantu hutang dengan pemberi pinjam wang\n- Kad kredit anda akan dibatalkan\n- AKPK tidak guna ejen. Kalau ada orang minta bayaran untuk \"tolong mohonkan\", orang itu bukan dari AKPK\n\n**Cara hubungi AKPK:** telefon **03-2616 7766**, mohon dalam talian di [customer.akpk.org.my](https://customer.akpk.org.my), atau pergi ke cawangan pada hari bekerja.\n\n**Terfikir nak pinjam daripada pemberi pinjam wang?** Semak dulu mereka ada lesen. Guna aplikasi kerajaan **i-KrediKom**, atau pergi ke kpkt.gov.my. Pemberi pinjam berlesen tidak boleh caj faedah lebih 18% setahun. Kalau pinjaman itu ada cagaran seperti hartanah, hadnya 12% ([KPKT](https://www.kpkt.gov.my/index.php/pages/view/585)). Pemberi pinjam tanpa lesen (ah long) adalah haram. Laporkan mereka kepada polis.",
      },
      {
        heading: "Ada Orang Buat Pinjaman Guna Nama Anda?",
        content:
          "Pernah hantar gambar IC, swafoto dengan MyKad, atau maklumat log masuk bank kepada scammer? Kalau ya, ada orang mungkin cuba guna maklumat anda.\n\n**Semak rekod pinjaman anda secara percuma.** Bank Negara menyimpan rekod pinjaman atas nama anda. Rekod ini dipanggil **CCRIS**. Anda boleh tengok dalam talian secara percuma melalui **eCCRIS** ([BNM](https://www.bnm.gov.my/ccris)).\n\n**Cara tengok rekod CCRIS anda:**\n1. Pergi ke eccris.bnm.gov.my\n2. Daftar guna MyKad dan perbankan dalam talian anda\n3. Kalau perlukan bantuan, pergi ke mana-mana cawangan AKPK\n\n**CTOS** juga beri laporan asas percuma, dua kali setahun ([CTOS](https://ctoscredit.com.my/)). Laporan ini tunjuk kes mahkamah dan bankrap. Ia tidak tunjuk pinjaman bank anda, jadi semak kedua-duanya.\n\n**Jumpa pinjaman atau kad yang anda tak pernah mohon?**\n1. Telefon bank atau pemberi pinjaman itu sekarang. Beritahu itu bukan anda punya\n2. Buat laporan polis. Beri nombor laporan kepada pemberi pinjaman\n3. Beritahu bank anda sendiri yang maklumat anda dicuri dalam scam\n\nCCRIS hanya tunjuk 12 bulan terakhir, dan bukan semua pemberi pinjaman ada di dalamnya. Semak semula selepas beberapa bulan.",
      },
      {
        heading: "Hati-hati Scam Kedua: \"Kami Boleh Dapatkan Balik Duit Anda\"",
        content:
          "Scammer sering kejar mangsa yang sama sekali lagi. Kali ini, mereka berpura-pura nak menolong.\n\nAnda mungkin nampak iklan Facebook, atau dapat mesej WhatsApp. Orang itu mengaku ejen pemulihan dana, atau pegawai 997 (NSRC). Mereka janji boleh dapatkan balik duit anda. Tapi mereka minta bayaran dulu.\n\n**Polis sudah beri amaran.** Pada April 2026, polis kata \"pegawai NSRC\" palsu mengutip bayaran daripada mangsa, sedikit demi sedikit ([Malay Mail](https://www.malaymail.com/news/malaysia/2026/04/13/pay-more-lose-more-police-warn-of-double-scam-trapping-victims-with-fake-recovery-offers/216147)). Polis juga beri amaran tentang iklan Facebook palsu yang guna logo PDRM ([Malay Mail](https://www.malaymail.com/news/malaysia/2025/05/18/scam-ad-promising-to-recover-scam-money-is-a-scam-itself-pdrm-warn/177151)). Begitu juga surat palsu yang kata agensi kerajaan pulangkan duit scam ([The Vibes](https://www.thevibes.com/articles/news/117151/police-warn-public-against-fake-fund-recovery-documents)).\n\n**Ingat tiga perkara:**\n- Polis, 997 dan bank tidak pernah minta bayaran untuk pulangkan duit anda\n- Tiada sesiapa boleh janji duit anda pasti kembali\n- Kalau kena bayar \"yuran\", \"cukai\" atau \"caj pelepasan\" dulu, itu scam\n\n**Ragu-ragu dengan satu mesej?** Salin dan tampal di scamguards.app/search. Kotak **Paste a Message** akan cari nombor telefon, akaun bank dan e-mel di dalamnya. Kemudian anda boleh tengok kalau ada orang pernah melaporkannya.",
      },
      {
        heading: "Bank Tak Mahu Pulangkan Duit? Ini Pilihan Anda",
        content:
          "Bank tidak pulangkan duit untuk setiap kes scam. Semuanya bergantung pada satu soalan: **adakah anda benarkan bayaran itu?**\n\n**Kalau anda TIDAK benarkan,** bank mesti ikut peraturan Bank Negara. Contohnya, anda tekan pautan palsu dan scammer guna akaun bank anda. Peraturan ini bermula 1 Oktober 2024 ([BNM](https://www.bnm.gov.my/-/pd-fair-treatment24)). Bank anda mesti:\n- beritahu dalam masa 3 hari bekerja maklumat yang diperlukan\n- suruh anda buat laporan polis\n- beri jawapan secara bertulis\n\nKalau semakan bank ambil masa lebih 14 hari bekerja, bank mesti tawarkan wang sementara sehingga RM5,000. Anda tidak perlu bayar faedah untuknya.\n\n**Kalau anda sendiri buat pindahan** sebab ditipu, peraturan ini mungkin tidak membantu. Namun, tetap minta bank beri jawapan secara bertulis.\n\n**Tak setuju dengan jawapan bank?** Anda boleh buat aduan kepada **FMOS**. Ia perkhidmatan percuma yang selesaikan pertikaian antara pelanggan dan bank. Dulu ia dipanggil OFS ([FMOS](https://www.fmos.org.my/en/faq/)).\n1. Mula-mula, buat aduan kepada bank atau e-dompet anda\n2. Kemudian pergi ke FMOS dalam masa 6 bulan selepas jawapan akhir bank\n3. Kalau bank tidak jawab dalam 60 hari, anda boleh terus pergi ke FMOS\n\nUntuk bayaran yang anda tidak benarkan, FMOS boleh uruskan tuntutan sehingga RM250,000. Telefon FMOS di **03-2272 2811**. Anda juga boleh adu tentang layanan bank kepada Bank Negara, melalui BNMLINK di **1-300-88-5465**.",
      },
      {
        heading: "Anda Tak Perlu Hadapi Seorang Diri",
        content:
          "Ramai mangsa rasa malu dan memilih untuk diam. Pada Ogos 2026, seorang kaunselor memberitahu The Star bahawa rasa malu dan bersalah membuatkan sesetengah mangsa tidak melapor ([The Star](https://www.thestar.com.my/news/nation/2026/08/31/scams-that-steal-more-than-money)).\n\nScam dijalankan oleh kumpulan tersusun yang sangat pandai menipu. Tertipu oleh mereka tidak bermaksud anda bodoh.\n\n**Tempat bercakap yang percuma:**\n- **Befrienders KL:** 03-7627 2929. Dibuka 24 jam. Percuma dan sulit ([Befrienders](https://www.befrienders.org.my/))\n- **Talian HEAL 15555:** talian kesihatan mental Kementerian Kesihatan. 8 pagi hingga 12 tengah malam, setiap hari ([The Star](https://www.thestar.com.my/news/nation/2026/07/09/malaysias-mental-health-helpline-received-more-than-230000-calls-since-launch-says-health-ministry))\n- **Talian Kasih 15999**, atau WhatsApp 019-261 5999. Dibuka 24 jam, untuk kaunseling dan bantuan kebajikan ([MyGOV](https://www.malaysia.gov.my/en/topics/talian-kasih-15999))\n\n**Kalau terfikir untuk menamatkan nyawa,** telefon Befrienders sekarang, atau pergi ke unit kecemasan hospital terdekat.\n\n**Bagaimana ScamGuards membantu.** Duit anda mungkin sudah hilang. Tetapi scammer itu mungkin masih guna nombor telefon dan akaun bank yang sama untuk menipu orang lain. Anda boleh bantu hentikannya:\n1. Pergi ke scamguards.app/submit dan pilih **Tell My Story**\n2. Tampal perbualan anda dengan scammer, kemudian tekan **Read My Story**. Ia akan keluarkan butiran seperti nombor telefon untuk anda semak\n3. Tekan **Report This Scammer**. Tiada apa dihantar sebelum anda tekan\n\nSelepas laporan anda disiarkan, nombor atau akaun itu akan ada halaman awamnya sendiri. Orang seterusnya yang mencarinya akan nampak amaran anda.",
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

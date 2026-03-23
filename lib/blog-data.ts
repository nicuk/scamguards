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
    slug: "get-money-back-after-scammed-malaysia",
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
    title: "Shopee & Carousell Scams in Malaysia: How to Spot and Report",
    metaTitle:
      "Shopee & Carousell Scams Malaysia - How to Spot Fake Sellers | ScamGuards",
    metaDescription:
      "How to spot and report scammers on Shopee, Carousell, and Lazada in Malaysia. Red flags, buyer protection tips, and what to do if you've been scammed.",
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
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

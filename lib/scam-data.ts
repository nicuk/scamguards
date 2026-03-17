export interface ScamType {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroEmoji: string;
  tldr: string;
  stats: string;
  what: string;
  howItWorks: string[];
  redFlags: string[];
  whatToDo: string[];
  realExample: string;
  sources: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
}

export const SCAM_TYPES: ScamType[] = [
  {
    slug: "macau-scam",
    title: "Macau Scam",
    metaTitle: "Macau Scam Malaysia - How to Spot & Report | ScamGuards",
    metaDescription:
      "Learn how Macau scams work in Malaysia. Scammers impersonate police, bank officers, or court officials to steal your money. Know the red flags and report scammers.",
    heroEmoji: "📞",
    tldr: "A Macau scam is a phone call from someone impersonating police, bank officers, or government officials who demand you transfer money to a \"safe account.\" It is the most common scam type in Malaysia, with 28,698 telecommunication fraud cases and RM715.7 million in losses reported in 2024 alone.",
    stats: "28,698 cases in 2024 · RM715.7 million lost · Most common scam type in Malaysia (Source: CCID/PDRM)",
    what: "A Macau scam is when criminals call you pretending to be police officers, bank officials, court officers, or government agencies like LHDN (tax) or KWSP. They claim you're involved in money laundering, have unpaid taxes, or a warrant for your arrest — then pressure you to transfer money to a \"safe account\" to clear your name.",
    howItWorks: [
      "You receive an unexpected call from someone claiming to be from the police, bank, LHDN, or court",
      "They tell you your IC or bank account is linked to a criminal case or money laundering",
      "They transfer you to a \"senior officer\" who sounds authoritative and threatening",
      "They pressure you to transfer all your savings to a \"safe account\" controlled by them",
      "Once you transfer, the money is immediately moved through multiple accounts and withdrawn",
    ],
    redFlags: [
      "Unexpected calls claiming you're involved in a crime you know nothing about",
      "Caller asks you NOT to tell anyone, especially family or your bank",
      "Requests to transfer money to a \"safe account\" or \"holding account\"",
      "Threats of arrest or legal action if you don't comply immediately",
      "Caller provides a fake \"case number\" or \"police report number\"",
      "Being transferred between multiple \"officers\" to build credibility",
    ],
    whatToDo: [
      "Hang up immediately — real police never ask for money transfers over the phone",
      "Call the real police at 999 or your local balai to verify",
      "Call your bank's official hotline if they claim to be from a bank",
      "Report the phone number on ScamGuards so others are warned",
      "Tell your family and friends about the call so they don't fall for it",
    ],
    realExample:
      "A retiree in Penang lost RM400,000 after receiving a call from someone claiming to be a \"Sergeant\" from Bukit Aman. They told her that her IC was used to open bank accounts for drug trafficking and she needed to transfer her life savings to a \"Bank Negara protection account\" within 2 hours or face arrest.",
    sources: [
      { label: "CCID Scam Statistics 2024", url: "https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/" },
      { label: "PDRM Commercial Crime Division", url: "https://www.rmp.gov.my/" },
      { label: "BNM Fraud Alerts", url: "https://www.bnm.gov.my/consumer-alert" },
    ],
    faqs: [
      {
        question: "Will the police really call me about a case?",
        answer:
          "No. Malaysian police will never call you to demand money transfers. If there's a real case, they will issue an official summons or visit you in person. Any phone call asking for money is a scam.",
      },
      {
        question: "What if the caller knows my full name and IC number?",
        answer:
          "Scammers buy leaked personal data from data breaches. Knowing your name or IC does not make them legitimate. Real authorities already have your details and don't need to call to verify.",
      },
      {
        question: "Can I get my money back after a Macau scam?",
        answer:
          "It's very difficult but act fast. Report to your bank immediately to freeze the receiving account. File a police report. Contact CCID (Commercial Crime Investigation Department) at 03-2610 1559.",
      },
    ],
    keywords: [
      "macau scam malaysia",
      "macau scam phone call",
      "police scam call malaysia",
      "penipuan macau",
      "scam panggilan polis",
      "how to report macau scam",
    ],
  },
  {
    slug: "tcg-collectibles-scam",
    title: "TCG & Collectibles Scam",
    metaTitle:
      "TCG & Collectibles Scam Malaysia - One Piece, Pokemon Card Scams | ScamGuards",
    metaDescription:
      "Protect yourself from fake TCG sellers in Malaysia. Scammers on WhatsApp groups, Carousell & Facebook sell fake One Piece, Pokemon cards and never deliver. Check sellers first.",
    heroEmoji: "🃏",
    tldr: "TCG scams target buyers of One Piece, Pokemon, and Dragon Ball cards on WhatsApp groups, Carousell, and Facebook Marketplace. Scammers post stolen photos of rare cards, collect bank transfers, and disappear. E-commerce fraud accounted for 14,881 cases and RM123.7 million in losses in Malaysia in 2024.",
    stats: "14,881 e-commerce fraud cases in 2024 · RM123.7 million lost · WhatsApp groups and Carousell are top platforms (Source: CCID/PDRM)",
    what: "TCG (Trading Card Game) and collectibles scams target fans of One Piece, Pokemon, Dragon Ball, and other card games. Scammers create fake seller profiles on WhatsApp groups, Facebook Marketplace, and Carousell, offering rare cards at attractive prices. After you pay, the cards never arrive — or you receive cheap fakes.",
    howItWorks: [
      "Scammer joins popular TCG WhatsApp groups or Facebook communities posing as a trusted seller",
      "They post photos of rare, high-value cards (often stolen photos from real sellers)",
      "They offer prices that seem like a good deal but not suspiciously cheap",
      "They insist on direct bank transfer instead of platform-protected payment",
      "After receiving payment, they block you and disappear from the group",
    ],
    redFlags: [
      "Seller insists on bank transfer instead of COD or platform payment protection",
      "Brand new account with no reviews or transaction history",
      "Prices that are significantly below market value for rare cards",
      "Seller uses stock photos or images easily found on Google",
      "Refuses to do video call showing the actual cards",
      "Pressures you to pay quickly because \"many people are interested\"",
      "WhatsApp group admins claim to \"filter scammers\" but have no verification process",
    ],
    whatToDo: [
      "Always check the seller's phone number or bank account on ScamGuards before paying",
      "Use COD (Cash on Delivery) for high-value cards whenever possible",
      "Buy through platforms with buyer protection (Shopee, Carousell with escrow)",
      "Ask for a video call where the seller shows the cards with your name written on paper",
      "Report the scammer's details on ScamGuards to protect other collectors",
    ],
    realExample:
      "The founder of ScamGuards was scammed while buying in a WhatsApp group called \"COZ on One Piece\" — a community for One Piece TCG collectors. The group claimed to filter out scammers, but a seller collected payment and never delivered. This experience directly led to the creation of ScamGuards.",
    sources: [
      { label: "CCID E-commerce Fraud Statistics 2024", url: "https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/" },
      { label: "MCMC Scam Content Removal Report", url: "https://freemalaysiatoday.com/category/nation/2024/09/03/32600-fraud-scam-posts-removed-by-mcmc-this-year" },
    ],
    faqs: [
      {
        question: "Are WhatsApp TCG groups safe to buy from?",
        answer:
          "Not necessarily. Most WhatsApp groups have no real verification process for sellers, even if they claim to. Always check the seller's bank account or phone number on ScamGuards before transferring money.",
      },
      {
        question: "How do I verify if a card is real before buying?",
        answer:
          "Ask for a video showing the card's texture, holographic elements, and the back pattern. Request the seller write your name on paper next to the card. Compare with verified images from official TCG databases.",
      },
      {
        question: "I bought fake cards. Can I get a refund?",
        answer:
          "If you paid through a platform with buyer protection, file a dispute immediately. If you used bank transfer, report to your bank and file a police report. Report the seller on ScamGuards to warn others.",
      },
    ],
    keywords: [
      "tcg scam malaysia",
      "one piece card scam",
      "pokemon card scam malaysia",
      "fake tcg seller",
      "whatsapp group scam cards",
      "carousell card scammer",
      "collectibles scam malaysia",
    ],
  },
  {
    slug: "love-scam",
    title: "Love Scam",
    metaTitle: "Love Scam Malaysia - How Romance Scams Work & How to Report | ScamGuards",
    metaDescription:
      "Love scams are the #1 scam in Malaysia by money lost. Learn how romance scammers operate, the warning signs, and how to check suspicious profiles. Free AI scam checker.",
    heroEmoji: "💔",
    tldr: "A love scam is when a scammer builds a fake romantic relationship with you online, then asks for money. In Malaysia, 978 love scam cases were reported in 2024 with RM43.7 million in losses — but the real figure is likely much higher because many victims don't report due to shame. The average loss per victim is among the highest of any scam type.",
    stats: "978 reported cases in 2024 · RM43.7 million lost · Average loss ~RM44,700 per victim (Source: CCID/PDRM)",
    what: "A love scam (romance scam) is when a scammer creates a fake online identity to build a romantic relationship with you. Over weeks or months, they gain your trust and affection — then start asking for money. They may claim to need funds for emergencies, travel to visit you, medical bills, or business opportunities. Victims often lose hundreds of thousands of ringgit.",
    howItWorks: [
      "Scammer contacts you on dating apps, Facebook, Instagram, or even WhatsApp with an attractive profile",
      "They build an emotional connection over days or weeks with constant messaging and video calls (sometimes using deepfakes)",
      "They create urgency with a sob story — medical emergency, stuck overseas, business gone wrong",
      "They ask for money via bank transfer, cryptocurrency, or gift cards",
      "After getting money, they either ask for more or disappear completely",
    ],
    redFlags: [
      "They claim to be overseas (military, oil rig worker, doctor abroad) and can never meet in person",
      "The relationship moves unusually fast with intense emotional declarations",
      "They always have excuses for why they can't video call (or the video quality is suspiciously poor)",
      "They start asking for money within weeks of connecting — no matter how small at first",
      "Their social media profile has very few posts, few friends, or was recently created",
      "They claim to want to visit you but always have a \"problem\" requiring money first",
    ],
    whatToDo: [
      "Stop all communication if you suspect a love scam — the person you love doesn't exist",
      "Do a reverse image search on their profile photos to check if they're stolen",
      "Check their phone number or email on ScamGuards",
      "Talk to family or friends about the relationship — scammers isolate you on purpose",
      "Report to police and your bank if you've already sent money",
      "Report the scammer's details on ScamGuards to protect others",
    ],
    realExample:
      "A woman in KL lost RM1.2 million to a man she met on a dating app who claimed to be a British engineer working on an oil rig. Over 8 months, he asked for money for \"medical bills\", \"customs fees\" for a package, and an \"investment opportunity\". He was actually part of a scam syndicate operating from Southeast Asia.",
    sources: [
      { label: "CCID Love Scam Statistics 2024", url: "https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/" },
      { label: "PDRM Online Scam Syndicate Busts", url: "https://www.malaymail.com/news/malaysia/2024/12/17/police-bust-up-40-groups-running-online-scams-from-malaysia-collar-426-suspects/160241" },
    ],
    faqs: [
      {
        question: "How do I know if it's a love scam?",
        answer:
          "The biggest red flag: they ask for money. Real romantic partners don't ask strangers they've never met for bank transfers. If someone you've never met in person asks for money for any reason, it is almost certainly a scam.",
      },
      {
        question: "Can scammers use video calls?",
        answer:
          "Yes. Some scammers use pre-recorded videos or deepfake technology. If the video quality is always poor, they avoid showing specific things you ask for, or the call always \"drops\", be suspicious.",
      },
      {
        question: "I'm embarrassed. Should I still report?",
        answer:
          "Absolutely. Love scam victims are not stupid — these scammers are professionals who manipulate emotions for a living. Reporting helps police track syndicates and protects future victims. You can report anonymously on ScamGuards.",
      },
    ],
    keywords: [
      "love scam malaysia",
      "romance scam malaysia",
      "dating scam",
      "penipuan cinta",
      "love scam whatsapp",
      "how to spot love scam",
    ],
  },
  {
    slug: "investment-scam",
    title: "Investment Scam",
    metaTitle:
      "Investment Scam Malaysia - Forex, Crypto & Ponzi Schemes | ScamGuards",
    metaDescription:
      "Investment scams in Malaysia promise guaranteed returns through forex, crypto, or gold schemes. Learn to spot fake investment platforms and report scammers. Free AI checker.",
    heroEmoji: "📈",
    tldr: "Investment scams promise guaranteed returns through forex, crypto, or Ponzi schemes. They are the deadliest scam type in Malaysia by money lost — 9,296 cases with RM1.37 billion in losses in 2024. That's more money lost than all other scam types combined. If someone promises guaranteed returns, it's a scam.",
    stats: "9,296 cases in 2024 · RM1.37 billion lost · Highest financial loss of any scam type in Malaysia (Source: CCID/PDRM)",
    what: "Investment scams promise unrealistically high returns with little or no risk. In Malaysia, these commonly take the form of forex trading schemes, cryptocurrency platforms, gold investment programs, or Ponzi/pyramid structures. Scammers create professional-looking websites and apps, show fake profit screenshots, and use \"successful\" investors (often paid actors) to recruit victims.",
    howItWorks: [
      "You see an ad on social media or get invited by a friend to an \"exclusive\" investment opportunity",
      "The platform shows impressive returns (often 10-30% monthly) and has a professional-looking interface",
      "You start with a small amount and see \"profits\" in your dashboard — sometimes they even let you withdraw small amounts to build trust",
      "You invest more, often bringing in family and friends (pyramid recruitment bonuses)",
      "When you try to withdraw a large amount, the platform demands \"tax payments\" or \"processing fees\" — then eventually shuts down",
    ],
    redFlags: [
      "Guaranteed returns — no legitimate investment can guarantee profit",
      "Returns that are way above market rates (anything over 1-2% monthly is suspect)",
      "Pressure to recruit friends and family for bonuses (pyramid structure)",
      "The company is not registered with Securities Commission Malaysia (SC) or Bank Negara",
      "You can't find the company on SC's investor alert list or BNM's financial consumer alert",
      "Difficulty withdrawing funds or being asked to pay \"fees\" to unlock withdrawals",
    ],
    whatToDo: [
      "Check the company against SC Malaysia's investor alert list at www.sc.com.my",
      "Check the person's details on ScamGuards before investing",
      "Never invest money you can't afford to lose based on social media promises",
      "Report to Securities Commission Malaysia if the scheme involves securities",
      "Report to BNM if it involves banking or money lending",
      "Report the scammer's details on ScamGuards to warn others",
    ],
    realExample:
      "A crypto investment platform promoted heavily on Malaysian TikTok and Instagram promised 15% monthly returns. Thousands invested after seeing \"proof\" of withdrawals from early investors. After collecting over RM50 million, the platform suddenly required a \"30% tax deposit\" to withdraw — then the website went offline and the operators vanished.",
    sources: [
      { label: "Securities Commission Malaysia Investor Alert", url: "https://www.sc.com.my/regulation/investor-alerts" },
      { label: "BNM Financial Consumer Alert", url: "https://www.bnm.gov.my/consumer-alert" },
      { label: "CCID Investment Fraud Statistics", url: "https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/" },
    ],
    faqs: [
      {
        question: "How do I check if an investment company is legitimate?",
        answer:
          "Check the Securities Commission Malaysia website (sc.com.my) and Bank Negara Malaysia (bnm.gov.my) for licensed entities. Also check their investor alert lists for known scam companies. If the company isn't registered, don't invest.",
      },
      {
        question: "My friend made money from it, so it must be real?",
        answer:
          "This is exactly how Ponzi schemes work. Early investors get paid using money from new investors to build credibility. When recruitment slows, the scheme collapses and most people lose everything. Your friend's profit came from someone else's loss.",
      },
      {
        question: "I invested in a scam. Can I recover my money?",
        answer:
          "File a police report immediately. Report to SC Malaysia or BNM. If the amount is significant, consult a lawyer. Chances of recovery are low but acting quickly improves them. Document everything — screenshots, transactions, communications.",
      },
    ],
    keywords: [
      "investment scam malaysia",
      "forex scam malaysia",
      "crypto scam malaysia",
      "ponzi scheme malaysia",
      "penipuan pelaburan",
      "fake investment platform",
      "scam pelaburan forex",
    ],
  },
  {
    slug: "ecommerce-scam",
    title: "E-commerce Scam",
    metaTitle:
      "E-commerce Scam Malaysia - Shopee, Carousell & Online Shopping Fraud | ScamGuards",
    metaDescription:
      "Avoid online shopping scams on Shopee, Carousell, Facebook Marketplace & Lazada in Malaysia. Learn to spot fake sellers, check before you buy. Free AI scam checker.",
    heroEmoji: "🛒",
    tldr: "E-commerce scams are fake sellers on Shopee, Carousell, Facebook Marketplace, and Lazada who take your money and never deliver. In 2024, Malaysia recorded 14,881 e-commerce fraud cases with RM123.7 million lost. The number one rule: never pay outside the platform's payment protection system.",
    stats: "14,881 cases in 2024 · RM123.7 million lost · Second most common scam type by case count (Source: CCID/PDRM)",
    what: "E-commerce scams involve fake sellers on platforms like Shopee, Lazada, Carousell, Facebook Marketplace, and Mudah. They list products (often electronics, branded goods, or concert tickets) at attractive prices, collect payment, and either send nothing, send a fake/broken item, or send a completely different product.",
    howItWorks: [
      "Scammer creates a listing for a popular product at a price just below market (not suspiciously cheap)",
      "They may have fake reviews or a recently created account with some manufactured credibility",
      "They convince you to pay outside the platform's protection system (direct bank transfer, WhatsApp deal)",
      "After payment, they either ghost you, send a fake item, or send an empty box",
      "If you paid through the platform, they may send a fake tracking number to trigger auto-release of funds",
    ],
    redFlags: [
      "Seller asks you to pay outside the platform (direct bank transfer, WhatsApp)",
      "Price is significantly lower than all other sellers for the same product",
      "Seller account is very new with few or no genuine reviews",
      "Seller pushes urgency: \"last piece\", \"someone else is about to buy\"",
      "Product photos look like stock images or are stolen from other listings",
      "Seller can't provide specific details about the product when asked",
    ],
    whatToDo: [
      "Always pay through the platform's built-in payment system (never direct transfer)",
      "Check the seller's phone number or bank account on ScamGuards before paying",
      "Read reviews carefully — look for patterns in fake reviews (similar language, posted on same dates)",
      "Use COD (Cash on Delivery) when available, especially for high-value items",
      "File a dispute through the platform if you receive a wrong or fake item",
      "Report the seller on ScamGuards to warn others",
    ],
    realExample:
      "A university student in Johor Bahru found a PS5 on Carousell for RM1,800 (normal price RM2,500). The seller convinced him to pay via bank transfer \"to avoid platform fees\". After transferring the money, the seller blocked him. The same seller had scammed 12 other people using different names but the same bank account.",
    sources: [
      { label: "CCID E-commerce Fraud Data 2024", url: "https://www.scoop.my/news/276554/malaysia-suffers-rm2-7bil-losses-from-online-scams-in-11-months-reveals-ccid/" },
      { label: "MCMC Removed 66,507 Scam Posts in 2024", url: "https://freemalaysiatoday.com/category/nation/2024/09/03/32600-fraud-scam-posts-removed-by-mcmc-this-year" },
    ],
    faqs: [
      {
        question: "Is it safe to buy on Shopee and Lazada?",
        answer:
          "Generally yes, IF you pay through the platform and don't transfer money directly. Both platforms have buyer protection. The risk increases when sellers convince you to deal outside the platform.",
      },
      {
        question: "How do I get a refund from Shopee/Lazada?",
        answer:
          "Open a dispute through the platform's resolution center before the auto-confirm period ends. Provide evidence (photos of wrong item, chat screenshots). If the seller sent a fake tracking number, the platform should side with you.",
      },
      {
        question: "Someone is using my photos to scam people. What do I do?",
        answer:
          "Report the fake listing to the platform immediately. Take screenshots as evidence. File a police report if someone is impersonating you. Report on ScamGuards so people checking that account are warned.",
      },
    ],
    keywords: [
      "shopee scam malaysia",
      "carousell scam malaysia",
      "lazada scam",
      "online shopping scam",
      "facebook marketplace scam malaysia",
      "penipuan beli online",
      "mudah scam",
    ],
  },
  {
    slug: "gold-silver-scam",
    title: "Gold & Silver Investment Scam",
    metaTitle:
      "Gold & Silver Scam Malaysia - Fake Precious Metals Dealers | ScamGuards",
    metaDescription:
      "Beware of gold and silver investment scams in Malaysia. Fake dealers promise below-market prices or guaranteed buy-back. Check sellers before investing. Free AI checker.",
    heroEmoji: "🥇",
    tldr: "Gold and silver scams in Malaysia exploit cultural trust in precious metals. Fake dealers offer below-market prices or guaranteed buy-back schemes, then vanish with your money. Gold investment scams fall under the RM1.37 billion lost to non-existent investment schemes in Malaysia in 2024. Only buy from BNM-registered dealers.",
    stats: "Part of RM1.37 billion in investment fraud losses in 2024 · Only buy from Bank Negara-registered dealers (Source: BNM, CCID/PDRM)",
    what: "Gold and silver scams in Malaysia exploit the cultural value of precious metals. Scammers create fake dealerships, offer gold at below-market prices, run gold savings schemes with guaranteed returns, or sell gold-plated items as solid gold. Some operate as legitimate-looking businesses for months before disappearing with investors' money.",
    howItWorks: [
      "Company offers gold at prices 10-20% below the market rate, claiming they buy \"direct from mines\"",
      "They may show a physical shop, office, or impressive online presence to look legitimate",
      "Gold savings accounts promise monthly returns of 2-5% on your gold \"investment\"",
      "They pay returns initially using new investors' money (Ponzi structure)",
      "When enough money is collected, the company vanishes — office emptied overnight",
    ],
    redFlags: [
      "Gold prices significantly below LBMA or local market rates — if it's too cheap, it's not real gold",
      "Guaranteed monthly returns on gold investment — gold prices fluctuate, returns can't be guaranteed",
      "Company not registered with Bank Negara or Ministry of Domestic Trade",
      "High-pressure sales tactics and \"limited time\" offers",
      "They don't provide assay certificates or proper documentation for the gold",
      "You can't take physical delivery of your gold — it's always \"stored safely\" for you",
    ],
    whatToDo: [
      "Only buy from dealers registered with the Ministry of Domestic Trade and Consumer Affairs",
      "Verify gold purity with independent assay testing",
      "Check the dealer's details on ScamGuards before transacting",
      "Check BNM's consumer alert list for known fraudulent gold schemes",
      "If investing, always take physical delivery — never leave gold with a non-bank entity",
      "Report suspicious dealers on ScamGuards to protect other buyers",
    ],
    realExample:
      "A gold investment company in Kuala Lumpur offered gold savings accounts with a guaranteed 3% monthly return and a buy-back guarantee. Over 2 years, they collected RM80 million from hundreds of investors. The company suddenly closed all branches and the directors fled. Victims who tried to redeem their gold found their certificates were worthless.",
    sources: [
      { label: "BNM Financial Consumer Alert List", url: "https://www.bnm.gov.my/consumer-alert" },
      { label: "SC Malaysia Investor Alert", url: "https://www.sc.com.my/regulation/investor-alerts" },
      { label: "Ministry of Domestic Trade & Consumer Affairs", url: "https://www.kpdnhep.gov.my/" },
    ],
    faqs: [
      {
        question: "How do I know if gold is real?",
        answer:
          "Genuine gold comes with assay certificates, hallmark stamps (916, 999, etc.), and can be tested by any independent goldsmith. Be suspicious if the seller refuses independent testing or doesn't provide documentation.",
      },
      {
        question: "Are gold savings accounts safe?",
        answer:
          "Only gold savings accounts with licensed banks (Maybank, CIMB, Public Bank, etc.) are safe. Any non-bank entity offering gold savings with guaranteed returns is very likely a scam.",
      },
      {
        question: "I invested in a gold scheme that closed. What do I do?",
        answer:
          "File a police report immediately. Report to Bank Negara and the Ministry of Domestic Trade. Join other victims to file a class action if possible. Document all transactions and communications.",
      },
    ],
    keywords: [
      "gold scam malaysia",
      "silver scam malaysia",
      "gold investment scam",
      "fake gold dealer",
      "penipuan emas",
      "gold savings scam malaysia",
      "precious metals fraud",
    ],
  },
];

export function getScamBySlug(slug: string): ScamType | undefined {
  return SCAM_TYPES.find((s) => s.slug === slug);
}

export function getAllScamSlugs(): string[] {
  return SCAM_TYPES.map((s) => s.slug);
}

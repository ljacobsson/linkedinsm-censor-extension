(function (root) {
  "use strict";

  const categories = {
    announcement: {
      patterns: [
        "excited", "excited for what(?:'s|’s| is) ahead",
        "I(?:'m| am) (?:thrilled|delighted|excited|honored|humbled|proud) to (?:announce|share)",
        "(?:thrilled|delighted|excited|honored|humbled|proud) to (?:announce|share)",
        "I have some (?:exciting|personal|bittersweet) news",
        "the secret is finally out", "big announcement", "career update", "personal update",
        "I(?:'m| am) beyond (?:excited|grateful)", "dreams? do come true"
      ],
      funny: ["I have released the ceremonial pigeons", "the office gong has been struck", "my mum says I may announce", "the prophecy was oddly specific", "please hold your tiny applause"],
      spicy: ["I am fucking delighted to announce", "sound the damn trumpets", "here comes my big-ass announcement", "the corporate bullshit cannon has fired", "I can finally spill this shit"]
    },
    journey: {
      patterns: [
        "journeys?", "what a journey", "this journey has", "my (?:incredible|amazing) journey", "the next chapter",
        "a new chapter", "closing this chapter", "step outside (?:of )?my comfort zone", "trust the process",
        "embrac(?:e|es|ed|ing)", "the road (?:less traveled|ahead)", "growth mindset", "a leap of faith",
        "onwards and upwards", "here(?:'s| is) to new beginnings"
      ],
      funny: ["what a bewildering little side quest", "the next downloadable content pack", "a journey mainly involving snacks", "my character-development montage", "a brisk walk through several spreadsheets"],
      spicy: ["what a goddamn journey", "this absolute bastard of a side quest", "the next fucking chapter", "a long walk through corporate hell", "my bullshit character arc"]
    },
    gratitude: {
      patterns: [
        "grateful", "grateful for the journey",
        "I(?:'m| am) (?:so |truly |incredibly )?grateful", "feeling (?:so |truly |incredibly )?(?:grateful|blessed)",
        "humbled and honored", "truly humbled", "deeply humbled", "honored and privileged", "forever grateful",
        "gratitude post", "pinch[- ]me moment", "couldn(?:'|’)t have done it without", "thank you to (?:my|the) (?:amazing|incredible) team",
        "surrounded by (?:incredible|amazing|talented) people"
      ],
      funny: [
        "I'm emotionally indebted to the office kettle", "I'm humbled to approximately sea level",
        "I'm grateful beyond the recommended dosage", "I'm blessed by the Wi-Fi router",
        "I'm thankful to everyone who tolerated the group chat", "I'm suspiciously relieved",
        "I'm delighted and only slightly confused", "I'm grateful enough to write a normal sentence",
        "I'm thankful from the bottom of my spreadsheet", "I'm feeling aggressively fortunate",
        "I'm relieved the ceremonial ordeal is over", "I'm happier than the office snack budget",
        "I'm thankful, according to several reliable witnesses", "I'm blessed by competent calendar management",
        "I'm genuinely chuffed", "I'm full of gratitude and approximately three coffees",
        "I'm lucky and trying not to make it weird", "I'm pleased as a well-organized pigeon",
        "I'm grateful without being spiritually transformed", "I'm relieved beyond reasonable expectations"
      ],
      spicy: [
        "I'm fucking relieved", "I'm genuinely fucking thankful", "I'm so fucking grateful",
        "I'm incredibly fucking lucky", "I'm relieved as fuck", "I'm fucking glad",
        "I'm honestly fucking delighted", "I'm grateful as shit", "I'm absurdly fucking thankful",
        "I'm seriously fucking fortunate", "I'm unbelievably fucking relieved", "I'm fucking grateful",
        "I'm thankful as fuck", "I'm so fucking pleased", "I'm fucking thrilled it worked out",
        "I'm grateful to these magnificent motherfuckers", "I'm fucking lucky to be here",
        "I'm relieved this whole clusterfuck worked", "I'm genuinely grateful, for fuck's sake",
        "I'm fucking delighted and not remotely humble", "I'm thankful beyond all fucking reason",
        "I'm lucky as fuck", "I'm so fucking glad", "I'm deeply fucking appreciative",
        "I'm one relieved motherfucker", "I'm grateful without the corporate bullshit"
      ]
    },
    lesson: {
      patterns: [
        "here(?:'s| is) what I learned", "(?:three|3|five|5|seven|7|ten|10) (?:things|lessons) I learned",
        "my biggest takeaway", "key takeaways?", "lessons? learned", "let that sink in", "read that again",
        "you need to hear this", "a friendly reminder", "reminder: you do not", "failure is not the opposite of success",
        "success isn(?:'|’)t", "consistency is key", "progress over perfection", "done is better than perfect",
        "your network is your net worth", "if I can do it, so can you"
      ],
      funny: ["here is what the raccoons taught me", "my least aerodynamic takeaway", "please let that gently float away", "read that again if the first time was too peaceful", "the lesson was probably soup"],
      spicy: ["here is what I fucking learned", "my biggest goddamn takeaway", "let that shit sink in", "read the damn thing again", "the lesson kicked my ass"]
    },
    hustle: {
      patterns: [
        "rise and grind", "hustle harder", "never stop hustling", "work hard,? play hard", "sleep when you(?:'re| are) dead",
        "no days off", "make it happen", "dream big", "stay hungry", "stay humble", "keep pushing", "keep showing up",
        "outwork everyone", "go the extra mile", "give 110%", "(?:Monday|Friday) motivation", "early bird gets the worm",
        "your only limit is you", "don(?:'|’)t stop until you(?:'re| are) proud"
      ],
      funny: ["rise and locate your trousers", "hustle at a medically sensible pace", "stay peckish and reasonably grounded", "give a contractually compliant 83%", "the early bird can have the worm"],
      spicy: ["rise and fucking grind", "hustle your ass off", "no goddamn days off", "keep pushing that shit uphill", "give a deeply unnecessary 110 fucking percent"]
    },
    corporate: {
      patterns: [
        "thought leader", "game[- ]changer", "change the game", "move the needle", "circle back", "lean in", "double[- ]click on",
        "low[- ]hanging fruit", "synergy", "best[- ]in[- ]class", "world[- ]class", "disruptive innovation", "paradigm shift",
        "value[- ]add", "at the end of the day", "think outside the box", "boil the ocean", "north star", "secret sauce",
        "laser[- ]focused", "hypergrowth", "10x", "rockstar", "ninja", "guru", "ecosystem", "unlock (?:value|potential)",
        "mission[- ]driven", "customer[- ]obsessed", "results[- ]driven", "fast[- ]paced environment"
      ],
      funny: ["thought casserole", "game-adjacent object", "nudge the decorative needle", "rhombus back", "the fruit nearest the carpet", "premium artisanal synergy", "boil one tasteful puddle", "our north-ish star", "the publicly available sauce", "unlock the stationery cupboard"],
      spicy: ["bullshit oracle", "fucking game-changer", "move the damn needle", "circle the hell back", "low-hanging bullshit", "synergy my ass", "boil the goddamn ocean", "our bastard north star", "the secret fucking sauce", "unlock some actual shit"]
    },
    authenticity: {
      patterns: [
        "authentic self", "show up authentically", "vulnerable post", "this is hard to share", "I almost didn(?:'|’)t post this",
        "real talk", "no one talks about", "unpopular opinion", "controversial opinion", "hot take", "normalize (?:talking about|saying)",
        "a little vulnerable", "behind the scenes", "the highlight reel", "imposter syndrome", "raw and unfiltered"
      ],
      funny: ["my factory-default goblin self", "a post marinated in vulnerability", "I nearly told this to my diary", "lukewarm take from the cupboard", "raw, unfiltered, and lightly carbonated"],
      spicy: ["my authentic fucking self", "this shit is hard to share", "I almost did not post this damn thing", "real fucking talk", "a hot take nobody asked for"]
    },
    engagement: {
      patterns: [
        "agree\\?", "thoughts\\?", "what do you think\\?", "let me know in the comments", "drop a comment below",
        "comment below", "share your thoughts", "I(?:'d| would) love to hear", "who(?:'s| is) with me\\?", "can you relate\\?",
        "tag someone who", "repost if you agree", "like if you agree", "follow me for more", "save this post",
        "what would you add\\?", "am I missing anything\\?"
      ],
      funny: ["please validate me below?", "any noises from the congregation?", "deposit one opinion in the comments", "tag someone who owes you lunch", "repost if the algorithm has taken your family"],
      spicy: ["agree, damn it?", "what the hell do you think?", "drop your shit in the comments", "who the fuck is with me?", "feed the goddamn algorithm"]
    },
    outreach: {
      patterns: [
        "avenues?", "collaborat(?:e|es|ed|ing|ion)", "connect with you", "explore avenues?",
        "catch up", "compare notes", "pick your brain", "meaningful conversation", "mutually beneficial"
      ],
      funny: ["inspect some suspicious corridors", "schedule a ceremonial coffee", "put two calendars in a room together", "exchange professionally formatted noises", "form a temporary spreadsheet alliance"],
      spicy: ["see which doors aren't fucking painted on", "survive a goddamn coffee chat", "hold a meeting about having another meeting", "swap some highly billable bullshit", "form a short-lived corporate clusterfuck"]
    }
  };

  // Kept separately so the core, high-confidence classics above stay easy to scan.
  // These are still grouped by tone, allowing replacements to preserve the rough grammar.
  const additionalPatterns = {
    announcement: [
      "excited to (?:start|join|begin)", "happy to (?:announce|share)", "pleased to (?:announce|share)",
      "over the moon to", "absolutely thrilled", "incredibly excited", "a long time coming",
      "I can finally announce", "I can finally share", "it(?:'s| is) official", "officially official",
      "some news to share", "life update", "job update", "new role alert", "milestone unlocked",
      "proud moment", "watch this space", "more to come", "stay tuned", "the wait is over",
      "I said yes to", "I(?:'ve| have) joined", "starting a new position", "first day at"
    ],
    journey: [
      "part of the journey", "along the way", "how far I(?:'ve| have) come", "where it all began",
      "full[- ]circle moment", "chapter of my (?:life|career)", "turning the page", "new horizons",
      "comfort zone", "take the leap", "took the leap", "leap into the unknown", "path to success",
      "path forward", "road to success", "rollercoaster ride", "ups and downs", "twists and turns",
      "every step of the way", "one step at a time", "keep moving forward", "forward momentum",
      "beautiful journey", "transformative journey", "incredible ride", "wild ride", "next adventure",
      "new adventure", "follow your dreams", "chasing my dreams", "living the dream"
    ],
    gratitude: [
      "so much gratitude", "heart full of gratitude", "heart is full", "filled with gratitude",
      "counting my blessings", "feeling blessed", "truly blessed", "incredibly blessed", "beyond thankful",
      "so thankful", "immensely grateful", "eternally grateful", "grateful for the opportunity",
      "honored to be", "honoured to be", "an absolute honor", "an absolute honour", "privileged to be",
      "thankful for this opportunity", "thankful for the journey", "thanks to everyone who",
      "special thanks to", "shout[- ]out to my", "would not be possible without", "standing on the shoulders of",
      "incredible support", "unwavering support", "amazing mentors", "incredible mentors", "dream team"
    ],
    lesson: [
      "what I(?:'ve| have) learned", "things I wish I knew", "wish I knew sooner", "hard[- ]earned lesson",
      "valuable lesson", "important lesson", "lesson worth sharing", "take it from me", "hear me out",
      "the truth is", "hard truth", "brutal truth", "truth bomb", "food for thought", "think about that",
      "remember this", "never forget", "repeat after me", "say it louder", "for those in the back",
      "one more time", "bookmark this", "write this down", "the bottom line", "moral of the story",
      "mistakes were made", "failure taught me", "fail forward", "failure is feedback", "feedback is a gift",
      "there is no such thing as failure", "everything happens for a reason", "rejection is redirection"
    ],
    hustle: [
      "grind never stops", "grind mode", "hustle mode", "hustle culture", "always be hustling",
      "put in the work", "do the work", "hard work pays off", "work smarter,? not harder", "stay disciplined",
      "discipline beats motivation", "motivation gets you started", "show up every day", "keep grinding",
      "keep hustling", "keep going", "never give up", "never settle", "refuse to settle", "stay focused",
      "stay committed", "stay consistent", "be relentless", "relentless execution", "execute relentlessly",
      "make every day count", "own the day", "win the day", "seize the day", "chase greatness",
      "build your empire", "bet on yourself", "invest in yourself", "be your own boss", "success leaves clues"
    ],
    corporate: [
      "actionable insights?", "action items?", "alignment", "align on", "aligned around", "bandwidth",
      "blue[- ]sky thinking", "business case", "buy[- ]in", "core competency", "deep dive", "drill down",
      "end[- ]to[- ]end", "game plan", "going forward", "high level", "holistic approach", "impactful",
      "key learnings?", "level up", "learnings", "leverage", "make an impact", "mindshare", "net[- ]net",
      "operational excellence", "optics", "outside the box", "pain points?", "quick win", "reach out",
      "run it up the flagpole", "scalable solution", "seamless experience", "stakeholder management",
      "strategic fit", "table stakes", "take this offline", "touch base", "value proposition", "wheelhouse",
      "win[- ]win", "deliver value", "create value", "drive value", "drive impact", "drive growth",
      "drive innovation", "drive engagement", "drive results", "accelerate growth", "unlock growth",
      "unlock opportunities", "maximize impact", "future[- ]proof", "purpose[- ]driven", "data[- ]driven",
      "people[- ]first", "human[- ]centric", "digital transformation", "transformative solution",
      "single source of truth", "source of truth", "one[- ]stop shop", "white[- ]glove service",
      "robust solution", "bespoke solution", "frictionless", "ideate", "ideation", "innovation journey",
      "thought leadership", "industry leader", "market leader", "category leader", "visionary leader",
      "next[- ]generation", "cutting[- ]edge", "state[- ]of[- ]the[- ]art", "first[- ]of[- ]its[- ]kind",
      "industry[- ]leading", "award[- ]winning", "high[- ]performing", "high[- ]impact", "high[- ]growth"
    ],
    authenticity: [
      "authentic leadership", "lead with authenticity", "bring your whole self", "whole self to work",
      "living my truth", "speak your truth", "own your story", "share my story", "tell my story",
      "getting personal", "personal story", "honest confession", "confession time", "vulnerability is",
      "vulnerability isn(?:'|’)t", "vulnerability takes courage", "courage to be vulnerable",
      "pulling back the curtain", "not everything is", "social media is a highlight reel",
      "what you don(?:'|’)t see", "not going to lie", "I(?:'ll| will) be honest", "honestly speaking",
      "in all honesty", "from the heart", "open and honest", "my lived experience", "my truth"
    ],
    engagement: [
      "do you agree\\?", "agree or disagree\\?", "yes or no\\?", "which one are you\\?",
      "which would you choose\\?", "what(?:'s| is) your take\\?", "what(?:'s| is) your experience\\?",
      "what has worked for you\\?", "how about you\\?", "over to you", "your turn",
      "tell me in the comments", "sound off in the comments", "join the conversation", "start a conversation",
      "let(?:'s| us) discuss", "let(?:'s| us) debate", "curious to hear", "keen to hear",
      "would love your thoughts", "drop your thoughts", "drop your answer", "drop a yes", "drop an emoji",
      "comment yes", "type yes", "raise your hand", "hands up if", "tag a friend", "tag a colleague",
      "send this to someone", "share this with someone", "repost to help", "repost this", "smash that like",
      "hit the follow button", "turn on notifications", "follow for daily", "follow for more insights",
      "save for later", "bookmark for later", "don(?:'|’)t forget to save", "scroll back up"
    ]
  };

  for (const [category, patterns] of Object.entries(additionalPatterns)) {
    categories[category].patterns.push(...patterns);
  }

  Object.assign(categories, {
    leadership: {
      patterns: [
        "servant leadership", "lead by example", "lead from the front", "lead with empathy", "empathetic leadership",
        "people don(?:'|’)t leave companies", "people leave managers", "leaders eat last", "leadership is not a title",
        "leadership isn(?:'|’)t a title", "true leadership", "great leaders", "good leaders", "bad leaders",
        "a leader(?:'s|’s) job", "leaders create leaders", "leaders inspire", "leaders empower", "empower your team",
        "trust your team", "psychological safety", "safe space", "open[- ]door policy", "culture starts at the top",
        "set the tone", "lead with purpose", "lead with kindness", "lead with curiosity", "radical candor",
        "radical transparency", "transparent leadership", "inclusive leadership", "conscious leadership",
        "leadership journey", "leadership lesson", "leadership principles?", "leadership style", "leadership mindset",
        "manager versus leader", "boss versus leader", "be the leader", "future leaders?", "next generation of leaders"
      ],
      funny: ["leadership by interpretive dance", "the captain of this spreadsheet", "a manager wearing an empathy hat", "chief listener to the office fern", "leading bravely toward the coffee machine"],
      spicy: ["actual fucking leadership", "manage without being an asshole", "lead this goddamn team", "another bullshit leadership sermon", "captain of the corporate shitshow"]
    },
    hiring: {
      patterns: [
        "we(?:'re| are) hiring", "I(?:'m| am) hiring", "now hiring", "hiring alert", "job alert", "open role",
        "open position", "exciting opportunity", "amazing opportunity", "unique opportunity", "rare opportunity",
        "join our team", "join my team", "come work with us", "come join us", "know anyone who",
        "tag someone who might", "spread the word", "dream job", "dream role", "ideal candidate",
        "perfect candidate", "culture fit", "culture add", "competitive salary", "competitive compensation",
        "fast[- ]growing team", "dynamic team", "passionate team", "talented team", "work hard and play hard",
        "wear many hats", "hit the ground running", "self[- ]starter", "highly motivated", "detail[- ]oriented",
        "excellent communicator", "rockstar candidate", "candidate experience", "talent pipeline", "war for talent",
        "purple squirrel", "open to work", "actively looking", "seeking new opportunities", "my next opportunity"
      ],
      funny: ["we seek a wizard with dental coverage", "join our moderately supervised circus", "wanted: one employable mammal", "come wear seventeen tasteful hats", "competitive snacks and mysterious duties"],
      spicy: ["we are fucking hiring", "join this beautiful shitshow", "wanted: someone who gets shit done", "another goddamn dream role", "competitive pay, allegedly, and loads of crap"]
    },
    sales: {
      patterns: [
        "crush(?:ed|ing)? (?:my|the|our) quota", "smash(?:ed|ing)? (?:my|the|our) target", "exceed(?:ed|ing)? expectations",
        "record[- ]breaking (?:month|quarter|year)", "record (?:month|quarter|year)", "president(?:'s|’s) club",
        "top performer", "top producer", "sales rockstar", "sales ninja", "revenue growth", "revenue engine",
        "revenue machine", "pipeline generation", "build pipeline", "fill the funnel", "sales funnel",
        "qualified leads?", "warm leads?", "cold outreach", "cold calling", "social selling", "personalized outreach",
        "book more meetings", "close more deals", "closing deals", "close the deal", "always be closing",
        "customer pain", "pain point", "handle objections", "overcome objections", "value[- ]based selling",
        "consultative selling", "sales enablement", "go[- ]to[- ]market", "GTM strategy", "product[- ]market fit",
        "ideal customer profile", "buyer persona", "decision[- ]maker", "economic buyer", "land and expand",
        "win rate", "sales cycle", "quota attainment", "seven[- ]figure deal", "six[- ]figure deal"
      ],
      funny: ["fill the ceremonial sales bucket", "gently befriend the revenue funnel", "close a deal with three raccoons", "qualified leads from the enchanted forest", "achieve product–sandwich fit"],
      spicy: ["crush the fucking quota", "fill this goddamn funnel", "close the damn deal", "another pile of sales bullshit", "make the revenue machine spit out cash"]
    },
    ai: {
      patterns: [
        "AI is changing everything", "AI changes everything", "AI will change everything", "AI won(?:'|’)t replace you",
        "AI will replace", "people who use AI", "powered by AI", "AI[- ]powered", "generative AI", "GenAI",
        "AI revolution", "AI transformation", "AI journey", "AI strategy", "AI adoption", "AI readiness",
        "AI maturity", "AI native", "AI[- ]first", "responsible AI", "ethical AI", "democratize AI",
        "future of AI", "future of work", "age of AI", "era of AI", "AI agents?", "agentic AI",
        "co[- ]pilot", "copilot", "prompt engineering", "prompt engineer", "mastering ChatGPT", "ChatGPT hack",
        "ChatGPT changed", "large language models?", "LLMs?", "machine learning model", "neural network",
        "human in the loop", "augment human", "human[- ]AI collaboration", "supercharge productivity",
        "10x your productivity", "AI use case", "AI workflow", "automate your workflow", "AI automation",
        "AI isn(?:'|’)t hype", "AI bubble", "AI hype", "AI disruption", "AI innovation"
      ],
      funny: ["a haunted autocomplete is changing everything", "powered by several warm calculators", "the age of asking a robot nicely", "our agentic office toaster", "human–spreadsheet collaboration"],
      spicy: ["AI is changing every fucking thing", "another goddamn AI revolution", "powered by statistical bullshit", "the fucking robots are coming", "prompt-engineer this shit"]
    },
    productivity: {
      patterns: [
        "productivity hack", "life hack", "game[- ]changing tip", "morning routine", "daily routine",
        "five a\.m\. club", "5 ?AM club", "wake up at five", "win the morning", "miracle morning",
        "time blocking", "deep work", "focus time", "flow state", "second brain", "digital brain",
        "inbox zero", "zero inbox", "calendar audit", "energy management", "manage your energy",
        "not your time", "work[- ]life balance", "work[- ]life integration", "batch your tasks", "task batching",
        "eat the frog", "two[- ]minute rule", "Pomodoro technique", "Pareto principle", "80\/20 rule",
        "atomic habits", "habit stacking", "systems over goals", "goals without systems", "set clear goals",
        "SMART goals", "morning pages", "daily affirmations", "dopamine detox", "digital detox",
        "protect your time", "protect your calendar", "say no more", "busy is not productive", "work smarter",
        "productivity system", "optimize your day", "maximize productivity", "peak performance"
      ],
      funny: ["my eleven-step pre-coffee ritual", "achieve inbox approximately twelve", "eat the metaphorical crumpet", "enter a flow state near the bins", "optimize the day until it files a complaint"],
      spicy: ["another fucking productivity hack", "wake up at five for some goddamn reason", "eat the damn frog", "protect your fucking calendar", "optimize the living shit out of Tuesday"]
    },
    culture: {
      patterns: [
        "company culture", "workplace culture", "culture is everything", "culture eats strategy", "culture of innovation",
        "culture of excellence", "winning culture", "high[- ]performance culture", "toxic culture", "toxic workplace",
        "employee experience", "employee engagement", "employee wellbeing", "employee well[- ]being", "people strategy",
        "people are our greatest asset", "our people are", "put people first", "people[- ]centric", "human[- ]first",
        "bring your best self", "best place to work", "great place to work", "employer of choice", "employer brand",
        "employee value proposition", "sense of belonging", "belonging at work", "diversity and inclusion",
        "diversity,? equity,? and inclusion", "DEI journey", "inclusive culture", "remote culture", "hybrid work",
        "return to office", "RTO mandate", "future of the workplace", "new normal", "ways of working",
        "flexible working", "flexibility is key", "work from anywhere", "distributed team", "asynchronous work",
        "team bonding", "team building", "offsite", "company retreat", "pizza party"
      ],
      funny: ["culture eats a small breakfast", "our people are mostly people", "a strong sense of belonging near the printer", "the future of wearing trousers at home", "team bonding through mandatory whimsy"],
      spicy: ["culture eats strategy for fucking breakfast", "this toxic corporate hellscape", "people are not goddamn assets", "another mandatory-fun shitshow", "return your ass to the office"]
    },
    creator: {
      patterns: [
        "I posted every day", "days? of posting", "building in public", "learning in public", "create in public",
        "content creator", "creator economy", "personal brand", "build your personal brand", "grow your audience",
        "build an audience", "audience growth", "content strategy", "content calendar", "content pillars?",
        "content is king", "document,? don(?:'|’)t create", "one post changed", "this post got",
        "million impressions", "thousand impressions", "viral post", "went viral", "go viral", "viral formula",
        "hook your audience", "write a better hook", "the first line", "stop the scroll", "scroll[- ]stopping",
        "LinkedIn algorithm", "beat the algorithm", "the algorithm rewards", "algorithm loves", "creator mode",
        "ghostwriter", "thought leadership content", "build authority", "establish authority", "become known for",
        "niche down", "find your niche", "content flywheel", "engagement rate", "impressions don(?:'|’)t matter",
        "followers don(?:'|’)t matter", "vanity metrics", "consistency compounds", "post consistently"
      ],
      funny: ["building loudly beside the public bins", "my personal brand has escaped containment", "content is a minor regional duke", "stop the scroll with a traffic cone", "the algorithm requests another sacrifice"],
      spicy: ["building this shit in public", "my fucking personal brand", "content is the goddamn king apparently", "stop the damn scroll", "feed the bastard algorithm again"]
    },
    sanitized_profanity: {
      patterns: ["damn", "goddamn", "darn", "heck", "frick", "fricking", "freaking", "bloody"],
      funny: ["corporate-approved expletive", "a swear word with training wheels", "an HR-safe outburst", "a politely upholstered curse", "the profanity equivalent of decaf"],
      spicy: ["fuck", "fucking", "motherfucking", "shit", "bullshit"]
    },
    opportunity: {
      patterns: ["opportunit(?:y|ies)"],
      funny: ["opening in the space-time continuum", "professionally gift-wrapped possibility", "calendar-approved opening", "side quest wearing a tie", "door somebody left suspiciously ajar"],
      spicy: ["fucking opening", "motherfucking chance", "bullshit-shaped possibility", "high-risk clusterfuck", "chance to do even more shit"]
    },
    destination: {
      patterns: ["destinations?"],
      funny: ["pin on the cosmic map", "place the satnav invented", "end of this scenic side quest", "somewhere with acceptable snacks", "professionally selected endpoint"],
      spicy: ["fucking endpoint", "place we dragged our asses to", "final stop in this shitshow", "motherfucking location", "somewhere the hell away from here"]
    },
    growth: {
      patterns: ["growth"],
      funny: ["upward chart wiggle", "professionally measured expansion", "spreadsheet photosynthesis", "metric inflation", "numbers becoming emotionally larger"],
      spicy: ["fucking expansion", "bullshit metric inflation", "motherfucking upward movement", "numbers getting big as shit", "capitalist chart erection"]
    }
  });

  // Noun-only replacements can be inserted wherever "journey" occurs without
  // breaking the surrounding sentence. Combining modifiers and nouns provides
  // substantial variation without storing hundreds of repetitive literals.
  const journeyNounParts = {
    funny: {
      modifiers: [
        "bewildering", "ceremonial", "unexpectedly scenic", "needlessly cinematic",
        "spreadsheet-powered", "office-approved", "algorithm-friendly", "lightly haunted",
        "professionally narrated", "suspiciously inspirational", "snack-fuelled", "PowerPoint-assisted",
        "character-building", "moderately confusing", "strategically meandering", "premium artisanal",
        "emotionally laminated", "stakeholder-aligned", "synergy-adjacent", "calendar-blocked"
      ],
      nouns: [
        "side quest", "detour", "expedition", "pilgrimage", "saga", "odyssey",
        "plot arc", "field trip", "office adventure", "corporate fever dream",
        "character-development montage", "commute through the unknown", "tour of several spreadsheets",
        "wander through the jargon forest", "excursion beyond the comfort zone"
      ]
    },
    spicy: {
      modifiers: [
        "fucking", "motherfucking", "bullshit-filled", "shit-covered", "fucked-up",
        "wild-ass", "clusterfucked", "soul-draining", "corporate-bullshit", "absolute fucking",
        "unhinged fucking", "pain-in-the-ass", "no-fucks-given", "batshit", "shitshow-grade",
        "brain-melting", "ass-backwards", "fuck-around-and-find-out", "utterly fucked", "obnoxious fucking"
      ],
      nouns: [
        "ordeal", "clusterfuck", "shitshow", "side quest", "saga", "odyssey",
        "corporate nightmare", "bullshit expedition", "march through hell", "pain in the ass",
        "crawl through broken glass", "tour of corporate purgatory", "parade of bad decisions",
        "fiasco with milestones", "adventure nobody fucking requested"
      ]
    }
  };

  categories.journey.nouns = Object.fromEntries(
    Object.entries(journeyNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${noun}`))
    ])
  );
  const journeyPlurals = {
    "side quest": "side quests", "detour": "detours", "expedition": "expeditions",
    "pilgrimage": "pilgrimages", "saga": "sagas", "odyssey": "odysseys", "plot arc": "plot arcs",
    "field trip": "field trips", "office adventure": "office adventures",
    "corporate fever dream": "corporate fever dreams", "character-development montage": "character-development montages",
    "commute through the unknown": "commutes through the unknown", "tour of several spreadsheets": "tours of several spreadsheets",
    "wander through the jargon forest": "wanders through the jargon forest",
    "excursion beyond the comfort zone": "excursions beyond the comfort zone", "ordeal": "ordeals",
    "clusterfuck": "clusterfucks", "shitshow": "shitshows", "corporate nightmare": "corporate nightmares",
    "bullshit expedition": "bullshit expeditions", "march through hell": "marches through hell",
    "pain in the ass": "pains in the ass", "crawl through broken glass": "crawls through broken glass",
    "tour of corporate purgatory": "tours of corporate purgatory", "parade of bad decisions": "parades of bad decisions",
    "fiasco with milestones": "fiascos with milestones",
    "adventure nobody fucking requested": "adventures nobody fucking requested"
  };
  categories.journey.pluralNouns = Object.fromEntries(
    Object.entries(journeyNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${journeyPlurals[noun]}`))
    ])
  );

  const opportunityNounParts = {
    funny: {
      modifiers: [
        "suspicious", "gift-wrapped", "calendar-approved", "unexpected", "professionally laminated",
        "algorithm-certified", "moderately promising", "strategically convenient", "mysterious", "office-sanctioned",
        "PowerPoint-compatible", "stakeholder-friendly"
      ],
      nouns: [
        "opening", "possibility", "side quest", "career trapdoor", "door left ajar",
        "plot twist", "invitation to do things", "excuse to update LinkedIn"
      ]
    },
    spicy: {
      modifiers: [
        "fucking", "motherfucking", "bullshit-shaped", "high-risk", "wild-ass", "fucked-up",
        "shit-covered", "no-fucks-given", "career-ending", "soul-draining", "cash-adjacent", "clusterfuck-prone"
      ],
      nouns: [
        "opening", "chance", "possibility", "side quest", "career trapdoor",
        "plot twist", "excuse to do more shit", "invitation to another clusterfuck"
      ]
    }
  };
  const opportunityPlurals = {
    "opening": "openings", "possibility": "possibilities", "side quest": "side quests",
    "career trapdoor": "career trapdoors", "door left ajar": "doors left ajar", "plot twist": "plot twists",
    "invitation to do things": "invitations to do things", "excuse to update LinkedIn": "excuses to update LinkedIn",
    "chance": "chances", "excuse to do more shit": "excuses to do more shit",
    "invitation to another clusterfuck": "invitations to another clusterfuck"
  };
  categories.opportunity.nouns = Object.fromEntries(
    Object.entries(opportunityNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${noun}`))
    ])
  );
  categories.opportunity.pluralNouns = Object.fromEntries(
    Object.entries(opportunityNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${opportunityPlurals[noun]}`))
    ])
  );

  const destinationNounParts = {
    funny: {
      modifiers: [
        "mysterious", "satnav-approved", "postcard-compatible", "unexpected", "suspiciously scenic",
        "snack-adjacent", "professionally selected", "algorithm-recommended", "moderately reachable",
        "calendar-approved", "map-shaped", "ceremonially chosen"
      ],
      nouns: [
        "endpoint", "place on the map", "final stop", "somewhere else", "pin in the atlas",
        "end of the side quest", "location with Wi-Fi", "spot with acceptable snacks"
      ]
    },
    spicy: {
      modifiers: [
        "fucking", "motherfucking", "shitshow-adjacent", "wild-ass", "fucked-up", "ass-backwards",
        "overpriced fucking", "tourist-infested", "middle-of-fucking-nowhere", "bullshit-marketed",
        "pain-in-the-ass", "why-the-fuck-are-we-here"
      ],
      nouns: [
        "endpoint", "place on the map", "final stop", "location", "pin in the fucking atlas",
        "end of this shitshow", "place we dragged our asses to", "spot nobody fucking requested"
      ]
    }
  };
  const destinationPlurals = {
    "endpoint": "endpoints", "place on the map": "places on the map", "final stop": "final stops",
    "somewhere else": "places somewhere else", "pin in the atlas": "pins in the atlas",
    "end of the side quest": "ends of the side quests", "location with Wi-Fi": "locations with Wi-Fi",
    "spot with acceptable snacks": "spots with acceptable snacks", "location": "locations",
    "pin in the fucking atlas": "pins in the fucking atlas", "end of this shitshow": "ends of these shitshows",
    "place we dragged our asses to": "places we dragged our asses to",
    "spot nobody fucking requested": "spots nobody fucking requested"
  };
  categories.destination.nouns = Object.fromEntries(
    Object.entries(destinationNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${noun}`))
    ])
  );
  categories.destination.pluralNouns = Object.fromEntries(
    Object.entries(destinationNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${destinationPlurals[noun]}`))
    ])
  );

  const growthNounParts = {
    funny: {
      modifiers: [
        "suspicious", "spreadsheet-powered", "chart-friendly", "professionally measured",
        "algorithm-approved", "stakeholder-visible", "moderately upward", "PowerPoint-ready",
        "quarter-over-quarter-ish", "strategically reported", "artisanal", "photosynthetic"
      ],
      nouns: [
        "expansion", "increase", "upward wiggle", "metric inflation", "chart movement",
        "number enlargement", "spreadsheet photosynthesis", "line going up"
      ]
    },
    spicy: {
      modifiers: [
        "fucking", "motherfucking", "bullshit", "wild-ass", "fucked-up", "shit-fuelled",
        "capitalist", "metric-obsessed", "no-fucks-given", "obnoxious fucking",
        "spreadsheet-worshipping", "investor-baiting"
      ],
      nouns: [
        "expansion", "increase", "upward lurch", "metric inflation", "chart erection",
        "number bloat", "capitalist photosynthesis", "line going up for fuck's sake"
      ]
    }
  };
  categories.growth.nouns = Object.fromEntries(
    Object.entries(growthNounParts).map(([mode, parts]) => [
      mode,
      parts.modifiers.flatMap(modifier => parts.nouns.map(noun => `${modifier} ${noun}`))
    ])
  );

  const funnyStarts = ["ceremonially", "boldly", "gently", "strategically", "unexpectedly", "heroically", "reluctantly", "professionally", "spiritually", "aggressively", "quietly", "allegedly", "festively", "optimistically", "awkwardly", "methodically", "telepathically", "unfashionably", "magnificently", "suspiciously", "enthusiastically", "accidentally", "collaboratively", "with alarming confidence"];
  const funnyEnds = ["consult the office ferret", "reboot the vibes", "leverage a medium potato", "circle back to the moon", "synergize our sandwiches", "move one decorative needle", "unlock the snack drawer", "disrupt a perfectly good lunch", "scale the beanbag", "pivot toward biscuits", "empower the houseplants", "monetize the weather", "benchmark the custard", "onboard three raccoons", "action the emergency kazoo", "optimize the cardigan", "ideate near the photocopier", "streamline the biscuit pipeline", "democratize the good chair", "innovate the lunch queue", "delegate this to a wizard", "schedule a meeting with destiny", "transform the humble turnip", "deliver actionable confetti"];
  const spicyStarts = ["fucking", "damn well", "boldly fucking", "relentlessly", "bloody well", "hellishly", "unreasonably", "aggressively", "goddamn", "shamelessly", "wildly fucking", "stubbornly", "furiously", "loudly", "brutally", "painfully", "ridiculously", "heroically fucking", "without any damn permission", "like an absolute bastard"];
  const spicyEnds = ["move the damn needle", "get this shit done", "kick the status quo in the ass", "cut through the bullshit", "build the fucking thing", "stop polishing corporate turds", "make some goddamn progress", "tell the algorithm to piss off", "ship this bastard", "fix the whole damn circus", "burn the bullshit playbook", "make the metrics our bitch", "drag this crap over the finish line", "stop the damn meeting", "launch the hell out of it", "turn chaos into useful shit", "break the corporate spell", "get our asses in gear", "throw the jargon in the bin", "do the actual fucking work"];
  const apologies = [
    "(sorry, I have no imagination)", "(I have no soul)", "(my personality is in beta)", "(the algorithm made me say this)",
    "(please forgive this outbreak of LinkedIn)", "(my originality is out of office)", "(I swallowed the corporate phrasebook)",
    "(a chatbot from 2019 wrote this bit)", "(my inner thought leader escaped)", "(I am legally required to sound inspired)",
    "(the synergy has reached my brain)", "(I regret this sentence already)", "(my vocabulary is experiencing hypergrowth)",
    "(the personal brand demands a sacrifice)", "(I have become the content)", "(please circle back when I have a personality)",
    "(my authentic self is unavailable)", "(this sounded better beside a stock photo)", "(I ran out of human words)",
    "(the hustle has damaged me)", "(my imagination is not best-in-class)", "(I am moving the cringe needle)",
    "(I deserve to be muted for this)", "(the corporate fog is dense today)", "(an inspirational mug possessed me)"
  ];

  const expand = (starts, ends) => starts.flatMap(start => ends.map(end => `${start} ${end}`));
  const entries = Object.entries(categories).flatMap(([category, data]) =>
    data.patterns.map(pattern => ({ category, regex: new RegExp(`(?<![\\p{L}\\p{N}])(?:${pattern})(?![\\p{L}\\p{N}])`, "giu") }))
  );

  root.LinkedInismData = {
    categories,
    entries,
    apologies,
    funnyPool: expand(funnyStarts, funnyEnds),
    spicyPool: expand(spicyStarts, spicyEnds)
  };
})(typeof globalThis !== "undefined" ? globalThis : window);

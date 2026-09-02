(function () {
  "use strict";

  const DEFAULTS = { enabled: true, mode: "asterisks", intensity: "balanced" };
  const originalText = new Map();
  let config = DEFAULTS;
  let observer;
  let isEditing = false;
  let counter;
  let warning;
  let bellDisco;
  let warningTimer;
  let bellDiscoTimer;
  let audioContext;
  const composerMatches = new WeakMap();

  const feedSelectors = [
    "main", "[role='main']", ".scaffold-finite-scroll__content",
    ".feed-shared-update-v2", ".occludable-update", "[data-urn^='urn:li:activity']",
    "[data-view-name='feed-full-update']", ".update-components-text",
    ".comments-comment-item__main-content", "article"
  ].join(",");
  const ignored = "script,style,textarea,input,[contenteditable='true'],[role='textbox'],.linkedinism-censor-text,.linkedinism-censor-badge";

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
    return value >>> 0;
  }

  function updateCounter() {
    if (!counter?.isConnected) {
      counter = document.createElement("div");
      counter.id = "linkedinism-censor-counter";
      counter.className = "linkedinism-censor-badge";
      counter.title = "LinkedInisms replaced on this page";
      counter.innerHTML = '<span class="linkedinism-censor-badge__count">0</span><span class="linkedinism-censor-badge__label"> censored</span>';
      document.body.append(counter);
    }
    const count = document.querySelectorAll(".linkedinism-censored").length;
    const countElement = counter.querySelector(".linkedinism-censor-badge__count");
    if (countElement.textContent !== String(count)) countElement.textContent = String(count);
    counter.classList.toggle("linkedinism-censor-badge--off", !config.enabled);
  }

  function isPostComposer(element) {
    if (!element?.matches?.("[contenteditable='true'],[role='textbox']")) return false;
    const hint = [
      element.getAttribute("aria-label"), element.getAttribute("data-placeholder"),
      element.getAttribute("placeholder")
    ].filter(Boolean).join(" ");
    return /post|share|talk about|what do you want/i.test(hint) || Boolean(element.closest([
      ".share-box", ".share-creation-state", ".share-creation-state__text-editor",
      "[data-test-modal-id*='share']", "[data-view-name*='share']",
      ".artdeco-modal", "[role='dialog']", "dialog"
    ].join(","))) || element.matches(".ql-editor, [data-lexical-editor='true'], [aria-multiline='true']");
  }

  function findActiveEditor(event) {
    const selector = "[contenteditable='true'],[role='textbox']";
    const candidates = [];
    if (event?.composedPath) candidates.push(...event.composedPath());
    const selectionNode = document.getSelection()?.anchorNode;
    if (selectionNode) candidates.push(selectionNode.nodeType === Node.ELEMENT_NODE ? selectionNode : selectionNode.parentElement);
    if (document.activeElement) candidates.push(document.activeElement);

    for (const candidate of candidates) {
      if (!(candidate instanceof Element)) continue;
      const editor = candidate.matches(selector) ? candidate : candidate.closest(selector);
      if (editor && isPostComposer(editor)) return editor;
    }
    return null;
  }

  function ringWarningBell() {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return;
    audioContext ??= new AudioEngine();
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    [0, .09, .18, .27, .36, .48, .6, .72].forEach((delay, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index % 2 ? "triangle" : "sine";
      const notes = [784, 1046.5, 880, 1318.5, 987.8, 1174.7, 880, 1396.9];
      oscillator.frequency.setValueAtTime(notes[index], now + delay);
      oscillator.frequency.exponentialRampToValueAtTime(notes[index] * .72, now + delay + 0.34);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.18, now + delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.36);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + 0.37);
    });
  }

  function launchBellDisco() {
    if (!bellDisco?.isConnected) {
      bellDisco = document.createElement("div");
      bellDisco.id = "linkedinism-bell-disco";
      bellDisco.className = "linkedinism-censor-warning";
      bellDisco.setAttribute("aria-hidden", "true");
      for (let index = 0; index < 36; index += 1) {
        const bell = document.createElement("span");
        bell.textContent = index % 5 === 0 ? "🚨" : "🔔";
        bell.style.setProperty("--bell-x", `${(index * 37) % 101}vw`);
        bell.style.setProperty("--bell-delay", `${(index % 12) * -0.11}s`);
        const direction = index % 2 ? 1 : -1;
        bell.style.setProperty("--bell-spin-mid", `${direction * 420}deg`);
        bell.style.setProperty("--bell-spin-end", `${direction * 900}deg`);
        bell.style.setProperty("--bell-size", `${24 + (index * 13) % 38}px`);
        bellDisco.append(bell);
      }
      document.body.append(bellDisco);
    }
    bellDisco.classList.remove("linkedinism-bell-disco--active");
    void bellDisco.offsetWidth;
    bellDisco.classList.add("linkedinism-bell-disco--active");
    clearTimeout(bellDiscoTimer);
    bellDiscoTimer = setTimeout(() => bellDisco?.classList.remove("linkedinism-bell-disco--active"), 2600);
  }

  function showComposerWarning(matches) {
    if (!warning?.isConnected) {
      warning = document.createElement("aside");
      warning.id = "linkedinism-composer-warning";
      warning.className = "linkedinism-censor-warning";
      warning.setAttribute("role", "alert");
      document.body.append(warning);
    }
    const names = [...new Set(matches.map(match => `“${match.match}”`))].slice(0, 3);
    warning.replaceChildren();
    const bells = document.createElement("strong");
    bells.textContent = "🔔 LINKEDINISM ALERT 🔔";
    const detail = document.createElement("span");
    detail.textContent = `${names.join(", ")} — step away from the thought leadership.`;
    warning.append(bells, detail);
    warning.classList.remove("linkedinism-censor-warning--visible");
    void warning.offsetWidth;
    warning.classList.add("linkedinism-censor-warning--visible");
    launchBellDisco();
    clearTimeout(warningTimer);
    warningTimer = setTimeout(() => warning?.classList.remove("linkedinism-censor-warning--visible"), 4200);
  }

  function inspectComposer(event) {
    const editor = findActiveEditor(event);
    if (!config.enabled || !isPostComposer(editor)) return;
    // Count occurrences instead of only remembering unique wording. Typing the
    // same LinkedInism twice should produce two separate alarms.
    const matches = censor(editor.innerText || editor.textContent || "", Infinity).matches;
    const current = new Map();
    const consumed = new Map();
    const previous = composerMatches.get(editor) || new Map();
    const fresh = [];
    for (const match of matches) {
      const key = match.match.toLocaleLowerCase();
      current.set(key, (current.get(key) || 0) + 1);
      if ((consumed.get(key) || 0) < (previous.get(key) || 0)) {
        consumed.set(key, (consumed.get(key) || 0) + 1);
      } else {
        fresh.push(match);
      }
    }
    composerMatches.set(editor, current);
    if (fresh.length) {
      ringWarningBell();
      showComposerWarning(fresh);
    }
  }

  function pick(items, seed) {
    return items[seed % items.length];
  }

  function matchCapitalization(original, replacementText) {
    if (/^\p{Lu}/u.test(original)) return replacementText.charAt(0).toLocaleUpperCase() + replacementText.slice(1);
    return replacementText;
  }

  const profanityPattern = /\b(?:fuck(?:ing|ed|er|ers|ery|s)?|motherfuck\w*|clusterfuck\w*|shit\w*|bullshit\w*|(?:god)?damn|hell|crap|ass|asses|asshole\w*|bitch\w*|piss\w*|cunt\w*|dick\w*|cock\w*|bastard\w*|turd\w*)\b/iu;

  function ensureProfanity(text) {
    if (profanityPattern.test(text)) return text;

    // Keep questions shaped like questions.
    if (/\?$/u.test(text)) return text.replace(/\?+$/u, ", for fuck's sake?");

    // Insert the intensifier inside common noun phrases instead of placing it
    // before the whole fragment: "part of this trip" -> "part of this fucking trip".
    const preposition = text.match(/^(part of|one of|some of|all of|at|in|on|for|with)\s+(the|a|an|my|our|your|this|that|these|those)\s+(.+)$/iu);
    if (preposition) return `${preposition[1]} ${preposition[2]} fucking ${preposition[3]}`;

    const determiner = text.match(/^(the|a|an|my|our|your|this|that|these|those)\s+(.+)$/iu);
    if (determiner) return `${determiner[1]} fucking ${determiner[2]}`;

    const firstPerson = text.match(/^(I'm|I am|we're|we are)\s+(.+)$/iu);
    if (firstPerson) return `${firstPerson[1]} fucking ${firstPerson[2]}`;

    return matchCapitalization(text, `fucking ${text.toLocaleLowerCase()}`);
  }

  function grammaticalRewrite(match, category, mode, seed) {
    const normalized = match.toLocaleLowerCase().replace(/[’]/gu, "'");

    // High-frequency clichés get actual punchlines. The broad grammar fallback
    // below is useful for obscure variants, but merely decorating the original
    // jargon ("fucking digital transformation") is not a rewrite.
    const tailored = {
      funny: {
        "digital transformation": ["an expensive website costume change", "moving the same forms to a shinier screen", "the annual migration of buttons", "a PowerPoint-led technological séance"],
        "transformative solution": ["a product wearing a superhero cape", "the old solution with dramatic lighting", "a fix that has seen the keynote deck"],
        "avenue": ["suspicious corridor", "door that may only be painted on", "professionally landscaped detour"],
        "avenues": ["suspicious corridors", "doors that may only be painted on", "professionally landscaped detours"],
        "explore avenue": ["inspect a suspicious corridor", "check whether that door is painted on", "wander down a professionally landscaped detour"],
        "explore avenues": ["inspect some suspicious corridors", "check which doors are merely painted on", "wander down several professionally landscaped detours"],
        "collaborate": ["put our calendars in a room together", "exchange professionally formatted noises", "form a temporary spreadsheet alliance"],
        "collaborates": ["puts two calendars in a room together", "exchanges professionally formatted noises", "forms a temporary spreadsheet alliance"],
        "collaborated": ["put our calendars in a room together", "exchanged professionally formatted noises", "formed a temporary spreadsheet alliance"],
        "collaborating": ["putting our calendars in a room together", "exchanging professionally formatted noises", "forming a temporary spreadsheet alliance"],
        "collaboration": ["a temporary spreadsheet alliance", "calendar-based group theatre", "the ceremonial merging of opinions"],
        "connect with you": ["add you to my professional sticker album", "become internet colleagues", "enter your notification ecosystem"],
        "catch up": ["hold a ceremonial coffee", "compare recent calendar injuries", "exchange the approved amount of small talk"],
        "compare notes": ["compare our competing spreadsheets", "synchronize our office folklore", "exchange annotated napkins"],
        "pick your brain": ["borrow your brain without completing the procurement form", "conduct an unpaid cranial audit", "rummage politely through your expertise"],
        "meaningful conversation": ["conversation with at least one detectable meaning", "chat that survives contact with the agenda", "meeting with the filler words removed"],
        "mutually beneficial": ["advantageous to both of our calendars", "a two-way exchange of business cards", "suspiciously useful to everyone involved"]
      },
      spicy: {
        "digital transformation": ["an expensive-as-fuck website costume change", "moving the same bullshit to a shinier screen", "the annual migration of the fucking buttons", "a consultant-powered technological shitshow"],
        "transformative solution": ["the same old shit in a superhero cape", "a fucking product with dramatic lighting", "a fix blessed by the bullshit deck"],
        "avenue": ["corridor of corporate bullshit", "door that probably isn't fucking real", "consultant-paved goddamn detour"],
        "avenues": ["corridors of corporate bullshit", "doors that probably aren't fucking real", "consultant-paved goddamn detours"],
        "explore avenue": ["see if the fucking door is real", "stumble down a consultant-paved goddamn detour", "inspect a corridor of corporate bullshit"],
        "explore avenues": ["see which fucking doors are real", "stumble down some consultant-paved goddamn detours", "inspect the available corridors of corporate bullshit"],
        "collaborate": ["hold a fucking meeting about another meeting", "swap some highly billable bullshit", "form a short-lived corporate clusterfuck"],
        "collaborates": ["holds a fucking meeting about another meeting", "swaps highly billable bullshit", "forms a short-lived corporate clusterfuck"],
        "collaborated": ["held a fucking meeting about another meeting", "swapped some highly billable bullshit", "formed a short-lived corporate clusterfuck"],
        "collaborating": ["holding a fucking meeting about another meeting", "swapping highly billable bullshit", "forming a short-lived corporate clusterfuck"],
        "collaboration": ["a meeting-shaped clusterfuck", "the ceremonial merging of bullshit", "calendar-based fucking group suffering"],
        "connect with you": ["invade your fucking notifications", "become internet colleagues for some goddamn reason", "join your professional bullshit ecosystem"],
        "catch up": ["survive a goddamn coffee chat", "compare recent corporate shitshow injuries", "exchange the mandatory fucking small talk"],
        "compare notes": ["compare our competing bullshit decks", "synchronize the bullshit folklore", "swap some aggressively annotated crap"],
        "pick your brain": ["request an unpaid fucking consultation", "rummage through your fucking expertise for free", "perform a goddamn cranial audit"],
        "meaningful conversation": ["conversation containing one actual fucking meaning", "chat that survives the bullshit agenda", "meeting with the corporate filler ripped out"],
        "mutually beneficial": ["useful to both our sorry asses", "a two-way exchange of corporate bullshit", "suspiciously fucking useful to everyone involved"]
      }
    };
    const tailoredOptions = tailored[mode]?.[normalized];
    if (tailoredOptions) return matchCapitalization(match, pick(tailoredOptions, seed));

    // Replace only the noun inside a journey expression. This preserves the
    // surrounding determiner, tense and clause: "this journey has" becomes
    // "this ridiculous side quest has", never an unrelated imperative.
    if (/\bjourneys?\b/iu.test(match) && normalized !== "grateful for the journey") {
      const plural = /\bjourneys\b/iu.test(match);
      const pool = plural
        ? LinkedInismData.categories.journey.pluralNouns[mode]
        : LinkedInismData.categories.journey.nouns[mode];
      const noun = pick(pool, seed);
      return match.replace(/\bjourneys?\b/iu, originalNoun => matchCapitalization(originalNoun, noun));
    }

    // Longer hiring phrases may win over the standalone opportunity pattern.
    // Replace only the embedded noun regardless of which category detected it.
    if (/\bopportunit(?:y|ies)\b/iu.test(match)) {
      const plural = /\bopportunities\b/iu.test(match);
      const pool = plural
        ? LinkedInismData.categories.opportunity.pluralNouns[mode]
        : LinkedInismData.categories.opportunity.nouns[mode];
      const noun = pick(pool, seed);
      return match.replace(/\bopportunit(?:y|ies)\b/iu, originalNoun => matchCapitalization(originalNoun, noun));
    }

    if (/\bdestinations?\b/iu.test(match)) {
      const plural = /\bdestinations\b/iu.test(match);
      const pool = plural
        ? LinkedInismData.categories.destination.pluralNouns[mode]
        : LinkedInismData.categories.destination.nouns[mode];
      const noun = pick(pool, seed);
      return match.replace(/\bdestinations?\b/iu, originalNoun => matchCapitalization(originalNoun, noun));
    }

    // Growth frequently appears inside longer catalogued compounds. Replace
    // the noun in place whether the winning match is "growth" itself,
    // "growth mindset", "revenue growth", or another larger expression.
    if (/\bgrowth\b/iu.test(match)) {
      const noun = pick(LinkedInismData.categories.growth.nouns[mode], seed);
      return match.replace(/\bgrowth\b/iu, originalNoun => matchCapitalization(originalNoun, noun));
    }
    const exact = {
      funny: {
        "grateful for the journey": ["relieved about surviving the side quest", "thankful the bizarre expedition happened", "pleased to have escaped the character arc", "glad the office pilgrimage is over"],
        "excited for what's ahead": ["cautiously curious about whatever happens next", "moderately prepared for the next plot twist", "optimistic about the approaching side quest", "intrigued by whatever the calendar throws at me"],
        "excited for what is ahead": ["cautiously curious about whatever happens next", "moderately prepared for the next plot twist", "optimistic about the approaching side quest", "intrigued by whatever the calendar throws at me"],
        "damn": ["corporate-approved expletive", "swear word with training wheels"],
        "goddamn": ["aggressively HR-safe", "the profanity equivalent of decaf"],
        "darn": ["tiny upholstered curse", "nursery-grade outburst"],
        "heck": ["family-friendly abyss", "polite little underworld"],
        "frick": ["off-brand profanity", "discount-bin expletive"],
        "fricking": ["aggressively family-friendly", "wearing profanity's costume"],
        "freaking": ["performatively annoyed", "corporate-safe furious"],
        "bloody": ["historically spicy", "mildly transatlantic"],
        "part of the journey": ["part of this peculiar side quest", "part of the ongoing office pilgrimage", "part of this suspiciously scenic ordeal", "part of the character-development montage"],
        "what a journey": ["what a bewildering side quest", "what an unnecessarily cinematic commute", "what a curious little expedition"],
        "the next chapter": ["the next downloadable content pack", "the next mildly confusing episode", "the next page of this office fanfiction"],
        "a new chapter": ["a new side quest", "a fresh page of office fanfiction", "a surprisingly plot-heavy episode"],
        "embrace": ["ceremonially accept", "awkwardly welcome", "give a cautious little hug to"],
        "embraces": ["ceremonially accepts", "awkwardly welcomes", "gives a cautious little hug to"],
        "embraced": ["ceremonially accepted", "awkwardly welcomed", "gave a cautious little hug to"],
        "embracing": ["ceremonially accepting", "awkwardly welcoming", "giving a cautious little hug to"]
      },
      spicy: {
        "grateful for the journey": ["fucking relieved I survived the ordeal", "thankful as fuck the shitshow is over", "fucking glad I made it through the clusterfuck", "relieved as fuck about surviving that saga"],
        "excited for what's ahead": ["fucking ready for whatever comes next", "excited as fuck about the next mess", "fucking curious about the incoming shitshow", "ready as fuck for the next plot twist"],
        "excited for what is ahead": ["fucking ready for whatever comes next", "excited as fuck about the next mess", "fucking curious about the incoming shitshow", "ready as fuck for the next plot twist"],
        "damn": ["fuck", "shit"],
        "goddamn": ["motherfucking", "fucking"],
        "darn": ["fuck", "shit"],
        "heck": ["fuck", "fucking hell"],
        "frick": ["fuck", "shit"],
        "fricking": ["fucking", "motherfucking"],
        "freaking": ["fucking", "motherfucking"],
        "bloody": ["fucking", "motherfucking"],
        "part of the journey": ["part of the whole fucking ordeal", "part of this fucking expedition", "part of the long-ass clusterfuck", "part of this motherfucking saga"],
        "what a journey": ["what a fucking ordeal", "what a shitshow of a ride", "what an absolute motherfucker of a trip"],
        "the next chapter": ["the next fucking chapter", "the next motherfucking episode", "the next part of this shitshow"],
        "a new chapter": ["a new fucking chapter", "a fresh motherfucking episode", "another part of this wild-ass shitshow"],
        "embrace": ["fucking accept", "grab hold of", "quit fighting and accept"],
        "embraces": ["fucking accepts", "grabs hold of", "quits fighting and accepts"],
        "embraced": ["fucking accepted", "grabbed hold of", "quit fighting and accepted"],
        "embracing": ["fucking accepting", "grabbing hold of", "finally accepting"]
      }
    };
    const exactOptions = exact[mode]?.[normalized];
    if (exactOptions) return matchCapitalization(match, pick(exactOptions, seed));

    // Complete first-person gratitude clauses can safely use the richer
    // first-person pool. Predicate fragments such as "truly humbled" must not.
    if (category === "gratitude" && /^(?:i'm|i am|feeling)\b/iu.test(normalized)) {
      return pick(LinkedInismData.categories.gratitude[mode], seed);
    }

    const descriptor = mode === "spicy"
      ? pick(["bullshit-powered", "committee-fucked", "soul-draining", "consultant-enriching fucking", "PowerPoint-haunted shitshow-grade"], seed)
      : pick(["curiously dramatic", "suspiciously shiny", "ceremonial", "office-approved", "mildly bewildering"], seed);
    const adverb = mode === "spicy"
      ? pick(["through some fucking corporate theatre,", "with a goddamn slide deck,", "after consulting the bullshit oracle,", "in a wildly fucking billable manner,", "with all the grace of a corporate shitshow,"], seed)
      : pick(["ceremonially", "awkwardly", "with alarming confidence", "strategically", "for reasons involving a spreadsheet"], seed);

    // Insert adjectives after determiners so noun phrases remain noun phrases:
    // "the journey" -> "the fucking journey".
    const determiner = match.match(/^(the|a|an|my|our|your|this|that|these|those)\s+(.+)$/iu);
    if (determiner) {
      return `${determiner[1]} ${descriptor} ${determiner[2]}`;
    }

    // Preserve common prepositional noun phrases.
    const preposition = match.match(/^(part of|one of|some of|all of|at|in|on|for|with)\s+(the|a|an|my|our|your|this|that)\s+(.+)$/iu);
    if (preposition) {
      return `${preposition[1]} ${preposition[2]} ${descriptor} ${preposition[3]}`;
    }

    // Bare nouns and noun compounds need an adjective, not an adverb. This
    // covers jargon such as "synergy", "growth mindset", and "gratitude post".
    const nounEnding = /(?:announcement|update|news|journey|chapter|mindset|moment|post|takeaway|lesson|motivation|synergy|innovation|shift|fruit|star|sauce|hypergrowth|ecosystem|leadership|culture|experience|strategy|pipeline|funnel|growth|insights?|learnings?|bandwidth|alignment|opportunity|role|position|candidate|team|productivity|routine|balance|brand|algorithm|content|metrics?)$/iu;
    if ((!/\s/u.test(match) && !/[?!.]$/u.test(match)) || nounEnding.test(match)) {
      return matchCapitalization(match, `${descriptor} ${match.toLocaleLowerCase()}`);
    }

    // Questions stay questions instead of becoming declarations.
    if (/\?$/u.test(match)) {
      const question = match.replace(/\?+$/u, "");
      return mode === "spicy" ? `${question}, honestly?` : `${question}, if the office ferret may weigh in?`;
    }

    // The remaining catalog is primarily verbal or clausal. An adverbial
    // prefix preserves its ability to sit after auxiliaries such as can/will.
    return matchCapitalization(match, `${adverb} ${match.toLocaleLowerCase()}`);
  }

  function replacement(match, category, offset, contextSeed = 0) {
    // Include the surrounding text in the deterministic seed. The same post
    // stays stable across rescans, while identical clichés in different posts
    // no longer collapse to the same replacement.
    const seed = hash(`${contextSeed}:${match}:${category}:${offset}`);
    const data = LinkedInismData;
    if (config.mode === "asterisks") return match.replace(/[\p{L}\p{N}]/gu, "*");
    if (config.mode === "symbols") {
      const symbols = ["%", "!", "#", "$", "&", "@", "*"];
      return Array.from(match, (char, i) => /\s/u.test(char) ? char : symbols[(seed + i) % symbols.length]).join("");
    }
    if (config.mode === "apology") return `${match} ${data.apologies[seed % data.apologies.length]}`;
    const rewritten = grammaticalRewrite(match, category, config.mode, seed);
    return config.mode === "spicy" ? ensureProfanity(rewritten) : rewritten;
  }

  function censor(text, maximumMatches) {
    // LinkedIn often renders an entire long post as one text block. A limit of
    // four made Balanced silently ignore clichés near the end of those posts.
    const limits = { gentle: 1, balanced: 20, ruthless: Infinity };
    const limit = maximumMatches ?? limits[config.intensity];
    const contextSeed = hash(text);
    const candidates = [];
    for (const entry of LinkedInismData.entries) {
      entry.regex.lastIndex = 0;
      let match;
      while ((match = entry.regex.exec(text))) {
        candidates.push({ start: match.index, end: match.index + match[0].length, match: match[0], category: entry.category });
        if (!match[0].length) entry.regex.lastIndex += 1;
      }
    }
    candidates.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
    const accepted = [];
    for (const candidate of candidates) {
      if (accepted.length >= limit) break;
      if (!accepted.some(item => candidate.start < item.end && candidate.end > item.start)) accepted.push(candidate);
    }
    accepted.sort((a, b) => a.start - b.start);
    accepted.forEach(item => { item.replacement = replacement(item.match, item.category, item.start, contextSeed); });
    return { matches: accepted, count: accepted.length };
  }

  function eligible(node) {
    const parent = node.parentElement;
    return parent && node.nodeValue.trim().length > 2 && !parent.closest(ignored) && parent.closest(feedSelectors);
  }

  function processTextNode(node) {
    if (!config.enabled || !eligible(node)) return;
    const source = node.nodeValue;
    const result = censor(source);
    if (!result.count) return;

    const wrapper = document.createElement("span");
    wrapper.className = "linkedinism-censor-text";
    let cursor = 0;
    for (const match of result.matches) {
      wrapper.append(document.createTextNode(source.slice(cursor, match.start)));
      const censored = document.createElement("span");
      censored.className = "linkedinism-censored";
      censored.textContent = match.replacement;
      censored.title = `LinkedInism censored: “${match.match}”`;
      wrapper.append(censored);
      cursor = match.end;
    }
    wrapper.append(document.createTextNode(source.slice(cursor)));
    originalText.set(wrapper, source);
    node.replaceWith(wrapper);
  }

  function process(root) {
    if (root.nodeType === Node.TEXT_NODE) return processTextNode(root);
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches?.(ignored)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    // Do not mutate the DOM while TreeWalker is traversing it. Replacing a
    // visited text node can make the walker skip later siblings and paragraphs.
    while ((node = walker.nextNode())) textNodes.push(node);
    textNodes.forEach(processTextNode);
  }

  function restore() {
    isEditing = true;
    for (const [wrapper, text] of originalText) {
      if (wrapper.isConnected) wrapper.replaceWith(document.createTextNode(text));
    }
    originalText.clear();
    isEditing = false;
  }

  function reprocess() {
    observer.disconnect();
    restore();
    if (config.enabled) process(document.body);
    updateCounter();
    observe();
  }

  function observe() {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  }

  observer = new MutationObserver(mutations => {
    if (isEditing) return;
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        processTextNode(mutation.target);
      } else {
        mutation.addedNodes.forEach(process);
      }
    }
    updateCounter();
    inspectComposer();
  });

  chrome.storage.sync.get(DEFAULTS, stored => {
    config = stored;
    process(document.body);
    updateCounter();
    observe();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    config = { ...config, ...Object.fromEntries(Object.entries(changes).map(([key, value]) => [key, value.newValue])) };
    reprocess();
  });

  document.addEventListener("input", inspectComposer, true);
  document.addEventListener("keyup", event => setTimeout(() => inspectComposer(event), 0), true);
})();

# LangLearn Atlas

A curated directory of resources for learning any language.

## Pages
- **Home** — hero, language search, "pick a language" grid with flags, difficulty-for-English-speakers tier list, featured roadmaps
- **Language hub (per language)** — overview, difficulty rating (FSI category), regions spoken, script/alphabet intro with audio, recommended free courses, paid courses, YouTube channels, podcasts, books, apps, communities, certification exams, native-exchange platforms
- **Roadmaps** — A1 → C2 milestones per language with estimated hours, recommended resource sequence, what you should be able to do at each level
- **Script/alphabet guides** — interactive pages for non-Latin scripts (Hangul, Cyrillic, Arabic, Devanagari, kana, hanzi basics) with audio + stroke order
- **Grammar primers** — short reference pages per language
- **Common mistakes** — "false friends" and frequent learner errors per language
- **Certifications hub** — JLPT, HSK, DELE, DELF, TOPIK, TestDaF, TOEFL, IELTS — explained with score-band meanings and prep resources
- **Compare languages** — side by side: difficulty, time investment, usefulness by region
- **Method library** — Pimsleur, Assimil, comprehensible input, immersion, Anki — neutral explainers of each approach

## Seed languages (top 50ish)
Spanish, French, Mandarin, Japanese, Korean, German, Italian, Portuguese, Russian, Arabic, Hindi, Turkish, Dutch, Polish, Swedish, Vietnamese, Thai, Indonesian, Hebrew, Greek, Czech, Hungarian, Finnish, Norwegian, Danish, Romanian, Ukrainian, Persian, Swahili, Tagalog, Bengali, Urdu, Tamil, Malay, Cantonese, etc.

## Data sources
- FSI difficulty tables (public domain)
- Official exam body websites
- Well-established learning communities (r/languagelearning recommendations, etc.) — curate

## Suggested stack
Next.js, Tailwind, MDX for language hubs and roadmaps, simple JSON for resource lists.

## Design notes
- Flags, scripts, and typography are the design — lean into them
- Audio playback on script pages (host short MP3s or use Web Speech API for TTS)
- Color-code languages by family (Romance, Germanic, Slavic, Sinitic, etc.)
- Difficulty tier badges (FSI Cat I-V) very visible

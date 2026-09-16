#!/usr/bin/env python3
"""Build script-course JSON from local dictionary and frequency exports.

The large source dictionaries are intentionally not committed. Pass paths to
the Kaikki JSONL exports and frequency files through the CLI; the generated
course files remain small enough to ship with the site.
"""

from __future__ import annotations

import argparse
import csv
import itertools
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path


LANGUAGE_DETAILS = {
    "hindi": {
        "kaikki": "Hindi",
        "letters": [
            ("अ", "a", "a", "The short a inherent in a bare consonant."),
            ("आ", "aa", "ā", "A long aa sound."),
            ("इ", "i", "i", "A short i sound."),
            ("ई", "ii", "ī", "A long ee sound."),
            ("उ", "u", "u", "A short u sound."),
            ("ऊ", "uu", "ū", "A long oo sound."),
            ("ऋ", "ri", "ṛ", "Usually pronounced ri in modern Hindi."),
            ("ए", "e", "e", "A long e sound."),
            ("ऐ", "ai", "ai", "The vowel sound ai."),
            ("ओ", "o", "o", "A long o sound."),
            ("औ", "au", "au", "The vowel sound au."),
            ("अं", "anusvar", "ṃ", "A nasal sound written with a dot above."),
            ("अः", "visarg", "ḥ", "A breathy echo after a vowel, mostly in learned words."),
            ("क", "ka", "k", "Like k in skill."),
            ("ख", "kha", "kh", "An aspirated k, released with a puff of air."),
            ("ग", "ga", "g", "Like g in go."),
            ("घ", "gha", "gh", "An aspirated voiced g."),
            ("ङ", "nga", "ṅ", "The ng sound in sing, chiefly used in clusters."),
            ("च", "cha", "c", "Like ch in chair, without strong aspiration."),
            ("छ", "chha", "ch", "An aspirated ch sound."),
            ("ज", "ja", "j", "Like j in jam."),
            ("झ", "jha", "jh", "An aspirated voiced j."),
            ("ञ", "nya", "ñ", "Like ny in canyon, chiefly used in clusters."),
            ("ट", "tta", "ṭ", "A retroflex t made with the tongue curled back."),
            ("ठ", "ttha", "ṭh", "An aspirated retroflex t."),
            ("ड", "dda", "ḍ", "A retroflex d."),
            ("ढ", "ddha", "ḍh", "An aspirated retroflex d."),
            ("ण", "nna", "ṇ", "A retroflex n."),
            ("त", "ta", "t", "A dental t made with the tongue at the teeth."),
            ("थ", "tha", "th", "An aspirated dental t."),
            ("द", "da", "d", "A dental d."),
            ("ध", "dha", "dh", "An aspirated dental d."),
            ("न", "na", "n", "Like n in name."),
            ("प", "pa", "p", "Like p in spin."),
            ("फ", "pha", "ph", "An aspirated p; sometimes f in loanwords."),
            ("ब", "ba", "b", "Like b in book."),
            ("भ", "bha", "bh", "An aspirated voiced b."),
            ("म", "ma", "m", "Like m in moon."),
            ("य", "ya", "y", "Like y in yes."),
            ("र", "ra", "r", "A tapped r sound."),
            ("ल", "la", "l", "Like l in lamp."),
            ("व", "va", "v / w", "Between English v and w, depending on context."),
            ("श", "sha", "ś", "A soft sh sound."),
            ("ष", "ssa", "ṣ", "A retroflex sh, often merging with sh in speech."),
            ("स", "sa", "s", "Like s in sun."),
            ("ह", "ha", "h", "Like h in home."),
            ("ड़", "rra", "ṛ", "A retroflex flap, close to a quick r."),
            ("ढ़", "rrha", "ṛh", "An aspirated retroflex flap."),
        ],
        "vowel_forms": {
            "अ": "(inherent)", "आ": "ा", "इ": "ि", "ई": "ी", "उ": "ु", "ऊ": "ू",
            "ऋ": "ृ", "ए": "े", "ऐ": "ै", "ओ": "ो", "औ": "ौ", "अं": "ं", "अः": "ः",
        },
        "variants": {
            "ा": "आ", "ि": "इ", "ी": "ई", "ु": "उ", "ू": "ऊ", "ृ": "ऋ", "ॄ": "ऋ",
            "े": "ए", "ै": "ऐ", "ो": "ओ", "ौ": "औ", "ं": "अं", "ँ": "अं", "ः": "अः",
        },
        "ignore": {"्", "़", "ऽ"},
        "compounds": ["ड़", "ढ़", "अं", "अः"],
    },
    "georgian": {
        "kaikki": "Georgian",
        "letters": [
            ("ა", "ani", "a", "Like a in father."), ("ბ", "bani", "b", "Like b in book."),
            ("გ", "gani", "g", "Like g in go."), ("დ", "doni", "d", "Like d in door."),
            ("ე", "eni", "e", "Like e in bed."), ("ვ", "vini", "v", "Like v in voice."),
            ("ზ", "zeni", "z", "Like z in zoo."), ("თ", "tani", "t", "An aspirated t."),
            ("ი", "ini", "i", "Like ee in see, but shorter."), ("კ", "k'ani", "k'", "An ejective k."),
            ("ლ", "lasi", "l", "Like l in lamp."), ("მ", "mani", "m", "Like m in moon."),
            ("ნ", "nari", "n", "Like n in name."), ("ო", "oni", "o", "Like o in more."),
            ("პ", "p'ari", "p'", "An ejective p."), ("ჟ", "zhani", "zh", "Like s in measure."),
            ("რ", "rae", "r", "A tapped or rolled r."), ("ს", "sani", "s", "Like s in sun."),
            ("ტ", "t'ari", "t'", "An ejective t."), ("უ", "uni", "u", "Like oo in moon."),
            ("ფ", "pari", "p", "An aspirated p."), ("ქ", "kani", "k", "An aspirated k."),
            ("ღ", "ghani", "gh", "A voiced sound made at the back of the throat."),
            ("ყ", "q'ari", "q'", "A deep ejective q sound."), ("შ", "shini", "sh", "Like sh in ship."),
            ("ჩ", "chini", "ch", "An aspirated ch."), ("ც", "tsani", "ts", "An aspirated ts."),
            ("ძ", "dzili", "dz", "Like ds in beds."), ("წ", "ts'ili", "ts'", "An ejective ts."),
            ("ჭ", "ch'ari", "ch'", "An ejective ch."), ("ხ", "khani", "kh", "Like ch in Scottish loch."),
            ("ჯ", "jani", "j", "Like j in jam."), ("ჰ", "hae", "h", "Like h in home."),
        ],
        "mtavruli": dict(zip("აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ", "ᲐᲑᲒᲓᲔᲕᲖᲗᲘᲙᲚᲛᲜᲝᲞᲟᲠᲡᲢᲣᲤᲥᲦᲧᲨᲩᲪᲫᲬᲭᲮᲯᲰ")),
        "variants": {}, "ignore": set(), "compounds": [],
    },
    "armenian": {
        "kaikki": "Armenian",
        "letters": [
            ("ա", "ayb", "a", "Like a in father."), ("բ", "ben", "b", "Like b in book."),
            ("գ", "gim", "g", "Like g in go."), ("դ", "da", "d", "Like d in door."),
            ("ե", "yech", "e / ye", "E, or ye at the start of a word."), ("զ", "za", "z", "Like z in zoo."),
            ("է", "eh", "ē", "A clear e sound."), ("ը", "ət", "ə", "The neutral vowel in about."),
            ("թ", "to", "t'", "An aspirated t."), ("ժ", "zhe", "zh", "Like s in measure."),
            ("ի", "ini", "i", "Like ee in see, but shorter."), ("լ", "lyun", "l", "Like l in lamp."),
            ("խ", "khe", "kh", "Like ch in Scottish loch."), ("ծ", "tsa", "ts", "An unaspirated ts."),
            ("կ", "ken", "k", "An unaspirated k."), ("հ", "ho", "h", "Like h in home."),
            ("ձ", "dza", "dz", "Like ds in beds."), ("ղ", "ghat", "gh", "A voiced sound at the back of the throat."),
            ("ճ", "che", "ch", "An unaspirated ch."), ("մ", "men", "m", "Like m in moon."),
            ("յ", "yi", "y", "Like y in yes."), ("ն", "nu", "n", "Like n in name."),
            ("շ", "sha", "sh", "Like sh in ship."), ("ո", "vo", "o / vo", "O, or vo at the start of a word."),
            ("չ", "cha", "ch'", "An aspirated ch."), ("պ", "pe", "p", "An unaspirated p."),
            ("ջ", "je", "j", "Like j in jam."), ("ռ", "ra", "rr", "A strongly rolled r."),
            ("ս", "se", "s", "Like s in sun."), ("վ", "vev", "v", "Like v in voice."),
            ("տ", "tyun", "t", "An unaspirated t."), ("ր", "re", "r", "A light tapped r."),
            ("ց", "tso", "ts'", "An aspirated ts."), ("ւ", "vyun", "w", "Classical wyun; retained in the ու digraph."),
            ("փ", "pyur", "p'", "An aspirated p."), ("ք", "ke", "k'", "An aspirated k."),
            ("օ", "o", "ō", "A long o sound."), ("ֆ", "fe", "f", "Like f in fish."),
            ("և", "yev", "ev / yev", "The ligature for ev, or yev initially."),
        ],
        "uppercase": dict(zip("աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆև", "ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖԵՎ")),
        "variants": {"եւ": "և"}, "ignore": {"՛", "՜", "՞", "՚", "՟"}, "compounds": ["և", "եւ"],
    },
    "hebrew": {
        "kaikki": "Hebrew",
        "letters": [
            ("א", "alef", "ʾ / silent", "Usually silent in Modern Hebrew; historically a glottal stop."),
            ("ב", "bet", "b / v", "B with a dot, otherwise v."), ("ג", "gimel", "g", "Like g in go."),
            ("ד", "dalet", "d", "Like d in door."), ("ה", "he", "h", "Like h in home, often silent at word end."),
            ("ו", "vav", "v / o / u", "V as a consonant; also helps write o and u."),
            ("ז", "zayin", "z", "Like z in zoo."), ("ח", "het", "kh", "A raspy kh sound."),
            ("ט", "tet", "t", "Like t in table."), ("י", "yod", "y / i", "Y as a consonant; also helps write i."),
            ("כ", "kaf", "k / kh", "K with a dot, otherwise kh."), ("ל", "lamed", "l", "Like l in lamp."),
            ("מ", "mem", "m", "Like m in moon."), ("נ", "nun", "n", "Like n in name."),
            ("ס", "samekh", "s", "Like s in sun."), ("ע", "ayin", "ʿ / silent", "Usually silent in Modern Israeli Hebrew."),
            ("פ", "pe", "p / f", "P with a dot, otherwise f."), ("צ", "tsadi", "ts", "Like ts in cats."),
            ("ק", "qof", "k", "Pronounced like k in Modern Hebrew."), ("ר", "resh", "r", "The Modern Hebrew r, often made at the back of the throat."),
            ("ש", "shin", "sh / s", "Sh with a right dot, s with a left dot."), ("ת", "tav", "t", "Like t in table."),
        ],
        "finals": {"כ": "ך", "מ": "ם", "נ": "ן", "פ": "ף", "צ": "ץ"},
        "variants": {"ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ"},
        "ignore": set("ְֱֲֳִֵֶַָׇֹֺֻּֽֿׁׂׅׄ"), "compounds": [],
    },
}


def plain_roman(value: str) -> str:
    replacements = {
        "š": "sh", "ś": "sh", "ṣ": "sh", "ž": "zh", "č": "ch", "ǰ": "j",
        "ṭ": "t", "ḍ": "d", "ṇ": "n", "ṅ": "n", "ñ": "ny", "ṛ": "r",
        "ḷ": "l", "ḥ": "h", "ḵ": "kh", "ẖ": "kh", "ḇ": "v", "ḡ": "g",
        "ḏ": "d", "ṯ": "t", "ẕ": "z", "ẓ": "ts", "ʿ": "", "ʾ": "",
        "ʻ": "", "‘": "", "’": "", "ʼ": "'", "ə": "e", "ǝ": "e",
        "ō": "o", "ū": "u", "ī": "i", "ē": "e", "ā": "a", "æ": "ae",
        "õ": "on", "ṃ": "m", "ṁ": "m", "ṝ": "ri", "ġ": "gh",
    }
    value = "".join(replacements.get(char, char) for char in value.lower())
    value = "".join(char for char in unicodedata.normalize("NFKD", value) if not unicodedata.combining(char))
    value = value.replace("-", "").replace(" ", "").replace("'", "")
    return re.sub(r"[^a-z]", "", value)


def short_gloss(value: str) -> str:
    value = re.sub(r"\([^)]{35,}\)", "", value)
    value = value.split("; ")[0].strip(" .")
    return value[:1].lower() + value[1:] if value else value


def load_kaikki(path: Path) -> dict[str, dict[str, str]]:
    words: dict[str, dict[str, str]] = {}
    rejected_glosses = (
        "inflection of", "alternative spelling of", "misspelling of", "obsolete",
        "vowel of", "vowel in", "consonant of", "consonant in", "the letter",
    )
    with path.open(encoding="utf-8") as source:
        for line in source:
            item = json.loads(line)
            senses = [sense["glosses"][0] for sense in item.get("senses", []) if sense.get("glosses")]
            gloss = next((value for value in senses if not any(marker in value.lower() for marker in rejected_glosses)), None)
            if not gloss:
                continue
            forms = item.get("forms", [])
            word = unicodedata.normalize("NFC", item.get("word", "")).lower()
            roman = next((form.get("form") for form in forms if "romanization" in form.get("tags", [])), None)
            spellings = [(word, roman)]
            spellings.extend(
                (unicodedata.normalize("NFC", form.get("form", "")).lower(), form.get("roman"))
                for form in forms if form.get("roman") and form.get("form") not in {"-", "—"}
            )
            for spelling, transcription in spellings:
                latin = plain_roman(transcription or "")
                if spelling and latin and spelling not in words:
                    words[spelling] = {"script": spelling, "latin": latin, "translation": short_gloss(gloss)}
    return words


def tokenize(word: str, details: dict) -> list[str] | None:
    word = unicodedata.normalize("NFC", word.lower())
    compounds = sorted(details.get("compounds", []), key=len, reverse=True)
    variants = details.get("variants", {})
    ignored = details.get("ignore", set())
    known = {item[0] for item in details["letters"]}
    tokens: list[str] = []
    index = 0
    while index < len(word):
        compound = next((item for item in compounds if word.startswith(item, index)), None)
        if compound:
            tokens.append(variants.get(compound, compound))
            index += len(compound)
            continue
        char = word[index]
        if char in ignored:
            index += 1
            continue
        token = variants.get(char, char)
        if token not in known:
            return None
        tokens.append(token)
        index += 1
    return tokens or None


def load_ranked_words(language: str, args, dictionary: dict[str, dict[str, str]]) -> list[dict]:
    ranks: dict[str, int] = {}
    direct: dict[str, dict[str, str]] = {}
    if language in {"hindi", "hebrew"}:
        sys.path.insert(0, str(args.wordfreq_path))
        from wordfreq import top_n_list
        code = "hi" if language == "hindi" else "he"
        ranks = {unicodedata.normalize("NFC", word.lower()): rank for rank, word in enumerate(top_n_list(code, 50000), 1)}
    elif language == "georgian":
        with args.frequency.open(encoding="utf-8") as source:
            for row in csv.DictReader(source):
                word = unicodedata.normalize("NFC", row["lemma"].lower())
                ranks[word] = int(row["rank"])
                direct[word] = {"script": word, "latin": plain_roman(row["translit"]), "translation": short_gloss(row["gloss_en"])}
    else:
        with args.frequency.open(encoding="utf-8") as source:
            for line in source:
                parts = line.rstrip().split("\t")
                if len(parts) >= 3 and parts[0].isdigit():
                    word = unicodedata.normalize("NFC", parts[1].lower())
                    ranks.setdefault(word, len(ranks) + 1)
        if args.common:
            text = args.common.read_text(encoding="utf-8")
            match = re.search(r'raw_words = """(.*?)"""', text, re.S)
            if match:
                for line in match.group(1).splitlines():
                    parts = line.split("\t")
                    if len(parts) >= 3 and parts[0].isdigit() and " " not in parts[1]:
                        word = unicodedata.normalize("NFC", parts[1].lower())
                        ranks[word] = min(ranks.get(word, 10**9), int(parts[0]))
                        if word in dictionary:
                            direct[word] = {**dictionary[word], "translation": parts[2].strip()}

    details = LANGUAGE_DETAILS[language]
    merged = {**dictionary, **direct}
    candidates = []
    for word, entry in merged.items():
        tokens = tokenize(word, details)
        if tokens is None or len(tokens) > 18 or len(set(tokens)) > 12:
            continue
        rank = ranks.get(word, 100000 + len(tokens) * 100 + len(candidates) % 100)
        candidates.append({**entry, "tokens": tokens, "rank": rank})
    return sorted(candidates, key=lambda item: (item["rank"], len(item["tokens"]), item["script"]))


def next_group(remaining: list[str], seen: set[str], candidates: list[dict], size: int) -> tuple[str, ...]:
    signatures: dict[frozenset[str], int] = defaultdict(int)
    ranks: dict[frozenset[str], int] = defaultdict(int)
    remaining_set = set(remaining)
    for item in candidates:
        unseen = frozenset(set(item["tokens"]) & remaining_set)
        if 0 < len(unseen) <= size and set(item["tokens"]) <= seen | set(unseen):
            signatures[unseen] += 1
            ranks[unseen] += max(0, 25000 - min(item["rank"], 25000))

    best = None
    best_score = None
    for group in itertools.combinations(remaining, size):
        group_set = set(group)
        counts = {letter: 0 for letter in group}
        total = 0
        quality = 0
        for subset_size in range(1, size + 1):
            for subset in itertools.combinations(group, subset_size):
                signature = frozenset(subset)
                count = signatures.get(signature, 0)
                total += count
                quality += ranks.get(signature, 0)
                for letter in signature:
                    counts[letter] += count
        minimum = min(counts.values(), default=0)
        score = (minimum >= 5, total >= 50, min(minimum, 20), min(total, 500), quality)
        if best_score is None or score > best_score:
            best, best_score = group, score
    if best is None:
        raise RuntimeError("Could not choose another letter group")
    return best


def group_sizes(letter_count: int) -> list[int]:
    sizes = [4]
    remaining = letter_count - 4
    while remaining:
        size = min(4, remaining)
        if remaining - size == 1:
            size -= 1
        sizes.append(size)
        remaining -= size
    return sizes


def choose_lesson_words(group: tuple[str, ...], seen: set[str], candidates: list[dict]) -> list[dict]:
    group_set = set(group)
    eligible = [
        item for item in candidates
        if set(item["tokens"]) <= seen | group_set and set(item["tokens"]) & group_set
    ]
    chosen: list[dict] = []
    chosen_words: set[str] = set()
    for letter in group:
        for item in eligible:
            if letter in item["tokens"] and item["script"] not in chosen_words:
                chosen.append(item)
                chosen_words.add(item["script"])
                if sum(letter in selected["tokens"] for selected in chosen) >= 5:
                    break
    for item in eligible:
        if len(chosen) == 50:
            break
        if item["script"] not in chosen_words:
            chosen.append(item)
            chosen_words.add(item["script"])
    if len(chosen) < 50:
        raise RuntimeError(f"Only {len(chosen)} words available for {group}")
    chosen.sort(key=lambda item: (len(item["tokens"]), item["rank"], item["script"]))
    return [{key: item[key] for key in ("script", "latin", "translation")} for item in chosen[:50]]


def make_forms(language: str, letter: str, details: dict) -> list[dict[str, str]]:
    if language == "hindi":
        forms = [{"label": "Independent / letter", "glyph": letter}]
        if letter in details["vowel_forms"]:
            forms.append({"label": "Vowel sign", "glyph": details["vowel_forms"][letter]})
        return forms
    if language == "georgian":
        return [{"label": "Mkhedruli", "glyph": letter}, {"label": "Mtavruli", "glyph": details["mtavruli"][letter]}]
    if language == "armenian":
        return [{"label": "Lowercase", "glyph": letter}, {"label": "Uppercase", "glyph": details["uppercase"][letter]}]
    forms = [{"label": "Regular", "glyph": letter}]
    if letter in details["finals"]:
        forms.append({"label": "Final", "glyph": details["finals"][letter]})
    return forms


def build_course(language: str, candidates: list[dict]) -> dict:
    details = LANGUAGE_DETAILS[language]
    remaining = [item[0] for item in details["letters"]]
    seen: set[str] = set()
    lessons = []
    for size in group_sizes(len(remaining)):
        group = next_group(remaining, seen, candidates, size)
        words = choose_lesson_words(group, seen, candidates)
        lessons.append({"letters": list(group), "words": words})
        seen.update(group)
        remaining = [letter for letter in remaining if letter not in group]

    all_words = sorted(candidates, key=lambda item: (item["rank"], len(item["tokens"])))
    alphabet = []
    for letter, name, transliteration, sound in details["letters"]:
        examples = [item for item in all_words if letter in item["tokens"]][:3]
        if len(examples) < 3:
            raise RuntimeError(f"Only {len(examples)} examples for {language} {letter}")
        alphabet.append({
            "letter": letter,
            "name": name,
            "transliteration": transliteration,
            "sound": sound,
            "forms": make_forms(language, letter, details),
            "examples": [{key: item[key] for key in ("script", "translation")} for item in examples],
        })
    return {"alphabet": alphabet, "lessons": lessons}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("language", choices=LANGUAGE_DETAILS)
    parser.add_argument("--kaikki", type=Path, required=True)
    parser.add_argument("--frequency", type=Path)
    parser.add_argument("--common", type=Path)
    parser.add_argument("--wordfreq-path", type=Path, default=Path("/tmp/script-learning-python"))
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    dictionary = load_kaikki(args.kaikki)
    candidates = load_ranked_words(args.language, args, dictionary)
    course = build_course(args.language, candidates)
    args.output.write_text(json.dumps(course, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(course['alphabet'])} letters and {len(course['lessons'])} lessons to {args.output}")
    for index, lesson in enumerate(course["lessons"], 1):
        print(index, " ".join(lesson["letters"]), len(lesson["words"]), lesson["words"][0]["script"], "…", lesson["words"][-1]["script"])


if __name__ == "__main__":
    main()

export type ScriptLanguage = "arabic" | "persian";

export type LetterExample = {
  position: "Beginning" | "Middle" | "End";
  word: string;
  meaning: string;
  letterIndex: number;
};

export type AlphabetLetter = {
  letter: string;
  name: string;
  transliteration: string;
  sound: string;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  connectsForward: boolean;
  examples: [LetterExample, LetterExample, LetterExample];
};

type LetterSeed = Omit<AlphabetLetter, "examples"> & {
  examples: [string, string, number, string, string, number, string, string, number];
};

const makeLetter = ({ examples, ...letter }: LetterSeed): AlphabetLetter => ({
  ...letter,
  examples: [
    { position: "Beginning", word: examples[0], meaning: examples[1], letterIndex: examples[2] },
    { position: "Middle", word: examples[3], meaning: examples[4], letterIndex: examples[5] },
    { position: "End", word: examples[6], meaning: examples[7], letterIndex: examples[8] },
  ],
});

const joinedForms: Record<string, AlphabetLetter["forms"]> = {
  ب: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
  ت: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
  ث: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
  ج: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
  ح: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
  خ: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
  س: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
  ش: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
  ص: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
  ض: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
  ط: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
  ظ: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
  ع: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
  غ: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
  ف: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
  ق: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
  ك: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
  ک: { isolated: "ک", initial: "کـ", medial: "ـکـ", final: "ـک" },
  گ: { isolated: "گ", initial: "گـ", medial: "ـگـ", final: "ـگ" },
  ل: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
  م: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
  ن: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
  ه: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
  ي: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
  ی: { isolated: "ی", initial: "یـ", medial: "ـیـ", final: "ـی" },
  پ: { isolated: "پ", initial: "پـ", medial: "ـپـ", final: "ـپ" },
  چ: { isolated: "چ", initial: "چـ", medial: "ـچـ", final: "ـچ" },
};

const brokenForms: Record<string, AlphabetLetter["forms"]> = {
  ا: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" },
  د: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" },
  ذ: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" },
  ر: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" },
  ز: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" },
  و: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" },
  ژ: { isolated: "ژ", initial: "ژ", medial: "ـژ", final: "ـژ" },
};

const seed = (
  letter: string,
  name: string,
  transliteration: string,
  sound: string,
  examples: LetterSeed["examples"],
): AlphabetLetter =>
  makeLetter({
    letter,
    name,
    transliteration,
    sound,
    forms: joinedForms[letter] ?? brokenForms[letter],
    connectsForward: Boolean(joinedForms[letter]),
    examples,
  });

export const arabicAlphabet: AlphabetLetter[] = [
  seed("ا", "Alif", "ā / ʔ", "A long ‘aa’ sound, or a glottal stop when carrying hamza.", ["اسم", "name", 0, "باب", "door", 1, "عصا", "stick", 2]),
  seed("ب", "Bāʼ", "b", "Like b in ‘book’.", ["باب", "door", 0, "جبل", "mountain", 1, "كلب", "dog", 2]),
  seed("ت", "Tāʼ", "t", "Like t in ‘table’.", ["تمر", "dates", 0, "كتاب", "book", 1, "بيت", "house", 2]),
  seed("ث", "Thāʼ", "th", "Like th in ‘think’.", ["ثلج", "snow", 0, "مثل", "example", 1, "بحث", "research", 2]),
  seed("ج", "Jīm", "j", "Usually like j in ‘jam’; regional pronunciations vary.", ["جبل", "mountain", 0, "مسجد", "mosque", 2, "ثلج", "snow", 2]),
  seed("ح", "Ḥāʼ", "ḥ", "A strong, breathy h made deep in the throat.", ["حليب", "milk", 0, "بحر", "sea", 1, "مفتاح", "key", 4]),
  seed("خ", "Khāʼ", "kh", "A raspy kh, like the ch in Scottish ‘loch’.", ["خبز", "bread", 0, "نخل", "palm trees", 1, "مطبخ", "kitchen", 3]),
  seed("د", "Dāl", "d", "Like d in ‘door’.", ["دب", "bear", 0, "مدرسة", "school", 1, "يد", "hand", 1]),
  seed("ذ", "Dhāl", "dh", "Like th in ‘this’.", ["ذهب", "gold", 0, "أذن", "ear", 1, "تلميذ", "pupil", 4]),
  seed("ر", "Rāʼ", "r", "A tapped or lightly rolled r.", ["رجل", "man", 0, "وردة", "rose", 1, "قمر", "moon", 2]),
  seed("ز", "Zāy", "z", "Like z in ‘zoo’.", ["زهرة", "flower", 0, "ميزان", "scale", 2, "خبز", "bread", 2]),
  seed("س", "Sīn", "s", "Like s in ‘sun’.", ["سمك", "fish", 0, "مسجد", "mosque", 1, "شمس", "sun", 2]),
  seed("ش", "Shīn", "sh", "Like sh in ‘ship’.", ["شمس", "sun", 0, "مشمش", "apricot", 1, "عرش", "throne", 2]),
  seed("ص", "Ṣād", "ṣ", "An emphatic, heavier s sound.", ["صباح", "morning", 0, "عصير", "juice", 1, "قفص", "cage", 2]),
  seed("ض", "Ḍād", "ḍ", "An emphatic, heavier d sound.", ["ضفدع", "frog", 0, "خضار", "vegetables", 1, "أرض", "earth", 2]),
  seed("ط", "Ṭāʼ", "ṭ", "An emphatic, heavier t sound.", ["طائر", "bird", 0, "مطار", "airport", 1, "قط", "cat", 1]),
  seed("ظ", "Ẓāʼ", "ẓ", "An emphatic dh sound; often pronounced like emphatic z.", ["ظرف", "envelope", 0, "نظارة", "glasses", 1, "حظ", "luck", 1]),
  seed("ع", "ʿAyn", "ʿ", "A voiced sound formed by tightening the throat; it has no close English match.", ["عين", "eye", 0, "ملعب", "playground", 2, "شارع", "street", 3]),
  seed("غ", "Ghayn", "gh", "A gargled sound, similar to a French r.", ["غزال", "gazelle", 0, "صغير", "small", 1, "فراغ", "empty space", 3]),
  seed("ف", "Fāʼ", "f", "Like f in ‘fish’.", ["فيل", "elephant", 0, "مفتاح", "key", 1, "أنف", "nose", 2]),
  seed("ق", "Qāf", "q", "A deep k-like sound made at the back of the tongue.", ["قمر", "moon", 0, "بقرة", "cow", 1, "سوق", "market", 2]),
  seed("ك", "Kāf", "k", "Like k in ‘kite’.", ["كتاب", "book", 0, "مكتب", "desk", 1, "سمك", "fish", 2]),
  seed("ل", "Lām", "l", "Like l in ‘lamp’.", ["ليمون", "lemon", 0, "قلم", "pen", 1, "جبل", "mountain", 2]),
  seed("م", "Mīm", "m", "Like m in ‘moon’.", ["موز", "banana", 0, "قمر", "moon", 1, "فم", "mouth", 1]),
  seed("ن", "Nūn", "n", "Like n in ‘noon’.", ["نجم", "star", 0, "بنت", "girl", 1, "حصان", "horse", 3]),
  seed("ه", "Hāʼ", "h", "A light h, like h in ‘home’.", ["هدية", "gift", 0, "نهر", "river", 1, "وجه", "face", 2]),
  seed("و", "Wāw", "w / ū", "Like w in ‘water’, or the long vowel ‘oo’.", ["ورد", "roses", 0, "موزة", "banana", 1, "دلو", "bucket", 2]),
  seed("ي", "Yāʼ", "y / ī", "Like y in ‘yes’, or the long vowel ‘ee’.", ["يد", "hand", 0, "بيت", "house", 1, "كرسي", "chair", 3]),
];

export const persianAlphabet: AlphabetLetter[] = [
  seed("ا", "Alef", "â / a", "Usually the long â sound, as in Persian ‘father’.", ["ابر", "cloud", 0, "باران", "rain", 1, "صدا", "sound", 2]),
  seed("ب", "Be", "b", "Like b in ‘book’.", ["باد", "wind", 0, "ابرو", "eyebrow", 1, "شب", "night", 1]),
  seed("پ", "Pe", "p", "Like p in ‘pen’; this letter is not in the Arabic alphabet.", ["پدر", "father", 0, "سپید", "white", 1, "توپ", "ball", 2]),
  seed("ت", "Te", "t", "Like t in ‘table’.", ["تاج", "crown", 0, "کتاب", "book", 1, "دست", "hand", 2]),
  seed("ث", "Se", "s", "Pronounced s in Persian; mostly found in words of Arabic origin.", ["ثانیه", "second", 0, "مؤثر", "effective", 2, "مثلث", "triangle", 3]),
  seed("ج", "Jim", "j", "Like j in ‘jam’.", ["جنگل", "forest", 0, "کجا", "where", 1, "برج", "tower", 2]),
  seed("چ", "Che", "ch", "Like ch in ‘chair’; this letter is not in the Arabic alphabet.", ["چای", "tea", 0, "بچه", "child", 1, "پیچ", "screw", 2]),
  seed("ح", "He-ye jimi", "h", "Pronounced h in Persian; mostly found in Arabic loanwords.", ["حرف", "letter", 0, "محبت", "affection", 1, "صبح", "morning", 2]),
  seed("خ", "Khe", "kh", "A raspy kh, like the ch in Scottish ‘loch’.", ["خانه", "house", 0, "دختر", "girl", 1, "یخ", "ice", 1]),
  seed("د", "Dâl", "d", "Like d in ‘door’.", ["درخت", "tree", 0, "مدرسه", "school", 1, "باد", "wind", 2]),
  seed("ذ", "Zâl", "z", "Pronounced z in Persian; mostly found in Arabic loanwords.", ["ذرت", "corn", 0, "غذا", "food", 1, "لذیذ", "delicious", 3]),
  seed("ر", "Re", "r", "A tapped or lightly rolled r.", ["روز", "day", 0, "برف", "snow", 1, "در", "door", 1]),
  seed("ز", "Ze", "z", "Like z in ‘zoo’.", ["زمین", "earth", 0, "بازار", "bazaar", 2, "سبز", "green", 2]),
  seed("ژ", "Zhe", "zh", "Like the s in ‘measure’; this letter is not in the Arabic alphabet.", ["ژاله", "dew", 0, "مژه", "eyelash", 1, "دژ", "fortress", 1]),
  seed("س", "Sin", "s", "Like s in ‘sun’.", ["سیب", "apple", 0, "پسر", "boy", 1, "خرس", "bear", 2]),
  seed("ش", "Shin", "sh", "Like sh in ‘ship’.", ["شب", "night", 0, "قشنگ", "beautiful", 1, "کفش", "shoe", 2]),
  seed("ص", "Sâd", "s", "Pronounced s in Persian; spelling distinguishes it from س and ث.", ["صدا", "sound", 0, "فصل", "season", 1, "رقص", "dance", 2]),
  seed("ض", "Zâd", "z", "Pronounced z in Persian; mostly found in Arabic loanwords.", ["ضعیف", "weak", 0, "مریضی", "illness", 3, "فیض", "grace", 2]),
  seed("ط", "Tâ", "t", "Pronounced t in Persian; spelling distinguishes it from ت.", ["طلا", "gold", 0, "وطن", "homeland", 1, "خط", "line", 1]),
  seed("ظ", "Zâ", "z", "Pronounced z in Persian; mostly found in Arabic loanwords.", ["ظرف", "dish", 0, "نظر", "opinion", 1, "لفظ", "wording", 2]),
  seed("ع", "Ayn", "ʿ / ʔ", "Often a light glottal sound in Persian and sometimes barely audible.", ["عکس", "photo", 0, "ساعت", "clock", 2, "شمع", "candle", 2]),
  seed("غ", "Ghayn", "gh", "Usually a voiced, gargled gh sound, close to Persian ق.", ["غذا", "food", 0, "باغچه", "garden", 2, "باغ", "garden", 2]),
  seed("ف", "Fe", "f", "Like f in ‘fish’.", ["فیل", "elephant", 0, "دفتر", "notebook", 1, "برف", "snow", 2]),
  seed("ق", "Ghâf", "gh / q", "Usually close to gh in modern Iranian Persian; pronunciation varies by region.", ["قلم", "pen", 0, "دقیق", "precise", 1, "اتاق", "room", 3]),
  seed("ک", "Kâf", "k", "Like k in ‘kite’; Persian uses ک rather than Arabic ك.", ["کتاب", "book", 0, "دکتر", "doctor", 1, "نمک", "salt", 2]),
  seed("گ", "Gâf", "g", "Like g in ‘go’; this letter is not in the Arabic alphabet.", ["گل", "flower", 0, "مگر", "unless", 1, "سگ", "dog", 1]),
  seed("ل", "Lâm", "l", "Like l in ‘lamp’.", ["لب", "lip", 0, "سلام", "hello", 1, "پل", "bridge", 1]),
  seed("م", "Mim", "m", "Like m in ‘moon’.", ["مادر", "mother", 0, "امید", "hope", 1, "بام", "roof", 2]),
  seed("ن", "Nun", "n", "Like n in ‘noon’.", ["نان", "bread", 0, "پنیر", "cheese", 1, "بدن", "body", 2]),
  seed("و", "Vâv", "v / u / o", "Like v in ‘voice’, or the vowels u and o.", ["ورزش", "sport", 0, "جوان", "young", 1, "مو", "hair", 1]),
  seed("ه", "He", "h", "Like h in ‘home’; at a word’s end it can also mark a final vowel.", ["هوا", "air", 0, "بهار", "spring", 1, "ماه", "moon", 2]),
  seed("ی", "Ye", "y / i", "Like y in ‘yes’, or the vowel ee; Persian uses ی without final dots.", ["یخ", "ice", 0, "سیب", "apple", 1, "چای", "tea", 2]),
];

export const alphabetByLanguage: Record<ScriptLanguage, AlphabetLetter[]> = {
  arabic: arabicAlphabet,
  persian: persianAlphabet,
};

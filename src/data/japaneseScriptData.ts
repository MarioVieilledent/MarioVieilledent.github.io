import type { ScriptCourseData, ScriptLetter, ScriptWord } from "../scriptLearningTypes";

type KanaSeed = [kana: string, romanization: string, ...examples: string[]];

const hira: KanaSeed[] = [
  ["あ","a","あさ|morning","あめ|rain","あお|blue"], ["い","i","いぬ|dog","いえ|house","あい|love"], ["う","u","うみ|sea","うえ|above","うた|song"], ["え","e","えき|station","え|picture","こえ|voice"], ["お","o","おと|sound","おかし|sweets","あお|blue"],
  ["か","ka","かさ|umbrella","かお|face","さかな|fish"], ["き","ki","き|tree","きく|chrysanthemum","えき|station"], ["く","ku","くも|cloud","くち|mouth","きく|to listen"], ["け","ke","けさ|this morning","けむり|smoke","いけ|pond"], ["こ","ko","こえ|voice","ここ|here","ねこ|cat"],
  ["さ","sa","さかな|fish","かさ|umbrella","あさ|morning"], ["し","shi","しお|salt","しか|deer","すし|sushi"], ["す","su","すし|sushi","すな|sand","いす|chair"], ["せ","se","せかい|world","せみ|cicada","みせ|shop"], ["そ","so","そら|sky","うそ|lie","みそ|miso"],
  ["た","ta","たこ|octopus","うた|song","たな|shelf"], ["ち","chi","ちず|map","くち|mouth","ちかてつ|subway"], ["つ","tsu","つき|moon","くつ|shoes","なつ|summer"], ["て","te","て|hand","てら|temple","きて|come"], ["と","to","とり|bird","おと|sound","そと|outside"],
  ["な","na","なつ|summer","さかな|fish","はな|flower"], ["に","ni","にく|meat","かに|crab","なに|what"], ["ぬ","nu","いぬ|dog","ぬの|cloth","たぬき|raccoon dog"], ["ね","ne","ねこ|cat","ねつ|fever","たね|seed"], ["の","no","のり|seaweed","ぬの|cloth","きのこ|mushroom"],
  ["は","ha","はな|flower","はこ|box","はし|chopsticks"], ["ひ","hi","ひ|fire","ひと|person","ひる|noon"], ["ふ","fu","ふね|boat","ふゆ|winter","とうふ|tofu"], ["へ","he","へや|room","へそ|navel","へた|unskilled"], ["ほ","ho","ほし|star","ほね|bone","ほこり|dust"],
  ["ま","ma","まど|window","やま|mountain","くるま|car"], ["み","mi","みず|water","みみ|ear","うみ|sea"], ["む","mu","むし|insect","けむり|smoke","さむい|cold"], ["め","me","あめ|rain","め|eye","こめ|rice"], ["も","mo","もり|forest","くも|cloud","もも|peach"],
  ["や","ya","やま|mountain","やさい|vegetables","へや|room"], ["ゆ","yu","ゆき|snow","ゆめ|dream","ふゆ|winter"], ["よ","yo","よる|night","よこ|side","つよい|strong"],
  ["ら","ra","そら|sky","とら|tiger","さくら|cherry blossom"], ["り","ri","とり|bird","のり|seaweed","りす|squirrel"], ["る","ru","よる|night","くるま|car","さる|monkey"], ["れ","re","れきし|history","これ|this","きれい|beautiful"], ["ろ","ro","いろ|color","くろ|black","ふろ|bath"],
  ["わ","wa","わに|crocodile","かわ|river","にわ|garden"], ["を","o","みずをのむ|drink water","ほんをよむ|read a book","そらをみる|look at the sky"], ["ん","n","ほん|book","みかん|mandarin orange","てんき|weather"],
];

const kata: KanaSeed[] = [
  ["ア","a","アイス|ice cream","アジア|Asia","アニメ|anime"], ["イ","i","イギリス|Britain","イタリア|Italy","ワイン|wine"], ["ウ","u","ウール|wool","ウイルス|virus","ウクレレ|ukulele"], ["エ","e","エアコン|air conditioner","エレベーター|elevator","エネルギー|energy"], ["オ","o","オレンジ|orange","オイル|oil","オペラ|opera"],
  ["カ","ka","カメラ|camera","カード|card","カレー|curry"], ["キ","ki","キロ|kilogram","キウイ|kiwi","ケーキ|cake"], ["ク","ku","クラス|class","クリーム|cream","マスク|mask"], ["ケ","ke","ケーキ|cake","ケチャップ|ketchup","バケツ|bucket"], ["コ","ko","コーヒー|coffee","コート|coat","チョコ|chocolate"],
  ["サ","sa","サラダ|salad","サッカー|football","サービス|service"], ["シ","shi","シャツ|shirt","シール|sticker","タクシー|taxi"], ["ス","su","スープ|soup","スキー|skiing","バス|bus"], ["セ","se","セーター|sweater","セット|set","アクセス|access"], ["ソ","so","ソース|sauce","ソファ|sofa","パソコン|personal computer"],
  ["タ","ta","タクシー|taxi","タオル|towel","ギター|guitar"], ["チ","chi","チーズ|cheese","チキン|chicken","チョコ|chocolate"], ["ツ","tsu","ツアー|tour","シャツ|shirt","バケツ|bucket"], ["テ","te","テレビ|television","ホテル|hotel","テニス|tennis"], ["ト","to","トマト|tomato","ノート|notebook","コート|coat"],
  ["ナ","na","バナナ|banana","ナイフ|knife","サウナ|sauna"], ["ニ","ni","テニス|tennis","スニーカー|sneakers","コンビニ|convenience store"], ["ヌ","nu","カヌー|canoe","スヌーカー|snooker","ヌードル|noodles"], ["ネ","ne","ネクタイ|necktie","インターネット|internet","マヨネーズ|mayonnaise"], ["ノ","no","ノート|notebook","ピアノ|piano","カノン|canon"],
  ["ハ","ha","ハンバーガー|hamburger","ハム|ham","ハワイ|Hawaii"], ["ヒ","hi","コーヒー|coffee","ヒント|hint","ヒーター|heater"], ["フ","fu","フォーク|fork","ソフト|software","フランス|France"], ["ヘ","he","ヘルメット|helmet","ヘア|hair","ヘリコプター|helicopter"], ["ホ","ho","ホテル|hotel","ホーム|platform","スマホ|smartphone"],
  ["マ","ma","マスク|mask","トマト|tomato","マンガ|manga"], ["ミ","mi","ミルク|milk","ミント|mint","ビタミン|vitamin"], ["ム","mu","ゲーム|game","ハム|ham","クリーム|cream"], ["メ","me","メニュー|menu","カメラ|camera","アニメ|anime"], ["モ","mo","モデル|model","レモン|lemon","メモ|memo"],
  ["ヤ","ya","タイヤ|tire","ダイヤモンド|diamond","ヤクルト|Yakult"], ["ユ","yu","ユーロ|euro","ユニフォーム|uniform","ユーモア|humor"], ["ヨ","yo","ヨーロッパ|Europe","ヨガ|yoga","マヨネーズ|mayonnaise"],
  ["ラ","ra","ラジオ|radio","サラダ|salad","レストラン|restaurant"], ["リ","ri","リンゴ|apple","クリーム|cream","イタリア|Italy"], ["ル","ru","ホテル|hotel","ミルク|milk","ルール|rule"], ["レ","re","テレビ|television","カレー|curry","レモン|lemon"], ["ロ","ro","ロボット|robot","メロン|melon","ヨーロッパ|Europe"],
  ["ワ","wa","ワイン|wine","シャワー|shower","ハワイ|Hawaii"], ["ヲ","o","ヲタク|geek; enthusiast","エヴァンゲリヲン|Evangelion","ヲシテ|Woshite script"], ["ン","n","パン|bread","レモン|lemon","コンビニ|convenience store"],
];

const romanization: Record<string, string> = {
  ...Object.fromEntries([...hira, ...kata].map(([kana, latin]) => [kana, latin])),
  が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
  ガ:"ga",ギ:"gi",グ:"gu",ゲ:"ge",ゴ:"go",ザ:"za",ジ:"ji",ズ:"zu",ゼ:"ze",ゾ:"zo",ダ:"da",ヂ:"ji",ヅ:"zu",デ:"de",ド:"do",バ:"ba",ビ:"bi",ブ:"bu",ベ:"be",ボ:"bo",パ:"pa",ピ:"pi",プ:"pu",ペ:"pe",ポ:"po",ヴ:"vu",
  ゃ:"ya",ゅ:"yu",ょ:"yo",ぁ:"a",ぃ:"i",ぅ:"u",ぇ:"e",ぉ:"o",ャ:"ya",ュ:"yu",ョ:"yo",ァ:"a",ィ:"i",ゥ:"u",ェ:"e",ォ:"o",
};

const romanize = (text: string) => {
  let result = "";
  let doubleNext = false;
  for (const character of text) {
    if (character === "っ" || character === "ッ") { doubleNext = true; continue; }
    if ("ゃゅょャュョ".includes(character)) {
      result = result.replace(/shi$/, "sh").replace(/chi$/, "ch").replace(/ji$/, "j").replace(/i$/, "");
    }
    if ("ぁぃぅぇぉァィゥェォ".includes(character)) {
      result = result.replace(/fu$/, "f").replace(/[aeiou]$/, "");
    }
    if (character === "ー") { const vowel = result.match(/[aeiou](?!.*[aeiou])/g)?.[0]; if (vowel) result += vowel; continue; }
    const mappedSound = romanization[character] ?? "";
    const sound = "ゃゅょャュョ".includes(character) && /(?:sh|ch|j)$/.test(result) ? mappedSound.slice(1) : mappedSound;
    if (doubleNext && sound) { result += sound[0]; doubleNext = false; }
    result += sound;
  }
  return result;
};

const makeKanaCourse = (seeds: KanaSeed[]): ScriptCourseData => {
  const alphabet: ScriptLetter[] = seeds.map(([letter, transliteration, ...rawExamples]) => ({
    letter,
    name: transliteration,
    transliteration,
    sound: `The Japanese ${transliteration} mora.`,
    forms: [{ label: "Standard form", glyph: letter }],
    examples: rawExamples.map((item) => { const [script, translation] = item.split("|"); return { script, translation }; }),
  }));
  const lessons = Array.from({ length: Math.ceil(seeds.length / 5) }, (_, index) => {
    const group = seeds.slice(index * 5, index * 5 + 5);
    const words: ScriptWord[] = group.flatMap(([, , ...examples]) => examples.map((item) => {
      const [script, translation] = item.split("|");
      return { script, latin: romanize(script), translation };
    }));
    return { letters: group.map(([letter]) => letter), words };
  });
  return { alphabet, lessons };
};

export const hiraganaCourseData = makeKanaCourse(hira);
export const katakanaCourseData = makeKanaCourse(kata);

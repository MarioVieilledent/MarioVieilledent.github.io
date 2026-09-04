import {
  getLanguageDirection,
  type LanguagesAvailable,
} from "../../utils/TranslationContext";

export type BulletGroup = { part: string; items: string[] };

const PlainList = ({
  items,
  language,
  maxItems,
  ordered,
}: {
  items: string[];
  language: LanguagesAvailable;
  maxItems?: number;
  ordered?: boolean;
}) => {
  const visible = maxItems ? items.slice(0, maxItems) : items;
  const remaining = maxItems ? items.length - maxItems : 0;

  return (
    <ul
      className="flex flex-col gap-2"
      lang={language}
      dir={getLanguageDirection(language)}
    >
      {visible.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-base leading-relaxed text-stone-600"
        >
          {ordered ? (
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold text-amber-700">
              {index + 1}
            </span>
          ) : (
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          )}
          <span className={maxItems ? "line-clamp-1" : undefined}>{item}</span>
        </li>
      ))}
      {remaining > 0 && (
        <li className="ps-3 text-xs text-stone-400">{`+${remaining} more`}</li>
      )}
    </ul>
  );
};

const BulletList = ({
  items,
  language,
  maxItems,
  ordered,
}: {
  items: string[] | BulletGroup[];
  language: LanguagesAvailable;
  maxItems?: number;
  ordered?: boolean;
}) => {
  const isGrouped = items.length > 0 && typeof items[0] !== "string";

  if (!isGrouped) {
    return (
      <PlainList
        items={items as string[]}
        language={language}
        maxItems={maxItems}
        ordered={ordered}
      />
    );
  }

  return (
    <div
      className="flex flex-col gap-4"
      lang={language}
      dir={getLanguageDirection(language)}
    >
      {(items as BulletGroup[]).map((group) => (
        <div key={group.part}>
          <div className="script-label mb-1.5 text-sm font-semibold text-stone-500">
            {group.part}
          </div>
          <PlainList
            items={group.items}
            language={language}
            maxItems={maxItems}
            ordered={ordered}
          />
        </div>
      ))}
    </div>
  );
};

export default BulletList;

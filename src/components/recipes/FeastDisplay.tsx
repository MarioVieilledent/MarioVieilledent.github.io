import { useTranslation } from "../../utils/TranslationContext";
import { formatDate } from "../../utils/utils";
import type { Feast, FeastDetails } from "../../utils/validator";
import { useIsMobile } from "../../utils/isMobileHook";
import Ranking from "./Ranking";
import BulletList from "./BulletList";

const FeastDisplay = ({ feast }: { feast: Feast }) => {
  const { language, t } = useTranslation();
  const isMobile = useIsMobile();

  const details = feast[language as keyof Feast]
    ? (feast[language as keyof Feast] as FeastDetails)
    : feast.en;

  const [heroPicture, ...galleryPictures] = feast.pictures;

  return (
    <div className="flex flex-col gap-8">
      {heroPicture ? (
        <img
          src={`/food/${heroPicture}`}
          alt={details.name}
          className={`w-full object-cover ${
            isMobile ? "aspect-[4/3]" : "aspect-[21/9] rounded-3xl"
          }`}
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="mx-auto w-32"
        />
      )}

      <div
        className={
          isMobile ? "flex flex-col gap-8 px-4 pb-8" : "flex flex-col gap-8 pb-8"
        }
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
            <img
              className="h-5 w-5 shrink-0 rounded-full border border-stone-200 object-cover"
              src={`/flags/${feast.countryCode}.svg`}
              alt="Feast flag icon"
            />
            <span>{`#${feast.mealNumber}`}</span>
            <span>·</span>
            <span>{formatDate(feast.date, language)}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-5xl">
            {details.name}
          </h1>
          <Ranking ranking={feast.ranking} />
        </div>

        <section className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">{t("idea")}</h2>
          <BulletList items={details.idea} />
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">{t("menu")}</h2>
          <BulletList items={details.menu} />
        </section>

        {details.notes.length > 0 && (
          <section className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">
              {t("notes")}
            </h2>
            {details.notes.map((note, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-stone-700">
                  {note.title}
                </div>
                <BulletList items={note.description} />
              </div>
            ))}
          </section>
        )}

        {galleryPictures.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-stone-900">
              {t("pictures")}
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {galleryPictures.map((picture, index) => (
                <img
                  key={index}
                  src={`/food/${picture}`}
                  alt={`${details.name} ${index + 2}`}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FeastDisplay;

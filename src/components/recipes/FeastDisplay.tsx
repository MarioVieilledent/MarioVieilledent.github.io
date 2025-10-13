import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "../../utils/TranslationContext";
import { formatDate } from "../../utils/utils";
import type { Feast, FeastDetails } from "../../utils/validator";
import { useIsMobile } from "../../utils/isMobileHook";

const FeastDisplay = ({ feast }: { feast: Feast }) => {
  const { language } = useTranslation();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const details = feast[language as keyof Feast]
    ? (feast[language as keyof Feast] as FeastDetails)
    : feast.en;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className={isMobile ? "flex flex-col gap-8 p-4" : "flex flex-col gap-8"}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="text-2xl">{`#${feast.mealNumber}`}</div>
          <div className="text-md text-gray-600">
            {formatDate(feast.date, language)}
          </div>
          <div className="text-md bg-gray-100 rounded-full p-2">{`${feast.ranking}/10`}</div>
        </div>

        <div className="flex items-center gap-4">
          <img
            className="w-16 border-1"
            src={`/flags/${feast.countryCode}.svg`}
            alt="Feast flag icon"
          />
          <div className="text-4xl font-light">{details.name}</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xl">{t("idea")}</div>
          <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
            {details.idea.map((str) => `\t- ${str}`).join("\n")}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xl">{t("menu")}</div>
          <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
            {details.menu.map((str) => `\t- ${str}`).join("\n")}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xl">{t("notes")}</div>
          {details.notes.map((note, index) => (
            <Fragment key={index}>
              <div className="text-lg text-gray-600">{note.title}</div>
              <div key={index} className="text-md">
                <div className="flex items-center gap-4 text-md whitespace-pre-line text-ellipsis overflow-hidden text-start line-clamp-1">
                  {note.description.map((str) => `\t- ${str}`).join("\n")}
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="text-xl">{t("pictures")}</div>
      </div>

      {feast.pictures.length > 0 ? (
        feast.pictures.map((picture, index) => (
          <img
            key={index}
            src={`/food/${picture}`}
            alt={`Feast picture ${index + 1}`}
            className="w-full"
          />
        ))
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="w-32 h-32 self-center"
        />
      )}
    </div>
  );
};

export default FeastDisplay;

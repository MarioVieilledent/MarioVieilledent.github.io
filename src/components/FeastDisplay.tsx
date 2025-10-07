import { Fragment } from "react/jsx-runtime";
import { RECIPES_PATH } from "../utils/routes";
import { useTranslation } from "../utils/TranslationContext";
import { formatDate } from "../utils/utils";
import NavigateTo from "./NavigateTo";
import type { Feast, FeastDetails } from "../utils/validator";

const FeastDisplay = ({ feast }: { feast: Feast }) => {
  const { language } = useTranslation();
  const { t } = useTranslation();

  const details = feast[language as keyof Feast]
    ? (feast[language as keyof Feast] as FeastDetails)
    : feast.en;

  return (
    <div className="flex flex-col gap-4 w-full">
      <NavigateTo location={`${RECIPES_PATH}/feasts`} />
      {feast.pictures.length > 0 ? (
        <img
          src={`/food/${feast.pictures[0]}`}
          alt="Feast picture"
          className="w-full"
        />
      ) : (
        <img
          src="/noPicturePlaceholder.png"
          alt="No picture placeholder"
          className="w-32 h-32 self-center"
        />
      )}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center gap-4">
          <div className="text-2xl">{`#${feast.mealNumber}`}</div>
          <div className="text-md text-gray-600">
            {formatDate(feast.date, language)}
          </div>
          <div className="text-md bg-gray-100 rounded-full p-2">{`${feast.ranking}/10`}</div>
        </div>

        <div className="flex items-center gap-4">
          <img
            className="w-8"
            src={`/flags/${feast.countryCode}.svg`}
            alt="Feast flag icon"
          />
          <div className="text-2xl">{details.name}</div>
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
      </div>
    </div>
  );
};

export default FeastDisplay;

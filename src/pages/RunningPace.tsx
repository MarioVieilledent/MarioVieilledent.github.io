import { useState, type ChangeEvent } from "react";
import {
  LuActivity,
  LuChevronDown,
  LuChevronUp,
  LuInfinity,
  LuRuler,
  LuTimer,
} from "react-icons/lu";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";

const SPEED_RANGE_KMH = {
  min: 0,
  max: 30,
  step: 0.1,
  initial: 12,
} as const;

const PACE_STEP_SECONDS = 5;

const TIME_CONSTANTS = {
  minutesPerHour: 60,
  secondsPerHour: 3_600,
  millisecondsPerSecond: 1_000,
  metersPerKilometer: 1_000,
} as const;

const TRACK_LANES = [
  { lane: 1, lengthMeters: 400 },
  { lane: 2, lengthMeters: 407.04 },
  { lane: 3, lengthMeters: 414.7 },
  { lane: 4, lengthMeters: 422.37 },
  { lane: 5, lengthMeters: 430.03 },
  { lane: 6, lengthMeters: 437.7 },
  { lane: 7, lengthMeters: 445.36 },
  { lane: 8, lengthMeters: 453.03 },
] as const;

const TRACK_SPLITS = [
  { label: "200 m", lapFraction: 0.5 },
  { label: "400 m", lapFraction: 1 },
] as const;

const RACE_DISTANCES = [
  { label: "400 m", distanceMeters: 400 },
  { label: "1 km", distanceMeters: 1_000 },
  { label: "5 km", distanceMeters: 5_000 },
  { label: "10 km", distanceMeters: 10_000 },
  { label: "20 km", distanceMeters: 20_000 },
  { label: "Half marathon", distanceMeters: 21_097.5 },
  { label: "Marathon", distanceMeters: 42_195 },
] as const;

const RACE_TIME_POINTS = [
  { label: "Halfway", raceFraction: 0.5 },
  { label: "Finish", raceFraction: 1 },
] as const;

type StepDirection = 1 | -1;

const clampSpeed = (speed: number) =>
  Math.min(SPEED_RANGE_KMH.max, Math.max(SPEED_RANGE_KMH.min, speed));

const snapInDirection = (
  value: number,
  step: number,
  direction: StepDirection,
) => {
  const stepPosition = value / step;
  const closestStep = Math.round(stepPosition);
  const isAlreadyOnStep = Math.abs(stepPosition - closestStep) < 1e-9;
  const targetStep = isAlreadyOnStep
    ? closestStep + direction
    : direction === 1
      ? Math.ceil(stepPosition)
      : Math.floor(stepPosition);

  return Number((targetStep * step).toFixed(10));
};

const speedToPaceMinutes = (speedKmh: number) =>
  speedKmh === 0 ? Infinity : TIME_CONSTANTS.minutesPerHour / speedKmh;

const durationSeconds = (distanceMeters: number, speedKmh: number) =>
  speedKmh === 0
    ? Infinity
    : (distanceMeters * TIME_CONSTANTS.secondsPerHour) /
      (speedKmh * TIME_CONSTANTS.metersPerKilometer);

const formatSpeed = (speedKmh: number) =>
  Number(speedKmh.toFixed(3)).toString();

const formatPace = (speedKmh: number) => {
  const paceMinutes = speedToPaceMinutes(speedKmh);
  if (!Number.isFinite(paceMinutes)) return "∞";

  const totalCentiseconds = Math.round(paceMinutes * 60 * 100);
  const minutes = Math.floor(totalCentiseconds / 6_000);
  const seconds = Math.floor((totalCentiseconds % 6_000) / 100);
  const centiseconds = totalCentiseconds % 100;

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
    .toString()
    .padStart(2, "0")}`;
};

const parsePaceMinutes = (input: string): number | null => {
  const normalized = input.trim().toLowerCase();
  if (normalized === "∞" || normalized === "infinity") return Infinity;

  const clockMatch = normalized.match(
    /^(\d+(?:\.\d+)?)\s*:\s*(\d{0,2}(?:\.\d{0,3})?)$/,
  );
  if (clockMatch) {
    const minutes = Number(clockMatch[1]);
    const seconds = clockMatch[2] === "" ? 0 : Number(clockMatch[2]);
    if (seconds >= 60) return null;
    const pace = minutes + seconds / 60;
    return pace > 0 ? pace : null;
  }

  const decimalMinutes = Number(normalized);
  return Number.isFinite(decimalMinutes) && decimalMinutes > 0
    ? decimalMinutes
    : null;
};

const toRoundedMilliseconds = (seconds: number) =>
  Math.round(seconds * TIME_CONSTANTS.millisecondsPerSecond);

const formatLapTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "∞";

  const totalMilliseconds = toRoundedMilliseconds(seconds);
  const wholeSeconds = Math.floor(
    totalMilliseconds / TIME_CONSTANTS.millisecondsPerSecond,
  );
  const milliseconds = totalMilliseconds % TIME_CONSTANTS.millisecondsPerSecond;

  return `${wholeSeconds} s ${milliseconds.toString().padStart(3, "0")} ms`;
};

const formatRaceTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "∞";

  const totalMilliseconds = toRoundedMilliseconds(seconds);
  const milliseconds = totalMilliseconds % TIME_CONSTANTS.millisecondsPerSecond;
  const totalSeconds = Math.floor(
    totalMilliseconds / TIME_CONSTANTS.millisecondsPerSecond,
  );
  const hours = Math.floor(totalSeconds / TIME_CONSTANTS.secondsPerHour);
  const minutes = Math.floor(
    (totalSeconds % TIME_CONSTANTS.secondsPerHour) / 60,
  );
  const remainingSeconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")} h ${minutes
    .toString()
    .padStart(2, "0")} min ${remainingSeconds
    .toString()
    .padStart(2, "0")} s ${milliseconds.toString().padStart(3, "0")} ms`;
};

const RunningPace = () => {
  const [speedKmh, setSpeedKmh] = useState<number>(SPEED_RANGE_KMH.initial);
  const [speedInput, setSpeedInput] = useState(
    formatSpeed(SPEED_RANGE_KMH.initial),
  );
  const [paceInput, setPaceInput] = useState(
    formatPace(SPEED_RANGE_KMH.initial),
  );

  const setFromSpeed = (nextSpeed: number) => {
    const normalizedSpeed = clampSpeed(nextSpeed);
    setSpeedKmh(normalizedSpeed);
    setSpeedInput(formatSpeed(normalizedSpeed));
    setPaceInput(formatPace(normalizedSpeed));
  };

  const stepSpeed = (direction: StepDirection) => {
    setFromSpeed(
      snapInDirection(speedKmh, SPEED_RANGE_KMH.step, direction),
    );
  };

  const stepPace = (direction: StepDirection) => {
    const minimumPaceSeconds =
      TIME_CONSTANTS.secondsPerHour / SPEED_RANGE_KMH.max;
    const maximumFinitePaceSeconds =
      TIME_CONSTANTS.secondsPerHour / SPEED_RANGE_KMH.step;

    if (speedKmh === 0) {
      if (direction === 1) return;
      setFromSpeed(
        TIME_CONSTANTS.secondsPerHour / maximumFinitePaceSeconds,
      );
      return;
    }

    const currentPaceSeconds = TIME_CONSTANTS.secondsPerHour / speedKmh;
    const nextPaceSeconds = snapInDirection(
      currentPaceSeconds,
      PACE_STEP_SECONDS,
      direction,
    );

    if (nextPaceSeconds > maximumFinitePaceSeconds) {
      setFromSpeed(0);
      return;
    }

    setFromSpeed(
      TIME_CONSTANTS.secondsPerHour /
        Math.max(minimumPaceSeconds, nextPaceSeconds),
    );
  };

  const handleSpeedInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSpeedInput(value);

    if (value.trim() === "") return;
    const nextSpeed = Number(value);
    if (
      Number.isFinite(nextSpeed) &&
      nextSpeed >= SPEED_RANGE_KMH.min &&
      nextSpeed <= SPEED_RANGE_KMH.max
    ) {
      setSpeedKmh(nextSpeed);
      setPaceInput(formatPace(nextSpeed));
    }
  };

  const handlePaceInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaceInput(value);

    const paceMinutes = parsePaceMinutes(value);
    if (paceMinutes === null) return;

    const nextSpeed = clampSpeed(
      Number.isFinite(paceMinutes)
        ? TIME_CONSTANTS.minutesPerHour / paceMinutes
        : 0,
    );
    setSpeedKmh(nextSpeed);
    setSpeedInput(formatSpeed(nextSpeed));
  };

  const infinity = speedKmh === 0;

  return (
    <>
      <Navbar />
      <PageWrapper>
        <main
          lang="en"
          dir="ltr"
          className="flex flex-col gap-10 px-4 pb-16 pt-10 sm:px-0"
        >
          <header className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-800">
              Running calculator
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Pace & speed converter
            </h1>
            <p className="mt-3 max-w-2xl text-stone-600">
              Convert running pace to speed, then see exact lap splits and race
              finish times at the same effort.
            </p>
          </header>

          <div className="flex flex-col gap-4">
              <section
                aria-labelledby="converter-heading"
              className="rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5"
            >
              <div className="p-5 sm:p-7">
                <div className="mb-7 flex items-center gap-3">
                  <div className="rounded-2xl bg-rose-100 p-3 text-rose-800">
                    <LuActivity size="24" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      id="converter-heading"
                      className="text-xl font-semibold text-stone-950"
                    >
                      Choose your pace
                    </h2>
                    <p className="mt-0.5 text-sm text-stone-500">
                      Enter either value or drag the slider.
                    </p>
                  </div>
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex min-w-0 flex-col gap-2">
                    <label
                      htmlFor="pace-input"
                      className="text-sm font-semibold text-stone-700"
                    >
                      Pace <span className="font-normal text-stone-500">(min/km)</span>
                    </label>
                    <div className="flex min-w-0 gap-2">
                      <input
                        id="pace-input"
                        type="text"
                        inputMode="decimal"
                        value={paceInput}
                        onChange={handlePaceInput}
                        onBlur={() => setPaceInput(formatPace(speedKmh))}
                        aria-describedby="pace-input-hint"
                        placeholder="5:00.00"
                        className="h-14 min-w-0 grow rounded-xl border border-stone-300 bg-white px-4 text-lg font-semibold text-stone-950 outline-none transition focus:border-rose-700 focus:ring-4 focus:ring-rose-100"
                      />
                      <div className="grid h-14 w-11 shrink-0 grid-rows-2 overflow-hidden rounded-xl border border-stone-300 bg-white">
                        <button
                          type="button"
                          onClick={() => stepPace(1)}
                          disabled={infinity}
                          aria-label="Move pace up to the next 5-second step"
                          title="Next 5-second pace step"
                          className="flex items-center justify-center border-b border-stone-200 text-stone-600 transition hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <LuChevronUp aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepPace(-1)}
                          disabled={speedKmh >= SPEED_RANGE_KMH.max}
                          aria-label="Move pace down to the previous 5-second step"
                          title="Previous 5-second pace step"
                          className="flex items-center justify-center text-stone-600 transition hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <LuChevronDown aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2">
                    <label
                      htmlFor="speed-input"
                      className="text-sm font-semibold text-stone-700"
                    >
                      Speed <span className="font-normal text-stone-500">(km/h)</span>
                    </label>
                    <div className="flex min-w-0 gap-2">
                      <input
                        id="speed-input"
                        type="text"
                        inputMode="decimal"
                        value={speedInput}
                        onChange={handleSpeedInput}
                        onBlur={() => setFromSpeed(speedKmh)}
                        className="h-14 min-w-0 grow rounded-xl border border-stone-300 bg-white px-4 text-lg font-semibold text-stone-950 outline-none transition focus:border-rose-700 focus:ring-4 focus:ring-rose-100"
                      />
                      <div className="grid h-14 w-11 shrink-0 grid-rows-2 overflow-hidden rounded-xl border border-stone-300 bg-white">
                        <button
                          type="button"
                          onClick={() => stepSpeed(1)}
                          disabled={speedKmh >= SPEED_RANGE_KMH.max}
                          aria-label="Move speed up to the next 0.1 kilometre per hour step"
                          title="Next 0.1 km/h step"
                          className="flex items-center justify-center border-b border-stone-200 text-stone-600 transition hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <LuChevronUp aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepSpeed(-1)}
                          disabled={speedKmh <= SPEED_RANGE_KMH.min}
                          aria-label="Move speed down to the previous 0.1 kilometre per hour step"
                          title="Previous 0.1 km/h step"
                          className="flex items-center justify-center text-stone-600 transition hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <LuChevronDown aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <label
                        htmlFor="speed-slider"
                        className="text-sm font-semibold text-stone-800"
                      >
                        Speed selector
                      </label>
                      <p className="mt-0.5 text-xs text-stone-500">
                        Drag to adjust both values
                      </p>
                    </div>
                    <output
                      htmlFor="speed-slider"
                      aria-live="polite"
                      className="block shrink-0 rounded-xl border border-rose-200 bg-rose-100 px-3 py-2 text-right text-sm font-semibold text-rose-950"
                    >
                      {formatSpeed(speedKmh)} km/h
                      <span className="block text-xs font-medium text-rose-700">
                        {formatPace(speedKmh)} min/km
                      </span>
                    </output>
                  </div>
                  <input
                    id="speed-slider"
                    type="range"
                    min={SPEED_RANGE_KMH.min}
                    max={SPEED_RANGE_KMH.max}
                    step={SPEED_RANGE_KMH.step}
                    value={speedKmh}
                    onChange={(event) => setFromSpeed(Number(event.target.value))}
                    className="running-speed-slider block w-full cursor-pointer"
                  />
                  <div className="mt-3 flex justify-between text-xs font-medium text-stone-500">
                    <span>{SPEED_RANGE_KMH.min} km/h</span>
                    <span>{SPEED_RANGE_KMH.max} km/h</span>
                  </div>
                </div>
                <p id="pace-input-hint" className="mt-3 text-xs text-stone-500">
                  Pace accepts clock format (5:30), decimal minutes (5.5), or ∞.
                </p>
              </div>
            </section>

          {infinity && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-950">
              <LuInfinity
                className="mt-0.5 shrink-0 text-rose-700"
                size="22"
                aria-hidden="true"
              />
              <p className="text-sm">
                At 0 km/h, pace and completion time are infinite. Calculated
                results below use <strong>∞</strong> instead of an invalid
                number.
              </p>
            </div>
          )}
          </div>

          <section aria-labelledby="track-heading">
            <div className="mb-4 flex items-center gap-3">
              <LuActivity
                className="text-rose-800"
                size="24"
                aria-hidden="true"
              />
              <div>
                <h2
                  id="track-heading"
                  className="text-2xl font-semibold text-stone-900"
                >
                  400 m track lanes
                </h2>
                <p className="text-sm text-stone-500">
                  Half- and full-lap times along each lane’s measurement line.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full min-w-[44rem] border-collapse text-left">
                <thead className="running-results-header text-sm">
                  <tr className="bg-rose-950">
                    <th
                      rowSpan={2}
                      scope="col"
                      className="px-5 py-3.5 font-semibold align-middle"
                    >
                      Lane
                    </th>
                    <th
                      rowSpan={2}
                      scope="col"
                      className="px-5 py-3.5 font-semibold align-middle"
                    >
                      Lap length
                    </th>
                    <th
                      colSpan={TRACK_SPLITS.length}
                      scope="colgroup"
                      className="border-l border-rose-800 px-5 py-2 text-center font-semibold"
                    >
                      Elapsed time
                    </th>
                  </tr>
                  <tr className="bg-rose-900">
                    {TRACK_SPLITS.map(({ label }) => (
                      <th
                        key={label}
                        scope="col"
                        className="border-l border-rose-800 px-5 py-2.5 font-semibold"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {TRACK_LANES.map(({ lane, lengthMeters }) => (
                    <tr
                      key={lane}
                      className="transition-colors hover:bg-rose-50/60"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-semibold text-stone-900"
                      >
                        {lane}
                      </th>
                      <td className="px-5 py-4 text-stone-600">
                        {lengthMeters.toFixed(2)} m
                      </td>
                      {TRACK_SPLITS.map(({ label, lapFraction }) => (
                        <td
                          key={label}
                          className="px-5 py-4 font-mono text-sm font-semibold tabular-nums text-rose-900"
                        >
                          {formatLapTime(
                            durationSeconds(
                              lengthMeters * lapFraction,
                              speedKmh,
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="distance-heading">
            <div className="mb-4 flex items-center gap-3">
              <LuTimer className="text-rose-800" size="24" aria-hidden="true" />
              <div>
                <h2
                  id="distance-heading"
                  className="text-2xl font-semibold text-stone-900"
                >
                  Race finish times
                </h2>
                <p className="text-sm text-stone-500">
                  Continuous running at {formatSpeed(speedKmh)} km/h (
                  {formatPace(speedKmh)} min/km).
                </p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full min-w-[48rem] border-collapse text-left">
                <thead className="running-results-header text-sm">
                  <tr className="bg-rose-950">
                    <th
                      rowSpan={2}
                      scope="col"
                      className="px-5 py-3.5 font-semibold align-middle"
                    >
                      Race distance
                    </th>
                    <th
                      rowSpan={2}
                      scope="col"
                      className="px-5 py-3.5 font-semibold align-middle"
                    >
                      Exact length
                    </th>
                    <th
                      colSpan={RACE_TIME_POINTS.length}
                      scope="colgroup"
                      className="border-l border-rose-800 px-5 py-2 text-center font-semibold"
                    >
                      Elapsed time
                    </th>
                  </tr>
                  <tr className="bg-rose-900">
                    {RACE_TIME_POINTS.map(({ label }) => (
                      <th
                        key={label}
                        scope="col"
                        className="border-l border-rose-800 px-5 py-2.5 font-semibold"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {RACE_DISTANCES.map(({ label, distanceMeters }) => (
                    <tr
                      key={label}
                      className="transition-colors hover:bg-rose-50/60"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-semibold text-stone-900"
                      >
                        {label}
                      </th>
                      <td className="px-5 py-4 text-stone-600">
                        {distanceMeters.toLocaleString("en-US", {
                          maximumFractionDigits: 1,
                        })}{" "}
                        m
                      </td>
                      {RACE_TIME_POINTS.map(({ label, raceFraction }) => (
                        <td
                          key={label}
                          className="px-5 py-4 font-mono text-sm font-semibold tabular-nums text-rose-900"
                        >
                          {formatRaceTime(
                            durationSeconds(
                              distanceMeters * raceFraction,
                              speedKmh,
                            ),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            aria-labelledby="constants-heading"
            className="border-t border-stone-200 pt-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <LuRuler className="text-rose-800" size="24" aria-hidden="true" />
              <div>
                <h2
                  id="constants-heading"
                  className="text-xl font-semibold text-stone-900"
                >
                  Static calculation constants
                </h2>
                <p className="text-sm text-stone-500">
                  Every metric on this page is calculated from the values below.
                </p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <h3 className="font-semibold text-stone-900">Speed range</h3>
                <dl className="mt-3 space-y-2 text-sm text-stone-600">
                  <div className="flex justify-between gap-4">
                    <dt>Minimum</dt>
                    <dd className="font-mono">{SPEED_RANGE_KMH.min} km/h</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Maximum</dt>
                    <dd className="font-mono">{SPEED_RANGE_KMH.max} km/h</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Slider step</dt>
                    <dd className="font-mono">{SPEED_RANGE_KMH.step} km/h</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Pace button step</dt>
                    <dd className="font-mono">{PACE_STEP_SECONDS} seconds</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Unit constants</dt>
                    <dd className="text-right font-mono">
                      {TIME_CONSTANTS.minutesPerHour} min/h ·{" "}
                      {TIME_CONSTANTS.secondsPerHour.toLocaleString("en-US")}{" "}
                      s/h ·{" "}
                      {TIME_CONSTANTS.millisecondsPerSecond.toLocaleString(
                        "en-US",
                      )}{" "}
                      ms/s ·{" "}
                      {TIME_CONSTANTS.metersPerKilometer.toLocaleString(
                        "en-US",
                      )}{" "}
                      m/km
                    </dd>
                  </div>
                </dl>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <h3 className="font-semibold text-stone-900">
                  Track lap lengths
                </h3>
                <p className="mt-3 font-mono text-sm leading-6 text-stone-600">
                  {TRACK_LANES.map(
                    ({ lane, lengthMeters }) =>
                      `L${lane}: ${lengthMeters.toFixed(2)} m`,
                  ).join(" · ")}
                </p>
                <p className="mt-3 font-mono text-sm leading-6 text-stone-600">
                  Splits: {TRACK_SPLITS.map(({ label, lapFraction }) => label + ": " + lapFraction + " lap").join(" · ")}
                </p>
              </article>
              <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <h3 className="font-semibold text-stone-900">Race distances</h3>
                <p className="mt-3 font-mono text-sm leading-6 text-stone-600">
                  {RACE_DISTANCES.map(
                    ({ label, distanceMeters }) =>
                      `${label}: ${distanceMeters} m`,
                  ).join(" · ")}
                </p>
                <p className="mt-3 font-mono text-sm leading-6 text-stone-600">
                  Time points: {RACE_TIME_POINTS.map(({ label, raceFraction }) => label + ": " + raceFraction + " race").join(" · ")}
                </p>
              </article>
            </div>
            <p className="mt-5 text-xs leading-5 text-stone-500">
              Track lengths follow an eight-lane, 400 m standard track measured
              0.30 m from the inner kerb in lane 1 and 0.20 m from the inner
              lane line in lanes 2–8. Results assume constant speed and are
              rounded to the nearest millisecond.
            </p>
          </section>
        </main>
      </PageWrapper>
    </>
  );
};

export default RunningPace;

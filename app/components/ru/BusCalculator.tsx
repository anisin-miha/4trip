// app/components/BusCalculator.tsx
"use client";
import { useState } from "react";

type BusClass = "mini" | "mid" | "big";

// УСЛОВНЫЕ тарифы продажи (уточните позже)
const RATES: Record<BusClass, number> = {
  mini: 2200, // микроавтобус (18–20 мест)
  mid: 2500, // средний (30–35 мест)
  big: 2800, // большой (45–50 мест)
};

// ЛОГИКА ТАРИФИКАЦИИ
const MIN_WORK_HOURS = 4; // минимум рабочих часов на маршруте
const DELIVERY_HOURS = 2; // подача фиксированно
const KM_PER_EXTRA_HOUR = 20; // за каждые 20 км за МКАД — +1 час

export default function BusCalculator() {
  const [bus, setBus] = useState<BusClass>("mini");

  // рабочие часы на маршруте (без учёта подачи)
  const [workHours, setWorkHours] = useState<number>(4);

  // выезд за МКАД и километраж вне МКАД
  const [outOfMkad, setOutOfMkad] = useState<boolean>(false);
  const [kmOutside, setKmOutside] = useState<number>(0);

  const rate = RATES[bus];

  const billedWorkHours = Math.max(workHours, MIN_WORK_HOURS);
  const extraOutsideHours = outOfMkad
    ? Math.ceil(Math.max(0, kmOutside) / KM_PER_EXTRA_HOUR)
    : 0;

  const billedTotalHours = billedWorkHours + DELIVERY_HOURS + extraOutsideHours;

  const total = billedTotalHours * rate;

  const nf = (n: number) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(n));

  return (
    <div className="space-y-4">
      {/* Тип автобуса */}
      <div>
        <label className="block text-sm font-medium mb-1">Класс автобуса</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setBus("mini")}
            className={`px-3 py-2 border rounded-md ${
              bus === "mini" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Микро (18–20)
          </button>
          <button
            type="button"
            onClick={() => setBus("mid")}
            className={`px-3 py-2 border rounded-md ${
              bus === "mid" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Средний (30–35)
          </button>
          <button
            type="button"
            onClick={() => setBus("big")}
            className={`px-3 py-2 border rounded-md ${
              bus === "big" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Большой (45–50)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Тариф: {nf(RATES[bus])} ₽/час. Минимум к оплате — 6 ч (4 ч работа + 2
          ч подача).
        </p>
      </div>

      {/* Рабочие часы на маршруте */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Рабочие часы на маршруте (без подачи): {workHours} ч
        </label>
        <input
          type="range"
          min={MIN_WORK_HOURS}
          max={18}
          step={1}
          value={workHours}
          onChange={(e) => setWorkHours(parseInt(e.target.value, 10))}
          className="w-full"
          aria-label="Рабочие часы на маршруте"
        />
        <p className="text-xs text-gray-500 mt-1">
          К оплате возьмём не меньше {MIN_WORK_HOURS} ч работы +{" "}
          {DELIVERY_HOURS} ч подачи.
        </p>
      </div>

      {/* Выезд за МКАД */}
      <div className="space-y-2">
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={outOfMkad}
            onChange={(e) => setOutOfMkad(e.target.checked)}
            aria-label="Выезд за МКАД"
          />
          Выезд за МКАД
        </label>

        {outOfMkad && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Километров за МКАД: {kmOutside} км
            </label>
            <input
              type="range"
              min={0}
              max={300}
              step={10}
              value={kmOutside}
              onChange={(e) => setKmOutside(parseInt(e.target.value, 10))}
              className="w-full"
              aria-label="Километраж за МКАД"
            />
            <p className="text-xs text-gray-500 mt-1">
              Каждые {KM_PER_EXTRA_HOUR} км вне МКАД = +1 час к оплате. Сейчас:{" "}
              {extraOutsideHours} ч.
            </p>
          </div>
        )}

        {/* TODO: вместо ручного км добавить ввод точек А, B, C... и автоподсчёт км за МКАД по карте */}
      </div>

      {/* Итоговая калькуляция */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span>
            Ставка (
            {bus === "mini" ? "микро" : bus === "mid" ? "средний" : "большой"}):
          </span>
          <b>{nf(rate)} ₽/ч</b>
        </div>
        <div className="flex items-center justify-between">
          <span>Рабочие часы (минимум {MIN_WORK_HOURS}):</span>
          <b>{billedWorkHours} ч</b>
        </div>
        <div className="flex items-center justify-between">
          <span>Подача:</span>
          <b>{DELIVERY_HOURS} ч</b>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <span>За МКАД{outOfMkad ? ` (${kmOutside} км)` : ""}:</span>
          <b>{outOfMkad ? `${extraOutsideHours} ч` : "0 ч"}</b>
        </div>

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <span>Часов к оплате итого:</span>
          <b>{billedTotalHours} ч</b>
        </div>
        <div className="flex items-center justify-between text-lg">
          <span>Итого ориентировочно:</span>
          <b>{nf(total)} ₽</b>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Расчёт ориентировочный. Финальная смета зависит от маршрута, простоев
          и километров за МКАД.
        </p>
      </div>
    </div>
  );
}

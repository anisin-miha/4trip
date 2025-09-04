import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Русская морфология (очень упрощённо):
// Склоняем географические названия после предлога «в» в винительный падеж.
// -а -> -у, -я -> -ю, -ия -> -ию. Остальные — без изменений (для неодушевлённых).
export function ruAccusativeAfterV(name: string): string {
  // Отделяем завершающие пробелы/закрывающие знаки, чтобы сохранить их
  let end = name.length;
  while (end > 0) {
    const ch = name[end - 1];
    if (ch === " " || ch === "\t" || ch === "\n" || ch === ")" || ch === "]" || ch === '"' || ch === "'" || ch === "»") {
      end--;
    } else {
      break;
    }
  }
  const tail = name.slice(end);
  let head = name.slice(0, end);

  // Простые замены окончания последнего слова (кириллица): -ия -> -ию, -я -> -ю, -а -> -у
  const lower2 = head.slice(-2);
  const lower1 = head.slice(-1);

  if (/^[А-ЯЁа-яё]{2}$/u.test(lower2) && lower2.toLowerCase() === "ия") {
    head = head.slice(0, -2) + "ию";
  } else if (/^[А-ЯЁа-яё]$/u.test(lower1)) {
    const l = lower1.toLowerCase();
    if (l === "я") head = head.slice(0, -1) + "ю";
    else if (l === "а") head = head.slice(0, -1) + "у";
  }

  return head + tail;
}

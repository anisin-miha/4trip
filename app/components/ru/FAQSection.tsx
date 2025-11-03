"use client";

import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FAQSectionItem = {
  id?: string;
  question: string;
  answer: ReactNode;
};

type HeadingTag = "h2" | "h3" | "h4" | "h5";

export type FAQSectionProps = {
  items: readonly FAQSectionItem[];
  id?: string;
  title?: string;
  headingTag?: HeadingTag;
  /**
   * Additional class applied to the heading element. Can be used to change alignment.
   */
  headingClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  containerClassName?: string | null;
  listClassName?: string;
  itemClassName?: string;
  summaryClassName?: string;
  answerClassName?: string;
  chevron?: ReactNode;
  emptyFallback?: ReactNode;
};

const DEFAULT_WRAPPER_CLASSES = "py-16 bg-white scroll-mt-24";
const DEFAULT_CONTAINER_CLASSES = "container mx-auto px-4";
const DEFAULT_LIST_CLASSES = "space-y-6 max-w-3xl mx-auto";
const DEFAULT_ITEM_CLASSES = "group rounded-xl border p-4 open:shadow";
const DEFAULT_SUMMARY_CLASSES =
  "cursor-pointer select-none text-lg font-semibold flex items-center justify-between";
const DEFAULT_ANSWER_CLASSES = "mt-3 text-gray-700";

function renderAnswer(answer: ReactNode, answerClassName?: string) {
  if (typeof answer === "string") {
    return (
      <div
        className={cn(
          DEFAULT_ANSWER_CLASSES,
          "whitespace-pre-line",
          answerClassName,
        )}
      >
        {answer}
      </div>
    );
  }

  return (
    <div className={cn(DEFAULT_ANSWER_CLASSES, answerClassName)}>{answer}</div>
  );
}

export function FAQSection({
  items,
  id,
  title = "Часто задаваемые вопросы",
  headingTag = "h2",
  headingClassName,
  as = "section",
  className,
  containerClassName,
  listClassName,
  itemClassName,
  summaryClassName,
  answerClassName,
  chevron,
  emptyFallback = null,
}: FAQSectionProps) {
  if (!items || items.length === 0) {
    return <>{emptyFallback}</>;
  }

  const Wrapper = as;
  const Heading = headingTag;
  const shouldWrapContainer = containerClassName !== null;
  const resolvedContainerClassName =
    containerClassName === undefined
      ? DEFAULT_CONTAINER_CLASSES
      : containerClassName || undefined;

  const content = (
    <>
      {title ? (
        <Heading
          className={cn(
            "text-3xl font-bold text-center mb-12",
            headingClassName,
          )}
        >
          {title}
        </Heading>
      ) : null}
      <div className={cn(DEFAULT_LIST_CLASSES, listClassName)}>
        {items.map((item, idx) => {
          const key = item.id ?? `${idx}-${item.question}`;
          return (
            <details
              key={key}
              className={cn(DEFAULT_ITEM_CLASSES, itemClassName)}
            >
              <summary
                className={cn(DEFAULT_SUMMARY_CLASSES, summaryClassName)}
              >
                <span>{item.question}</span>
                <span className="ml-3 text-gray-400 transition group-open:rotate-180">
                  {chevron ?? "▾"}
                </span>
              </summary>
              {renderAnswer(item.answer, answerClassName)}
            </details>
          );
        })}
      </div>
    </>
  );

  return (
    <Wrapper id={id} className={cn(DEFAULT_WRAPPER_CLASSES, className)}>
      {shouldWrapContainer ? (
        <div className={cn(resolvedContainerClassName)}>{content}</div>
      ) : (
        content
      )}
    </Wrapper>
  );
}

export default FAQSection;

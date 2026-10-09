"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { RATING_MAX } from "@/lib/questions";
import type { AnswerValue, PublicForm } from "@/lib/types";
import { validateAnswer } from "@/lib/validate";
import { FormFooter } from "@/components/form/FormFooter";
import { OkButton } from "@/components/form/OkButton";
import { QuestionField } from "@/components/form/QuestionField";
import { QuestionDescription, QuestionNumber, QuestionTitle } from "@/components/form/QuestionHeader";
import { OPTION_KEYS, THEME } from "@/components/form/theme";
import { ThankYou } from "@/components/form/ThankYou";
import { WarningIcon } from "@/components/ui/Icons";

const SLIDE = 80;
const CHOICE_DELAY = 300;
const transition = { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const };
const variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction * SLIDE }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: -direction * SLIDE }),
};

const isTyping = () => ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "");

export function Respondent({ form, preview = false }: { form: PublicForm; preview?: boolean }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const questions = form.questions;
  const question = questions[index];
  const value = question ? (answers[question.id] ?? null) : null;
  const last = index === questions.length - 1;

  const setValue = (next: AnswerValue) => {
    setAnswers((current) => ({ ...current, [question.id]: next }));
    setErrors((current) => ({ ...current, [question.id]: "" }));
  };

  const go = useCallback(
    (target: number) => {
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [index],
  );

  const submit = async (all: Record<number, AnswerValue>) => {
    setSubmitting(true);
    try {
      if (!preview) {
        await api.submitResponse(
          form.public_id,
          questions.map((item) => ({ question_id: item.id, value: all[item.id] ?? null })),
        );
      }
      setDone(true);
    } catch (error) {
      if (error instanceof ApiError && error.issues.length) {
        setErrors(Object.fromEntries(error.issues.map((issue) => [issue.question_id, issue.message])));
        go(questions.findIndex((item) => item.id === error.issues[0].question_id));
      } else {
        setErrors({ [question.id]: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const next = useCallback(
    (override?: AnswerValue) => {
      if (!question || submitting) return;
      const current = override === undefined ? value : override;
      const error = validateAnswer(question, current);
      if (error) return setErrors((state) => ({ ...state, [question.id]: error }));
      const advance = () => (last ? void submit({ ...answers, [question.id]: current }) : go(index + 1));
      if (override === undefined) advance();
      else setTimeout(advance, CHOICE_DELAY);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question, value, answers, last, index, submitting, go],
  );

  const choose = (chosen: AnswerValue) => {
    setValue(chosen);
    next(chosen);
  };

  useEffect(() => {
    if (done || !question) return;
    const onKey = (event: KeyboardEvent) => {
      if (isTyping()) return;
      if (event.key === "Enter" || event.key === "ArrowDown") return next();
      if (event.key === "ArrowUp") return index > 0 && go(index - 1);
      const key = event.key.toUpperCase();
      if (question.type === "multiple_choice") {
        const option = question.options[OPTION_KEYS.indexOf(key)];
        if (option) choose(option.label);
      } else if (question.type === "yes_no" && (key === "Y" || key === "N")) {
        choose(key === "Y" ? "Yes" : "No");
      } else if (question.type === "rating" && /^[1-9]$/.test(key) && Number(key) <= RATING_MAX) {
        choose(Number(key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, index, next, go, done]);

  const progress = questions.length ? (index / questions.length) * 100 : 0;
  const error = question ? errors[question.id] : "";

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: THEME.answerSoft }}>
        <div
          className="h-full transition-[width] duration-500"
          style={{ width: `${done ? 100 : progress}%`, background: THEME.answer }}
        />
      </div>
      <AnimatePresence custom={direction} initial={false}>
        {done ? (
          <motion.div key="done" variants={variants} custom={1} initial="enter" animate="center" exit="exit" transition={transition} className="absolute inset-0">
            <ThankYou />
          </motion.div>
        ) : question ? (
          <motion.div
            key={question.id}
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex items-center overflow-y-auto"
          >
            <div className="mx-auto flex w-full max-w-3xl gap-3 px-6 py-16">
              <QuestionNumber number={index + 1} />
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <QuestionTitle title={question.title} required={question.required} />
                  <QuestionDescription text={question.description} />
                </div>
                <QuestionField
                  key={question.id}
                  type={question.type}
                  options={question.options.map((option) => option.label)}
                  value={value}
                  onChange={setValue}
                  onSubmit={next}
                  autoFocus
                />
                {error && (
                  <div className="flex w-fit items-center gap-2 rounded px-3 py-1.5 text-sm" style={{ background: THEME.errorBg, color: THEME.error }}>
                    <WarningIcon />
                    {error}
                  </div>
                )}
                <OkButton label={last ? "Submit" : "OK"} onClick={() => next()} />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center text-xl opacity-60">This form has no questions yet.</div>
        )}
      </AnimatePresence>
      {!done && (
        <FormFooter canPrev={index > 0} canNext={index < questions.length - 1} onPrev={() => go(index - 1)} onNext={() => next()} />
      )}
    </div>
  );
}

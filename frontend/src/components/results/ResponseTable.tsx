"use client";

import { useState } from "react";
import type { FormDetail, FormResponse } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { QuestionLabel, responseDate } from "./Results";

const answerMap = (response: FormResponse) => new Map(response.answers.map((answer) => [answer.question_id, answer.value]));

export function ResponseTable({ form, responses }: { form: FormDetail; responses: FormResponse[] }) {
  const [open, setOpen] = useState<FormResponse | null>(null);
  const answers = open ? answerMap(open) : null;

  if (responses.length === 0) {
    return <p className="py-16 text-center text-sm text-admin-muted">No responses yet. Share your form to start collecting answers.</p>;
  }

  return (
    <>
      <div className="overflow-auto rounded-2xl border border-admin-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-admin-bg text-xs uppercase tracking-wide text-admin-muted">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Submitted</th>
              {form.questions.map((question) => (
                <th key={question.id} className="max-w-56 truncate px-4 py-3 font-medium">
                  {question.title || "..."}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {responses.map((response) => {
              const values = answerMap(response);
              return (
                <tr key={response.id} onClick={() => setOpen(response)} className="cursor-pointer hover:bg-admin-hover">
                  <td className="whitespace-nowrap px-4 py-3 text-admin-muted">{responseDate(response)}</td>
                  {form.questions.map((question) => (
                    <td key={question.id} className="max-w-56 truncate px-4 py-3">
                      {values.get(question.id) ?? <span className="text-admin-muted">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal open={open !== null} onClose={() => setOpen(null)} title="Response" width="max-w-2xl">
        {open && (
          <>
            <p className="-mt-4 mb-6 text-sm text-admin-muted">Submitted {responseDate(open)}</p>
            <dl className="flex max-h-[60vh] flex-col gap-5 overflow-auto text-sm">
              {form.questions.map((question, index) => (
                <div key={question.id}>
                  <dt className="mb-1">
                    <QuestionLabel type={question.type} title={question.title} index={index} />
                  </dt>
                  <dd className="pl-1 text-base">{answers?.get(question.id) ?? <span className="text-admin-muted">No answer</span>}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </Modal>
    </>
  );
}

import { pluralize } from "@/lib/format";
import type { FormStats, QuestionStats } from "@/lib/types";
import { QuestionLabel } from "./Results";

function Bars({ counts, total }: { counts: Record<string, number>; total: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Object.entries(counts).map(([label, count]) => {
        const percent = total ? Math.round((count / total) * 100) : 0;
        return (
          <li key={label} className="text-sm">
            <div className="mb-1 flex justify-between">
              <span>{label}</span>
              <span className="text-admin-muted">
                {count} · {percent}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-admin-bg">
              <div className="h-full rounded-full bg-admin-text transition-[width]" style={{ width: `${percent}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Card({ stats, index }: { stats: QuestionStats; index: number }) {
  return (
    <section className="rounded-2xl border border-admin-border bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <QuestionLabel type={stats.type} title={stats.title} index={index} />
        <span className="flex-none text-sm text-admin-muted">{pluralize(stats.answered, "answer")}</span>
      </div>
      {stats.average !== null && (
        <p className="mb-4 text-3xl font-medium">
          {stats.average}
          <span className="ml-2 text-sm font-normal text-admin-muted">average</span>
        </p>
      )}
      {stats.counts && <Bars counts={stats.counts} total={stats.answered} />}
      {stats.samples && (
        <ul className="flex flex-col divide-y divide-admin-border text-sm">
          {stats.samples.map((sample, i) => (
            <li key={i} className="py-2">
              {sample}
            </li>
          ))}
          {stats.samples.length === 0 && <li className="py-2 text-admin-muted">No answers yet</li>}
        </ul>
      )}
    </section>
  );
}

export function Summary({ stats }: { stats: FormStats }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {stats.questions.map((question, index) => (
        <Card key={question.question_id} stats={question} index={index} />
      ))}
      {stats.questions.length === 0 && <p className="text-center text-sm text-admin-muted">Add questions to see a summary here.</p>}
    </div>
  );
}

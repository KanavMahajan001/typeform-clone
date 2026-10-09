export function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-admin-bg p-8">
      <div className="max-w-md rounded-2xl border border-admin-border bg-white p-10 text-center">
        <span className="mb-4 inline-block rounded-full bg-admin-bg px-3 py-1 text-xs font-medium uppercase tracking-wide text-admin-muted">
          Coming soon
        </span>
        <h1 className="text-2xl font-medium">{title}</h1>
        <p className="mt-2 text-sm text-admin-muted">{text}</p>
      </div>
    </div>
  );
}

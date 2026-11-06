import { createFileRoute, notFound } from "@tanstack/react-router";
import { getInfoPage } from "@/data/pages";

export const Route = createFileRoute("/info/$slug")({
  loader: ({ params }) => {
    const page = getInfoPage(params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} — ArchidoHub` },
          { name: "description", content: loaderData.page.description },
          { property: "og:title", content: `${loaderData.page.title} — ArchidoHub` },
          { property: "og:description", content: loaderData.page.description },
        ]
      : [{ title: "Page not found — ArchidoHub" }, { name: "robots", content: "noindex" }],
  }),
  component: InfoPage,
});

function InfoPage() {
  const { page } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight">{page.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{page.description}</p>
      <div className="mt-10 space-y-5 leading-relaxed">
        {page.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
  );
}

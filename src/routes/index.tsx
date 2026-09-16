import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DuplicateMode } from "@/components/DuplicateMode";
import { OverridesApplier } from "@/components/OverridesApplier";
import { activateDevMode, onDevModeActivate } from "@/lib/dev-mode-bus";
import { pageOverrides } from "@/lib/page-overrides";
import { setTextOverride } from "@/lib/overrides-store";
import {
  Video,
  Zap,
  TrendingUp,
  PieChart,
  RefreshCw,
  Timer,
  Target,
  Flame,
  Check,
  ShieldCheck,
  Plus,
  Pencil,
  X,
} from "lucide-react";
import mockupApp from "@/assets/mockup-app.jpg";
import mockupDevices from "@/assets/mockup-devices.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O Plano: INSS — organize seus estudos do zero" },
      {
        name: "description",
        content:
          "Webapp simples de gestão de estudos para concurseiros do INSS: plano diário, revisões automáticas e progresso claro. Acesso único por R$67.",
      },
      { property: "og:title", content: "O Plano: INSS — organize seus estudos do zero" },
      {
        property: "og:description",
        content:
          "Plano diário, revisões no piloto automático e progresso visível até o dia da prova. Pagamento único de R$67 com garantia de 7 dias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const defaults = {
  brand: "O PLANO",
  brandSuffix: " INSS",
  navCta: "Garantir acesso",
  badge: "GESTÃO DE ESTUDOS · CONCURSOS",
  headline:
    "Enquanto os concorrentes esperam o edital do INSS, resolva a sua rotina em apenas 10 minutos: plano de estudo organizado, revisões automáticas e total controle do seu progresso.\u00a0",
  sub: 'O concurso do INSS nem foi autorizado ainda — essa é a sua chance de sair na frente. Esqueça planilhas confusas ou respostas soltas do ChatGPT: o nosso app "O Plano" é um sistema completo que calcula sua rotina, automatiza suas revisões e de forma simples, desenha sua evolução na tela.',
  heroCta: "Organizar meus estudos em 10 minutos",
  heroPrice: "",
  mockup: mockupApp,
  contrastKicker: "A DIFERENÇA NA PRÁTICA",
  contrastTitle:
    "A maioria não é aprovada no INSS por dois erros: esperar a autorização do concurso e perder meses tentando se organizar sozinha.",
  badLabel: "Sem método",
  bad1: "Até sabe o que estudar, mas não sabe \"O como\" estudar",
  bad2: "Não sabe como e quando realizar as revisões",
  bad3: "Sentimento de estar estagnado",
  bad4: "Muda os estudos todo dia e abandona tudo pelo caminho.",
  goodLabel: "Com método",
  good1: "Plano diário alinhado ao edital do INSS",
  good2: "Revisões automatizadas",
  good3: "Rotina realista, sustentável até a prova",
  good4: "Controle total do seu progresso",
  featuresTitle: "O que você tem no Plano",
  f1t: "Vídeo Tutorial Passo a Passo",
  f1d: "Assista ao passo a passo prático\ne aprenda a configurar seu planner\nem minutos, sem complicação.",
  f2t: "Configuração Rápida",
  f2d: "Zero tabelas ou fórmulas difíceis.\nConfigure sua rotina em poucos\ncliques e comece imediatamente.",
  f3t: "Evolução Clara",
  f3d: "Veja exatamente quanto do edital\nvocê já venceu e o que falta\npara dominar cada uma das matérias.",
  f4t: "Controle de Desempenho Descomplicado",
  f4d: "Acompanhe seu percentual de acertos\ne erros em gráficos simples,\nsem cálculos complexos.",
  f5t: "Revisões Automatizadas",
  f5d: "O app cobra cada revisão no dia certo.\nA partir de agora a sua única\ntarefa será apenas estudar.",
  f6t: "Cronômetro e Registros",
  f6d: "Marque o tempo líquido de estudo\nem cada matéria e mantenha seu\nhistórico organizado com um clique.",
  f7t: "Visão Geral de Metas",
  f7d: "Compare suas horas planejadas x\nestudadas na prática em um painel\ncentralizado e fácil de acompanhar.",
  f8t: "Pop-ups Motivacionais",
  f8d: "Receba frases inspiradoras e\nmensagens de apoio durante a rotina\npara manter sua mente motivada.",
  offerBadge: "OFERTA DE LANÇAMENTO",
  offerTitle: "Sua organização profissional sem mensalidades no pré-edital",
  oldPrice: "R$147,00",
  price: "R$67,00",
  priceNote: "Pagamento único à vista no PIX ou Cartão",
  c1: "Acesso Imediato ao Webapp (Celular, Tablet e PC)",
  c2: "Painel Completo de Gestão de Horas e Revisões",
  c3: "Suporte ao Usuário",
  buyCta: "GARANTIR MEU ACESSO POR R$ 67",
  buyNote: "Garantia incondicional de 7 dias",
  guarantee:
    "🛡️ Teste por 7 dias sem risco: Abra o webapp, organize sua rotina e veja como é fácil. Se achar complicado ou não se adaptar, devolvemos 100% do seu dinheiro.",
  faqTitle: "Perguntas frequentes",
  q1: "Preciso baixar algum programa no meu computador?",
  a1: "Não, é um webapp 100% digital direto no navegador.",
  q2: "O webapp serve para quem está começando do zero?",
  a2: "Sim, foi feito justamente para ensinar o iniciante a ter a mesma organização de um concurseiro de elite.",
  q3: "Como vou receber o meu acesso?",
  a3: "Envio imediato por e-mail após confirmação pela Hotmart.",
  q4: "Terei que pagar mensalidade?",
  a4: "Não, valor único de R$ 67,00.",
  finalTitle: "Seu edital não espera. Seu método também não.",
  finalCta: "COMEÇAR MINHA PREPARAÇÃO PROFISSIONAL AGORA",
  finalNote: "Acesso imediato · Garantia de 7 dias",
  m1: "Método",
  m2: "Constância",
  m3: "Edital no alvo",
  m4: "Progresso real",
  contrastCta: "Quero sair na frente e começar hoje",
  featuresCta: "Quero meu plano de estudos pronto",
  faqCta: "Garantir meu acesso agora",
};

type Key = keyof typeof defaults;
const CTA_KEYS = new Set<Key>([
  "heroCta",
  "contrastCta",
  "featuresCta",
  "buyCta",
  "faqCta",
  "finalCta",
]);

// Texts saved into src/content/page-overrides.json win over the defaults, and
// are rendered on the server too, so the published build shows the edits.
const initialContent: Record<Key, string> = (() => {
  const merged = { ...defaults } as Record<Key, string>;
  for (const [key, value] of Object.entries(pageOverrides.text)) {
    if (key in merged) merged[key as Key] = value;
  }
  CTA_KEYS.forEach((key) => {
    if (!merged[key]?.trim()) merged[key] = defaults[key];
  });
  return merged;
})();

function Index() {
  const [content, setContent] = useState<Record<Key, string>>(initialContent);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(false);
    activateDevMode("none");
    return onDevModeActivate((source) => {
      if (source !== "edit") setEditing(false);
    });
  }, []);

  const update = (key: Key, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setTextOverride(key, value);
  };

  return (
    <EditCtx.Provider value={{ content, update, editing }}>
    <div
      onClickCapture={(e) => {
        if (!editing) return;
        const a = (e.target as HTMLElement).closest("a");
        if (a) e.preventDefault();
      }}
      className={`min-h-screen bg-background font-body text-foreground antialiased selection:bg-accent/20 overflow-x-hidden ${
        editing ? "editing" : ""
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="kinetic absolute -left-24 top-24 h-[460px] w-[360px] rotate-12 rounded-[28px] border border-card/60 bg-card/40 backdrop-blur-md" />
        <div
          className="kinetic absolute right-0 top-[42%] h-[380px] w-[300px] -rotate-12 rounded-[28px] border border-primary/30 bg-primary/10 backdrop-blur-md"
          style={{ animationDelay: "1.4s" }}
        />
        <div
          className="kinetic absolute bottom-10 left-1/3 h-[320px] w-[340px] rotate-6 rounded-[28px] border border-accent/25 bg-accent/10 backdrop-blur-md"
          style={{ animationDelay: "2.6s" }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 rotate-6 place-items-center rounded-lg bg-primary font-display text-base font-extrabold text-primary-foreground">
              OP
            </div>
            <span className="font-display text-base font-extrabold tracking-tight">
              <T k="brand" />
              <span className="text-accent">:</span>
              <T k="brandSuffix" />
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-12 md:py-16">
          <div className="rise-in md:col-span-7">
            <span className="inline-block rounded-md bg-foreground/5 px-2.5 py-1 font-mono text-xs tracking-wide text-muted-foreground">
              <T k="badge" />
            </span>
            <T
              k="headline"
              as="h1"
              className="mt-5 block font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-5xl"
            />
            <T
              k="sub"
              as="p"
              className="mt-4 block max-w-[52ch] text-lg text-pretty text-muted-foreground"
            />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#oferta"
                className="rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm ring-1 ring-foreground/5 transition-colors hover:bg-primary/90"
              >
                <T k="heroCta" />
              </a>
              <span className="font-mono text-sm text-muted-foreground">
                <T k="heroPrice" />
              </span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="kinetic relative -rotate-2 rounded-[20px] border border-card/70 bg-card/55 p-2 shadow-sm ring-1 ring-foreground/5 backdrop-blur-md">
              <img
                src={content.mockup}
                alt="Painel do webapp O Plano: INSS com plano de estudos diário e progresso"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full rounded-[14px] object-cover object-top"
              />
              {editing && (
                <button
                  onClick={() => {
                    const url = window.prompt("URL da imagem/mockup", content.mockup);
                    if (url) update("mockup", url);
                  }}
                  className="absolute right-4 top-4 rounded-md bg-foreground/80 px-2.5 py-1.5 font-mono text-xs text-background"
                >
                  trocar imagem
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CONTRASTE */}
        <section className="border-y border-border bg-foreground/[0.03]">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <T
              k="contrastKicker"
              as="p"
              className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            />
            <T
              k="contrastTitle"
              as="h2"
              className="mt-3 block max-w-3xl font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
            />
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div className="rise-in">
                <T
                  k="badLabel"
                  as="span"
                  className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
                />
                <ul className="mt-4 space-y-3">
                  {(["bad1", "bad2", "bad3", "bad4"] as Key[]).map((k) => (
                    <li key={k} className="flex gap-3 text-pretty">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                      <T k={k} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rise-in relative [animation-delay:120ms]">
                <div
                  className="absolute -inset-3 -rotate-1 rounded-2xl border border-primary/25 bg-primary/10"
                  aria-hidden="true"
                />
                <div className="relative rounded-2xl border border-border bg-card/60 p-5 ring-1 ring-foreground/5 backdrop-blur-md">
                  <T
                    k="goodLabel"
                    as="span"
                    className="font-mono text-xs font-medium uppercase tracking-wide text-primary"
                  />
                  <ul className="mt-4 space-y-3">
                    {(["good1", "good2", "good3", "good4"] as Key[]).map((k) => (
                      <li key={k} className="flex gap-3 text-pretty">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <T k={k} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href="#oferta"
                className="rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm ring-1 ring-foreground/5 transition-colors hover:bg-primary/90"
              >
                <T k="contrastCta" />
              </a>
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <T
            k="featuresTitle"
            as="h2"
            className="block font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
          />
          <div className="mt-7 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Video, t: "f1t", d: "f1d", tone: "primary", delay: "0ms" },
              { Icon: Zap, t: "f2t", d: "f2d", tone: "accent", delay: "60ms" },
              { Icon: TrendingUp, t: "f3t", d: "f3d", tone: "primary", delay: "120ms" },
              { Icon: PieChart, t: "f4t", d: "f4d", tone: "accent", delay: "180ms" },
              { Icon: RefreshCw, t: "f5t", d: "f5d", tone: "accent", delay: "240ms" },
              { Icon: Timer, t: "f6t", d: "f6d", tone: "primary", delay: "300ms" },
              { Icon: Target, t: "f7t", d: "f7d", tone: "primary", delay: "360ms" },
              { Icon: Flame, t: "f8t", d: "f8d", tone: "accent", delay: "420ms" },
            ].map(({ Icon, t, d, tone, delay }) => (
              <div
                key={t}
                style={{ animationDelay: delay }}
                className="rise-in rounded-xl border border-border bg-card/60 p-5 ring-1 ring-foreground/5 backdrop-blur-md"
              >
                <div
                  className={`grid size-10 place-items-center rounded-lg ${
                    tone === "accent" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <T k={t as Key} as="h3" className="mt-4 block font-display text-base font-bold" />
                <T
                  k={d as Key}
                  as="p"
                  className="mt-1.5 block whitespace-pre-line text-sm text-pretty text-muted-foreground"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="#oferta"
              className="rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm ring-1 ring-foreground/5 transition-colors hover:bg-primary/90"
            >
              <T k="featuresCta" />
            </a>
          </div>
        </section>

        {/* OFERTA */}
        <section id="oferta" className="mx-auto max-w-6xl px-4 py-12">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-primary-foreground sm:p-10">
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="inline-block rounded-md bg-accent px-2.5 py-1 font-mono text-xs font-medium tracking-wide text-accent-foreground">
                  <T k="offerBadge" />
                </span>
                <T
                  k="offerTitle"
                  as="h2"
                  className="mt-5 block font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
                />
                <div className="mt-5 flex items-end gap-3">
                  <T
                    k="oldPrice"
                    className="font-mono text-lg text-primary-foreground/50 line-through"
                  />
                  <T k="price" className="font-display text-5xl font-extrabold tracking-tight" />
                </div>
                <T
                  k="priceNote"
                  as="p"
                  className="mt-2 block font-mono text-sm text-primary-foreground/70"
                />
                <ul className="mt-6 space-y-2.5">
                  {(["c1", "c2", "c3"] as Key[]).map((k) => (
                    <li key={k} className="flex items-center gap-3 text-sm">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/30 text-primary-foreground">
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                      <T k={k} />
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="mt-6 block w-full rounded-xl bg-accent px-6 py-4 text-center text-base font-bold text-accent-foreground shadow-sm ring-1 ring-foreground/5 transition-colors hover:bg-accent/90"
                >
                  <T k="buyCta" />
                </a>
                <T k="buyNote" as="p" className="mt-3 block text-center font-mono text-xs text-primary-foreground/60" />
              </div>
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full bg-primary/30 blur-3xl"
                  aria-hidden="true"
                />
                <img
                  src={mockupDevices}
                  alt="Mockup do webapp O Plano: INSS em notebook, tablet e smartphone"
                  width={1280}
                  height={1280}
                  loading="lazy"
                  className="relative z-10 w-full max-w-[340px] drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:max-w-[380px]"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 ring-1 ring-foreground/5 backdrop-blur-md">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" strokeWidth={1.75} />
            </span>
            <T k="guarantee" as="p" className="block text-sm text-pretty" />
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-12">
          <T
            k="faqTitle"
            as="h2"
            className="block font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
          />
          <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card/50 ring-1 ring-foreground/5 backdrop-blur-md">
            {[
              ["q1", "a1"],
              ["q2", "a2"],
              ["q3", "a3"],
              ["q4", "a4"],
            ].map(([q, a]) => (
              <details key={q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  <T k={q as Key} />
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                    <Plus className="size-4" strokeWidth={2} />
                  </span>
                </summary>
                <T
                  k={a as Key}
                  as="p"
                  className="mt-3 block text-sm text-pretty text-muted-foreground"
                />
              </details>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="#oferta"
              className="rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm ring-1 ring-foreground/5 transition-colors hover:bg-primary/90"
            >
              <T k="faqCta" />
            </a>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative overflow-hidden bg-foreground text-primary-foreground">
          <div
            className="kinetic absolute -right-10 top-0 h-64 w-64 rotate-12 rounded-[28px] border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-md"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 text-center">
            <T
              k="finalTitle"
              as="h2"
              className="block font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
            />
            <a
              href="#oferta"
              className="mt-7 inline-block rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-foreground ring-1 ring-foreground/5 transition-colors hover:bg-accent/90"
            >
              <T k="finalCta" />
            </a>
            <T
              k="finalNote"
              as="p"
              className="mt-4 block font-mono text-xs text-primary-foreground/60"
            />
          </div>
          <div className="relative border-t border-primary-foreground/10">
            <div className="mx-auto max-w-6xl overflow-hidden px-4 py-4">
              <div className="marquee flex w-max gap-12 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground/50">
                {[...(["m1", "m2", "m3", "m4"] as Key[]), ...(["m1", "m2", "m3", "m4"] as Key[])].map(
                  (k, i) => (
                    <span key={`${k}-${i}`}>{content[k]}</span>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        onClick={() => setEditing((enabled) => {
          if (!enabled) activateDevMode("edit");
          return !enabled;
        })}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
      >
        {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
        {editing ? "sair da edição" : "modo edição"}
      </button>

      <DuplicateMode />
      <OverridesApplier />
    </div>
    </EditCtx.Provider>
  );
}

const EditCtx = createContext<{
  content: Record<Key, string>;
  update: (k: Key, v: string) => void;
  editing: boolean;
}>({ content: defaults, update: () => {}, editing: false });

function T({
  k,
  as: Tag = "span",
  className,
}: {
  k: Key;
  as?: React.ElementType;
  className?: string | undefined;
}) {
  const { content, update, editing } = useContext(EditCtx);
  const value = !editing && CTA_KEYS.has(k) && !content[k]?.trim() ? defaults[k] : content[k];
  return (
    <Editable
      value={value}
      onChange={(v) => update(k, v)}
      editing={editing}
      as={Tag}
      className={className}
    />
  );
}

function Editable({
  value,
  onChange,
  editing,
  as: Tag = "span",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  as?: React.ElementType;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) {
      el.textContent = value;
    }
  });

  if (!editing) {
    return (
      <Tag data-editable className={className}>
        {value}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      data-editable
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={(e: React.FormEvent<HTMLElement>) => onChange(e.currentTarget.textContent ?? "")}
    />
  );
}

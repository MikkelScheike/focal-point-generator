interface AboutPageProps {
  onHome: () => void;
}

const BROWSERS: readonly { name: string; from: string; note?: string }[] = [
  { name: "Chrome", from: "32" },
  { name: "Firefox", from: "36" },
  { name: "Safari", from: "10", note: "macOS and iOS" },
  {
    name: "Edge",
    from: "79",
    note: "Chromium. Images also worked in Edge 16–18",
  },
];

export function AboutPage({ onHome }: AboutPageProps) {
  return (
    <article className="mx-auto w-full max-w-[640px] px-6 pt-10 pb-24 sm:pt-14">
      <h1 className="text-3xl font-medium tracking-tight text-ink">About</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        A small developer utility. Not an image editor.
      </p>

      <section className="mt-12">
        <h2 className="text-sm font-medium text-ink">What it is</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Focal Point Generator helps you keep the important part of a photo
          visible when layouts crop it. You place a point on the image, preview
          the crops, and copy{" "}
          <code className="font-mono text-[12px] text-ink">
            object-position
          </code>{" "}
          CSS to use with{" "}
          <code className="font-mono text-[12px] text-ink">
            object-fit: cover
          </code>
          .
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          It does not paint, resize, or export a new file. The image stays in
          this tab. Nothing is uploaded or stored on a server.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium text-ink">Why it matters</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A crop that looks right on one page often fails on the next. Desktop
          heroes, tablet banners, mobile cards, and square thumbnails all cut
          the same photo differently. Browsers keep the center. Faces, products,
          and signs that sit off-center get clipped.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A focal point is how you take control. You mark what must stay in
          frame, then every crop honors that point instead of guessing.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium text-ink">When it works</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The code this tool generates uses{" "}
          <code className="font-mono text-[12px] text-ink">object-fit</code> and{" "}
          <code className="font-mono text-[12px] text-ink">
            object-position
          </code>{" "}
          on <code className="font-mono text-[12px] text-ink">&lt;img&gt;</code>
          . Those properties have been supported from:
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-overlay text-[11px] font-medium tracking-[0.14em] text-ink/80 uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Browser</th>
                <th className="px-4 py-2.5 font-medium">From version</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {BROWSERS.map((browser) => (
                <tr key={browser.name} className="border-t border-line">
                  <td className="px-4 py-2.5 text-ink">{browser.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-[13px] text-ink tabular-nums">
                      {browser.from}+
                    </span>
                    {browser.note ? (
                      <span className="mt-0.5 block text-xs text-faint">
                        {browser.note}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Internet Explorer never shipped these properties. Optional crop zoom
          uses{" "}
          <code className="font-mono text-[12px] text-ink">
            transform: scale()
          </code>{" "}
          with{" "}
          <code className="font-mono text-[12px] text-ink">
            transform-origin
          </code>{" "}
          at the focal point, which those same browsers already supported.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This site itself needs a current evergreen browser with JavaScript on.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium text-ink">Built by</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Made by{" "}
          <a
            href="https://mikkelscheike.com"
            className="text-ink underline-offset-2 transition-colors hover:underline"
          >
            Mikkel Scheike
          </a>
          .
        </p>
      </section>

      <p className="mt-12">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onHome();
          }}
          className="text-sm font-medium text-ink underline-offset-2 hover:underline"
        >
          Back to the tool
        </a>
      </p>
    </article>
  );
}

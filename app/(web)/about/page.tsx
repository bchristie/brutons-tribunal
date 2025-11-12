import { CTA, StandardLayout } from '@/app/(web)/_components';

export default function About() {
  return (
    <StandardLayout
      title="About Us"
      description="The Honorable Judge J.D. Bruton and the story of Brutons Tribunal."
    >
      <section className="py-16 bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-theme-primary mb-6">
                Court Biography
              </h2>
              <div className="prose prose-lg text-theme-secondary space-y-4">
                <p>
                  <b>All rise for the Honorable Judge J.D. Bruton</b>, presiding over Plant City,
                  Florida's most distinguished spirits tribunal. With decades of experience
                  both in the courtroom and behind the bar, Judge Bruton brings a unique
                  blend of legal precision and refined taste to every trial.
                </p>
                <p>
                  Born and raised in the heart of Plant City, Judge Bruton developed his
                  appreciation for fine spirits through years of careful study and deliberate
                  tasting. His judicial approach to spirits evaluation has earned him
                  recognition throughout Central Florida, where his verdicts are considered
                  final and his recommendations beyond reproach.
                </p>
                <p>
                  "Order in the court!" is more than just a phrase – it's Judge Bruton's
                  commitment to bringing structure, expertise, and fairness to every tasting
                  session. Whether examining the evidence of a rare bourbon or cross-examining
                  the claims of a premium scotch, the Judge ensures every spirit receives its
                  day in court.
                </p>
              </div>
            </div>
            <div className="bg-theme-secondary rounded-lg p-8">
              <h3 className="text-2xl font-bold text-theme-primary mb-4">
                The Court's Philosophy
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    <b>Evidence-Based Verdicts</b> &mdash;
                    Every spirit must present its case through aroma, flavor, and finish. No
                    reputation precedes the evidence, and every bottle gets a fair trial.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    <b>Jury of Peers</b> &mdash;
                    The tribunal values the collective wisdom of its jurors. Every palate
                    contributes to the final verdict, creating truly democratic tastings.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    <b>Precedent &amp; Innovation</b> &mdash;
                    Respecting classical distillation methods while remaining open to innovative
                    techniques and emerging craft expressions.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--color-primary-600)' }} className="mr-2">•</span>
                  <span className="text-theme-secondary">
                    <b>Plant City Pride</b> &mdash;
                    Celebrating Florida's growing craft distillery scene while maintaining
                    connections to the world's finest spirit-producing regions.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTA variant="secondary">
        <CTA.Title>Ready to be summoned?</CTA.Title>
        <CTA.Body>
          Preside over Plant City's premier spirits tribunal with wisdom, experience, and an uncompromising palate.
        </CTA.Body>
        <CTA.Actions>
          <CTA.Button href="/contact">Join the Jury</CTA.Button>
        </CTA.Actions>
      </CTA>
    </StandardLayout>
  );
}
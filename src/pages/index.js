import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import ProjectTimeline from '@site/src/components/ProjectTimeline';

const tracks = [
  {
    eyebrow: 'Run',
    title: 'Security operations',
    body: 'Reconnaissance with an operator gate, declared scope, and policy-checked tool calls before anything reaches a target.',
    to: '/lophiarch',
    link: 'Lophiarch docs',
  },
  {
    eyebrow: 'Govern',
    title: 'Agent authority',
    body: 'YAML-first policy for what an agent may read, which tools it may call, and how much context leaves a session.',
    to: '/axionorm',
    link: 'Axionorm docs',
  },
  {
    eyebrow: 'Carry',
    title: 'Governed context',
    body: 'A signed, leased carrier for moving approved state between agents, plus a policy-gated MCP gateway on the receiving side.',
    to: '/parabiont',
    link: 'Parabiont docs',
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentation library"
      description="Documentation for Lophiarch, Axionorm, Parabiont Protocol, PARALAX MCP, and the rest of the Draxis Digital project line.">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Draxis Digital · Documentation library</p>
          <h1 className={styles.title}>Every project, documented in one place.</h1>
          <p className={styles.subtitle}>
            Security tooling, agent governance, and context protocols. Pick the project
            you need, or follow the timeline to see how the pieces fit together.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/library">
              How to use this library
            </Link>
            <Link className={styles.secondaryAction} to="/lophiarch">
              Start with Lophiarch
            </Link>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt>Documented</dt>
              <dd>4 projects</dd>
            </div>
            <div>
              <dt>Tracked</dt>
              <dd>8 repositories</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>Markdown in Git</dd>
            </div>
          </dl>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>The library</p>
            <h2 id="library">One timeline, every project</h2>
            <p>
              Ordered by when each repository was created. Documented projects link
              straight to their manuals; the rest point to the source until their
              documentation is worth reading.
            </p>
          </div>
          <ProjectTimeline />
        </section>

        <section className={styles.tracks}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>Where to start</p>
            <h2>Read by what you need to do</h2>
          </div>
          <div className={styles.trackGrid}>
            {tracks.map((track) => (
              <Link className={styles.track} to={track.to} key={track.title}>
                <span className={styles.trackEyebrow}>{track.eyebrow}</span>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
                <span className={styles.trackLink}>{track.link} →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.note}>
          <div>
            <h2>Documentation is part of the codebase</h2>
            <p>
              Every page here lives in Git next to the project it describes. Commands,
              environment variables, and policy behavior are checked against the source,
              not copied from a slide. If a page disagrees with the code, the code wins
              and the page gets fixed.
            </p>
          </div>
          <Link className={styles.noteLink} to="https://github.com/amiencoy/docs">
            View the documentation repository →
          </Link>
        </section>
      </main>
    </Layout>
  );
}

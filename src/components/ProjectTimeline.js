import React from 'react';
import Link from '@docusaurus/Link';
import styles from './ProjectTimeline.module.css';

const projects = [
  {
    date: 'Jul 2026',
    name: 'Lophiarch',
    version: 'v2.2.2',
    status: 'Stable',
    tone: 'live',
    kind: 'Security operations',
    description:
      'Policy-gated AI reconnaissance with Telegram ChatOps, MCP orchestration, disposable scanner workers, and PDF reporting.',
    docs: '/lophiarch',
    repo: 'https://github.com/amiencoy/lophiarch',
  },
  {
    date: 'Aug 2026',
    name: 'Catapult',
    version: 'Concept',
    status: 'Concept',
    tone: 'planned',
    kind: 'Secrets',
    description:
      'A local safe storage layer for API keys and reusable capabilities. Repository exists; the product is not running yet.',
    repo: 'https://github.com/amiencoy/catapult',
  },
  {
    date: 'Aug 2026',
    name: 'SCRYMR',
    version: 'Pre-alpha',
    status: 'Pre-alpha',
    tone: 'active',
    kind: 'Community security',
    description:
      'A Discord-native community security and incident-response sentinel built around human approval and calm response.',
    repo: 'https://github.com/amiencoy/scrymr',
  },
  {
    date: 'Sep 2026',
    name: 'Parabiont Protocol',
    version: 'v0.1.2',
    status: 'Experimental',
    tone: 'live',
    kind: 'Context protocol',
    description:
      'A signed, leased context-carrier profile over A2A. Approved state moves between agents without becoming an unpoliced memory dump.',
    docs: '/parabiont',
    repo: 'https://github.com/amiencoy/parabiont-protocol',
  },
  {
    date: 'Sep 2026',
    name: 'Axionorm',
    version: 'v0.1.0',
    status: 'Experimental',
    tone: 'live',
    kind: 'Agent policy',
    description:
      'YAML-first policy for agent context and authority, evaluated through a real OPA/Rego backend with fail-closed behavior.',
    docs: '/axionorm',
    repo: 'https://github.com/amiencoy/axionorm',
  },
  {
    date: 'Sep 2026',
    name: 'Lophiont',
    version: 'Design stage',
    status: 'Design',
    tone: 'planned',
    kind: 'Carrier',
    description:
      'The planned parabiotic carrier connecting Lophiarch to external agents and graph systems. Not implemented yet.',
    repo: 'https://github.com/amiencoy/lophiont',
  },
  {
    date: 'Sep 2026',
    name: 'Discord AI Notifier',
    version: 'Available',
    status: 'Available',
    tone: 'active',
    kind: 'Notifications',
    description:
      'A reusable Discord notification plugin that runs on your own bot token and channel, with hosted and local providers.',
    repo: 'https://github.com/amiencoy/discord-bot-notifier',
  },
  {
    date: 'Sep 2026',
    name: 'PARALAX MCP',
    version: 'v0.1.2',
    status: 'Experimental',
    tone: 'live',
    kind: 'MCP gateway',
    description:
      'Policy-gated MCP tools and desktop integration that connects Axionorm and Parabiont to a working agent session.',
    docs: '/paralax',
    repo: 'https://github.com/amiencoy/paralax-mcp',
  },
];

export default function ProjectTimeline() {
  return (
    <ol className={styles.timeline}>
      {projects.map((project) => (
        <li className={styles.item} key={project.name}>
          <span className={`${styles.dot} ${styles[project.tone]}`} aria-hidden="true" />
          <div className={styles.meta}>
            <time>{project.date}</time>
            <span className={styles.kind}>{project.kind}</span>
          </div>
          <article className={styles.card}>
            <header className={styles.cardHead}>
              <div>
                <h3>{project.name}</h3>
                <span className={styles.version}>{project.version}</span>
              </div>
              <span className={`${styles.badge} ${styles[project.tone]}`}>
                {project.status}
              </span>
            </header>
            <p>{project.description}</p>
            <div className={styles.links}>
              {project.docs ? (
                <Link className={styles.primaryLink} to={project.docs}>
                  Read documentation
                </Link>
              ) : (
                <span className={styles.noDocs}>Repository only</span>
              )}
              <Link className={styles.secondaryLink} to={project.repo}>
                Source ↗
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

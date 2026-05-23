import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import styles from './index.module.css'

type ExtensionCardProps = {
  name: string
  pkg: string
  description: string
  status: 'available' | 'coming-soon'
  href?: string
}

function ExtensionCard({ name, pkg, description, status, href }: ExtensionCardProps) {
  const inner = (
    <div className={`${styles.card} ${status === 'coming-soon' ? styles.cardMuted : ''}`}>
      <div className={styles.cardHeader}>
        <Heading as="h3" className={styles.cardName}>{name}</Heading>
        {status === 'available' ? (
          <span className={styles.badgeAvailable}>available</span>
        ) : (
          <span className={styles.badgeSoon}>coming soon</span>
        )}
      </div>
      <code className={styles.cardPkg}>{pkg}</code>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  )

  if (href) return <Link to={href} className={styles.cardLink}>{inner}</Link>
  return <div className={styles.cardLink}>{inner}</div>
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>tapx</Heading>
          <p className={styles.heroTagline}>Free, open-source extensions for TipTap</p>
          <p className={styles.heroDescription}>
            Production-quality extensions for editorial workflows.
          </p>
          <div className={styles.heroCtas}>
            <Link className="button button--primary button--lg" to="/docs/extensions/columns">
              Browse Extensions
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/ahmadalfy/tapx"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.extensions}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>Extensions</Heading>
            <div className={styles.grid}>
              <ExtensionCard
                name="Columns"
                pkg="@tapx/columns"
                description="Multi-column layouts with configurable widths, gap, and mobile stacking behaviour. Supports 2 and 3 columns."
                status="available"
                href="/docs/extensions/columns"
              />
              <ExtensionCard
                name="Image"
                pkg="@tapx/image"
                description="Upload, crop, and insert images with responsive AVIF/WebP variants at the correct sizes."
                status="coming-soon"
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

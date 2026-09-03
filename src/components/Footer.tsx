import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import FooterSubscribe from './FooterSubscribe';

type FooterLink =
  | { label: string; href: string }
  | { label: string; static: true };

function FooterLinkItem({ link }: { link: FooterLink }) {
  if ('static' in link) {
    return <span className="footer-static-link">{link.label}</span>;
  }

  if (link.href.startsWith('mailto:')) {
    return <a href={link.href}>{link.label}</a>;
  }

  if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
    return <a href={link.href}>{link.label}</a>;
  }

  return <Link href={link.href}>{link.label}</Link>;
}

export default function Footer() {
  const latestPosts = getAllPosts().slice(0, 2).map((post) => ({
    label: post.title,
    href: `/blog/${post.slug}`,
  }));

  const footerColumns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      heading: 'Programs',
      links: [
        { label: 'Live AI Cohort', href: '/' },
        { label: 'All Courses', href: '/courses' },
        { label: 'AI Mastery for Working Professionals', href: '/courses/ai-mastery-for-working-professionals' },
        {
          label: 'No Code AI Agents Mastery for Working Professionals',
          href: '/courses/no-code-ai-agents-mastery-for-working-professionals',
        },
        { label: 'Vibe Coding Mastery for Working Professionals', href: '/courses/vibe-coding-mastery-for-working-professionals' },
        { label: 'Free Courses', href: '/courses' },
        { label: 'Team AI Training', href: '/team-ai-training' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        ...latestPosts,
        { label: 'AI Glossary', href: '/ai-glossary' },
        { label: 'Prompting Guide', href: '/prompting-guide' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', static: true },
        { label: 'Terms of Service', static: true },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-columns">
          {footerColumns.map((col) => (
            <div key={col.heading} className="footer-col">
              <h4 className="footer-col-heading">{col.heading}</h4>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={'href' in link ? `${link.label}-${link.href}` : link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <FooterSubscribe />
        </div>
      </div>

      <p className="footer-copyright">© 2026 Approachable · making AI approachable for everyone</p>
    </footer>
  );
}

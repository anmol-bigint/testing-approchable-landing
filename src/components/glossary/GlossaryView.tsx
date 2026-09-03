'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_LABELS, slugify, type GlossaryCategory, type GlossaryEntry } from '@/lib/glossary';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const EMPTY_SUGGESTIONS = ['agent', 'token', 'RAG', 'fine-tuning', 'MCP'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const matcher = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const pieces = text.split(matcher);
  return pieces.map((piece, index) =>
    piece.toLowerCase() === query.toLowerCase() ? <mark key={`${piece}-${index}`}>{piece}</mark> : piece
  );
}

function matches(entry: GlossaryEntry, query: string, category: GlossaryCategory | null): boolean {
  if (category && entry.c !== category) return false;
  if (!query) return true;
  const haystack = `${entry.t} ${entry.a} ${entry.d} ${entry.w}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

interface GlossaryViewProps {
  entries: GlossaryEntry[];
}

export default function GlossaryView({ entries }: GlossaryViewProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | null>(null);

  const filteredEntries = useMemo(
    () => entries.filter((entry) => matches(entry, query, category)),
    [entries, query, category]
  );
  const groupedEntries = useMemo(() => {
    return filteredEntries.reduce<Map<string, GlossaryEntry[]>>((groups, entry) => {
      const letter = entry.t.charAt(0).toUpperCase();
      const current = groups.get(letter) ?? [];
      current.push(entry);
      groups.set(letter, current);
      return groups;
    }, new Map());
  }, [filteredEntries]);

  const activeLetters = useMemo(() => new Set(groupedEntries.keys()), [groupedEntries]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isTypingElement =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.isContentEditable;
      if (event.key === '/' && !isTypingElement) {
        event.preventDefault();
        document.getElementById('gl-search-input')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const showClear = Boolean(query || category);

  return (
    <>
      <div className="gl-toolbar" id="glossary">
        <div className="container-max">
          <div className="gl-toolbar-sticky">
            <p className="gl-count" id="gl-count" role="status" aria-live="polite">
              {filteredEntries.length === entries.length
                ? `Showing all ${entries.length} terms`
                : `${filteredEntries.length} of ${entries.length} terms`}
            </p>

            <div className="gl-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="gl-search-input"
                className="gl-search-input"
                type="search"
                autoComplete="off"
                placeholder='Search a term - try "agent" or "token"'
                aria-label="Search the glossary"
                aria-describedby="gl-count"
                value={query}
                onChange={(event) => setQuery(event.target.value.trimStart())}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setQuery('');
                    setCategory(null);
                  }
                }}
              />
              <button
                type="button"
                className={`gl-clear${showClear ? ' on' : ''}`}
                onClick={() => {
                  setQuery('');
                  setCategory(null);
                }}
              >
                Clear
              </button>
              <span className="gl-kbd">/</span>
            </div>
          </div>

          <div className="gl-toolbar-scroll">
            <div className="gl-chips-scroll">
              <div className="gl-chips" role="group" aria-label="Filter by category">
                <button
                  type="button"
                  className="gl-chip"
                  data-cat="all"
                  aria-pressed={category === null}
                  onClick={() => setCategory(null)}
                >
                  All terms
                </button>
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="gl-chip"
                    data-cat={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {CATEGORY_LABELS[item]}
                  </button>
                ))}
              </div>
            </div>

            <div className="gl-az-scroll">
              <div className="gl-az" aria-label="Jump to letter">
                {LETTERS.map((letter) =>
                  activeLetters.has(letter) ? (
                    <Link key={letter} href={`#letter-${letter}`}>
                      {letter}
                    </Link>
                  ) : (
                    <span key={letter} aria-hidden="true">
                      {letter}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max">
        {filteredEntries.length === 0 ? (
          <div className="gl-empty">
            <h2>Nothing here for "{query}"</h2>
            <p>It might go by another name, or it is one we have not written yet. Try one of these:</p>
            <div>
              {EMPTY_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    setCategory(null);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          Array.from(groupedEntries.entries()).map(([letter, group]) => (
            <section key={letter} className="gl-letter" id={`letter-${letter}`}>
              <h2>{letter}</h2>
              <div className="gl-grid">
                {group.map((entry) => (
                  <article className="gl-card" id={entry.slug} key={entry.slug}>
                    <div className="gl-card-head">
                      <h3 className="gl-term">
                        <Link href={`/ai-glossary/${entry.slug}`}>
                          {highlight(entry.t, query)}
                        </Link>
                      </h3>
                      <span className="gl-cat">{CATEGORY_LABELS[entry.c]}</span>
                    </div>
                    {entry.a ? <p className="gl-aka">Also called: {highlight(entry.a, query)}</p> : null}
                    <p className="gl-def">{highlight(entry.d, query)}</p>
                    <p className="gl-why">
                      <strong>Why it matters</strong>
                      {highlight(entry.w, query)}
                    </p>
                    {entry.s.length ? (
                      <p className="gl-see">
                        See also{' '}
                        {entry.s.map((term, index) => (
                          <span key={term}>
                            <Link href={`/ai-glossary/${slugify(term)}`}>{term}</Link>
                            {index < entry.s.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))
        )}

        <section className="gl-cta">
          <h2>Knowing the words is step one.</h2>
          <p>The 6-week cohort is where you build with them - small group, mentor-led, 20 seats.</p>
          <Link href="/" className="gl-btn-primary">
            See the cohort
          </Link>
        </section>
      </div>

    </>
  );
}

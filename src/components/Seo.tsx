import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description?: string;
  robots?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const upsertMeta = (selector: string, attribute: 'name' | 'property', value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const upsertLink = (selector: string, rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const upsertJsonLd = (id: string, data: SeoProps['structuredData']) => {
  if (!data) {
    return;
  }

  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-jsonld="${id}"]`);

  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-seo-jsonld', id);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

const removeHeadElement = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

export default function Seo({ title, description, robots, canonical, image, type = 'website', structuredData }: SeoProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!description) {
      return;
    }

    upsertMeta('meta[name="description"]', 'name', 'description', description);
  }, [description]);

  useEffect(() => {
    if (!robots) {
      return;
    }

    upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
  }, [robots]);

  useEffect(() => {
    if (!canonical) {
      removeHeadElement('link[rel="canonical"]');
      return;
    }

    upsertLink('link[rel="canonical"]', 'canonical', canonical);
  }, [canonical]);

  useEffect(() => {
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);

    if (description) {
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
      upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary');

    if (canonical) {
      upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
      upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonical);
    }

    if (image) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
      upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    }
  }, [canonical, description, image, title, type]);

  useEffect(() => {
    if (!structuredData) {
      removeHeadElement('script[data-seo-jsonld="page"]');
      return;
    }

    upsertJsonLd('page', structuredData);
  }, [structuredData]);

  return null;
}

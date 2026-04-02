import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { reportAppError } from '../lib/appError';

type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  date: string;
  isoDate: string;
  image?: string;
};

const BLOG_EMBED_TOKEN = '961a0745-9ae5-4dd2-a648-348e12fa7dff';
const BLOG_CACHE_KEY = 'forty:blog-feed';

const parseEmbeddedArticles = (payload: string): BlogArticle[] => {
  const match = payload.match(/var SORO_ARTICLES = (\[[\s\S]*?\]);\s*var SORO_TOKEN/);

  if (!match?.[1]) {
    throw new Error('Missing Soro article payload.');
  }

  const parsed = JSON.parse(match[1]) as BlogArticle[];
  return Array.isArray(parsed) ? parsed : [];
};

const getBlogFeedUrl = (slug?: string | null) =>
  slug
    ? `https://app.trysoro.com/api/embed/${BLOG_EMBED_TOKEN}?post=${encodeURIComponent(slug)}`
    : `https://app.trysoro.com/api/embed/${BLOG_EMBED_TOKEN}`;

const getCanonicalUrl = (slug?: string | null) => {
  if (typeof window === 'undefined') {
    return slug ? `/blog?post=${encodeURIComponent(slug)}` : '/blog';
  }

  const url = new URL(window.location.origin + '/blog');

  if (slug) {
    url.searchParams.set('post', slug);
  }

  return url.toString();
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const estimateReadMinutes = (article: BlogArticle) => {
  const source = article.content ? stripHtml(article.content) : article.excerpt;
  return Math.max(1, Math.ceil(source.split(/\s+/).filter(Boolean).length / 180));
};

const readCachedArticles = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = window.sessionStorage.getItem(BLOG_CACHE_KEY);
    return cached ? (JSON.parse(cached) as BlogArticle[]) : null;
  } catch {
    return null;
  }
};

const persistCachedArticles = (articles: BlogArticle[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(articles));
  } catch {
    // ignore cache write failures
  }
};

const inferCategory = (article: BlogArticle, isRTL: boolean) => {
  const source = `${article.title} ${article.slug}`.toLowerCase();

  if (
    source.includes('حشرة') ||
    source.includes('قوارض') ||
    source.includes('فئران') ||
    source.includes('صراصير') ||
    source.includes('النمل') ||
    source.includes('pest') ||
    source.includes('rodent') ||
    source.includes('termite')
  ) {
    return isRTL ? 'مكافحة الآفات' : 'Pest Control';
  }

  if (
    source.includes('تنظيف') ||
    source.includes('تعقيم') ||
    source.includes('مكاتب') ||
    source.includes('منازل') ||
    source.includes('clean') ||
    source.includes('office')
  ) {
    return isRTL ? 'التنظيف والتعقيم' : 'Cleaning';
  }

  return isRTL ? 'دليل عملي' : 'Practical Guide';
};

const Blog = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const selectedSlug = useMemo(() => new URLSearchParams(location.search).get('post'), [location.search]);

  useEffect(() => {
    const controller = new AbortController();

    const loadArticles = async () => {
      const cachedArticles = readCachedArticles();

      if (cachedArticles?.length) {
        setArticles(cachedArticles);
        setLoading(false);
      } else {
        setLoading(true);
      }
      setHasError(false);

      try {
        const response = await fetch(getBlogFeedUrl(selectedSlug), {
          signal: controller.signal,
          headers: {
            Accept: 'application/javascript, text/plain, */*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load blog feed: ${response.status}`);
        }

        const payload = await response.text();
        const parsedArticles = parseEmbeddedArticles(payload);
        setArticles(parsedArticles);
        persistCachedArticles(parsedArticles);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        reportAppError({ scope: 'blog-feed-load', error });
        setHasError(true);
        setArticles(cachedArticles ?? []);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadArticles();

    return () => {
      controller.abort();
    };
  }, [selectedSlug]);

  const selectedArticle = useMemo(
    () => (selectedSlug ? articles.find((article) => article.slug === selectedSlug) ?? null : null),
    [articles, selectedSlug]
  );

  const listArticles = useMemo(
    () => articles.filter((article) => article.slug !== selectedSlug),
    [articles, selectedSlug]
  );

  const heroHighlights = [
    {
      icon: Sparkles,
      title: t('blog.featured_topics.cleaning.title'),
      desc: t('blog.featured_topics.cleaning.desc'),
      color: 'bg-amber-500',
    },
    {
      icon: Shield,
      title: t('blog.featured_topics.pest.title'),
      desc: t('blog.featured_topics.pest.desc'),
      color: 'bg-blue-600',
    },
    {
      icon: Zap,
      title: t('blog.featured_topics.solutions.title'),
      desc: t('blog.featured_topics.solutions.desc'),
      color: 'bg-emerald-500',
    },
  ];

  const pageTitle = selectedArticle ? `${selectedArticle.title} | ${t('seo.blog.title')}` : t('seo.blog.title');
  const pageDescription = selectedArticle?.excerpt || t('seo.blog.description');
  const canonicalUrl = getCanonicalUrl(selectedSlug);
  const structuredData = selectedArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: selectedArticle.title,
        description: selectedArticle.excerpt,
        image: selectedArticle.image ? [selectedArticle.image] : undefined,
        datePublished: selectedArticle.isoDate,
        dateModified: selectedArticle.isoDate,
        mainEntityOfPage: canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'Forty',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Forty',
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: t('seo.blog.title'),
        description: t('seo.blog.description'),
        url: canonicalUrl,
      };

  return (
    <Layout variant="blog">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        image={selectedArticle?.image}
        type={selectedArticle ? 'article' : 'website'}
        structuredData={structuredData}
      />

      <section id="hero" className="gradient-bg relative flex min-h-[60vh] items-center overflow-hidden pb-20 pt-32">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-white/5 blur-3xl dark:bg-blue-400/10" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6 animate-fadeInUp">
                <BookOpen className="w-4 h-4" />
                <span>{t('blog.knowledge_tag')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fadeInUp">
                {selectedArticle ? selectedArticle.title : t('blog.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                {selectedArticle ? selectedArticle.excerpt : t('blog.subtitle')}
              </p>
              <p className="text-base text-white/70 mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                {selectedArticle ? (isRTL ? 'مقالة عملية محدثة ضمن مكتبة فورتي المعرفية.' : 'A practical article from Forty knowledge library.') : t('blog.extra')}
              </p>

              <div className="flex flex-wrap gap-4 animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
                <a
                  href={selectedArticle ? '#article-detail' : '#blog-content'}
                  className="group inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 font-black text-blue-900 transition-all hover:scale-[1.02] hover:shadow-2xl dark:bg-slate-100 dark:text-slate-900"
                >
                  <span>{selectedArticle ? (isRTL ? 'اقرأ المقال' : 'Read article') : t('blog.cta')}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </a>

                {selectedArticle ? (
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black text-white backdrop-blur-md transition hover:bg-white/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800/80"
                  >
                    <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    <span>{isRTL ? 'عودة لجميع المقالات' : 'Back to all posts'}</span>
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/55 md:p-12">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
                  <Clock className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-black text-white mb-6">
                  {selectedArticle ? (isRTL ? 'ملخص سريع' : 'Quick Snapshot') : t('blog.sidebar_title')}
                </h2>

                {selectedArticle ? (
                  <div className="space-y-4 text-white/90">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4">
                      <CalendarDays className="w-5 h-5 text-cyan-300" />
                      <span className="font-bold">{selectedArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4">
                      <Clock className="w-5 h-5 text-amber-300" />
                      <span className="font-bold">
                        {estimateReadMinutes(selectedArticle)} {isRTL ? 'دقائق قراءة تقريبًا' : 'min read'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4">
                      <Shield className="w-5 h-5 text-emerald-300" />
                      <span className="font-bold">{inferCategory(selectedArticle, isRTL)}</span>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-5">
                    {(t('blog.sidebar_items', { returnObjects: true }) as string[]).map((item, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-white/90 text-lg font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {heroHighlights.map((topic, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${topic.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-blue-900 dark:text-white mb-3">{topic.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id={selectedArticle ? 'article-detail' : 'blog-content'} className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-8 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 dark:text-white mb-6">
              {selectedArticle ? (isRTL ? 'تفاصيل المقال' : 'Article Details') : t('blog.main_title')}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              {selectedArticle ? selectedArticle.excerpt : t('blog.main_desc')}
            </p>
          </div>

          {loading ? (
            <section className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: selectedArticle ? 2 : 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="h-56 bg-gray-100 dark:bg-slate-800 animate-pulse" />
                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse" />
                    <div className="h-8 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                    <div className="h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
                  </div>
                </div>
              ))}
            </section>
          ) : hasError ? (
            <section className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-sm p-8 md:p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-black text-blue-900 dark:text-white mb-4">{t('blog.error.failed_to_load')}</h3>
              <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{t('blog.error.connection_issue')}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
                >
                  {t('blog.error.reload')}
                </button>
                <a
                  href={getBlogFeedUrl(selectedSlug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-6 py-3 font-black text-blue-900 dark:text-white transition hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  {isRTL ? 'فتح المصدر الخارجي' : 'Open source feed'}
                </a>
              </div>
            </section>
          ) : selectedArticle ? (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] max-w-7xl mx-auto">
              <article className="overflow-hidden rounded-[2.75rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                {selectedArticle.image ? (
                  <div className="relative h-[320px] overflow-hidden bg-slate-100 md:h-[420px]">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-8 md:p-10">
                      <div className="flex flex-wrap items-center gap-3 text-sm font-black text-white/90">
                        <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-md">
                          {inferCategory(selectedArticle, isRTL)}
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-md">
                          {estimateReadMinutes(selectedArticle)} {isRTL ? 'دقائق' : 'min'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="p-6 md:p-10 lg:p-12">
                  <div className={`mb-10 flex flex-wrap items-center justify-between gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="space-y-4">
                      <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-black text-blue-600 transition hover:text-blue-700"
                      >
                        <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{isRTL ? 'العودة لجميع المقالات' : 'Back to all articles'}</span>
                      </Link>
                      <h3 className="text-3xl md:text-5xl font-black text-blue-900 dark:text-white leading-tight">{selectedArticle.title}</h3>
                      <p className="max-w-3xl text-lg font-medium leading-relaxed text-gray-500 dark:text-slate-400">{selectedArticle.excerpt}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
                        <User className="h-4 w-4" />
                        <span>{t('blog.by_team')}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm font-black text-gray-500 dark:text-slate-400">
                        <CalendarDays className="h-4 w-4" />
                        <span>{selectedArticle.date}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="blog-article-content max-w-none text-gray-700 dark:text-slate-300 [&_a]:font-bold [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-blue-900 dark:[&_h2]:text-white [&_p]:mb-5 [&_p]:text-lg [&_p]:leading-9 [&_strong]:font-black [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:ps-6"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content || `<p>${selectedArticle.excerpt}</p>` }}
                  />
                </div>
              </article>

              <aside className="space-y-6">
                <section className="rounded-[2.25rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h4 className="text-2xl font-black text-blue-900 dark:text-white mb-4">{isRTL ? 'مقالات أخرى' : 'More Articles'}</h4>
                  <div className="space-y-4">
                    {listArticles.slice(0, 5).map((article) => (
                      <Link
                        key={article.id}
                        to={`/blog?post=${encodeURIComponent(article.slug)}`}
                        className="block rounded-2xl border border-gray-100 dark:border-slate-800 p-4 transition hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
                      >
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                          {inferCategory(article, isRTL)}
                        </p>
                        <h5 className="text-lg font-black text-blue-900 dark:text-white leading-snug">{article.title}</h5>
                        <p className="mt-2 text-sm font-medium leading-6 text-gray-500 dark:text-slate-400">{article.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2.25rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg">
                  <h4 className="text-2xl font-black mb-3">{isRTL ? 'تحتاج خدمة مباشرة؟' : 'Need direct help?'}</h4>
                  <p className="text-white/85 font-medium leading-7 mb-5">
                    {isRTL
                      ? 'إذا كانت المشكلة عندك قائمة الآن، لا تكتفِ بالقراءة. اطلب معاينة أو تواصل معنا مباشرة.'
                      : 'If the issue is happening now, do not stop at reading. Request an inspection or contact us directly.'}
                  </p>
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-slate-50"
                  >
                    <span>{isRTL ? 'ابدأ الحجز' : 'Start booking'}</span>
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </section>
              </aside>
            </div>
          ) : (
            <section className="max-w-7xl mx-auto space-y-10">
              {articles.length > 0 ? (
                <>
                  <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
                    <Link
                      to={`/blog?post=${encodeURIComponent(articles[0].slug)}`}
                      className="group overflow-hidden rounded-[2.75rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition hover:-translate-y-1"
                    >
                      <div className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative min-h-[280px] overflow-hidden bg-slate-100">
                          {articles[0].image ? (
                            <img
                              src={articles[0].image}
                              alt={articles[0].title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loading="eager"
                            />
                          ) : null}
                        </div>
                        <div className={`flex flex-col justify-between p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div>
                            <div className="mb-4 inline-flex rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-black text-blue-600 dark:text-blue-300">
                              {isRTL ? 'الأحدث الآن' : 'Latest now'}
                            </div>
                            <h3 className="text-3xl font-black leading-tight text-blue-900 dark:text-white">{articles[0].title}</h3>
                            <p className="mt-4 text-gray-500 dark:text-slate-400 text-lg font-medium leading-8">{articles[0].excerpt}</p>
                          </div>
                          <div className="mt-8 flex items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-3 text-sm font-bold text-gray-400 dark:text-slate-500">
                              <span>{articles[0].date}</span>
                              <span>•</span>
                              <span>{estimateReadMinutes(articles[0])} {isRTL ? 'دقائق قراءة' : 'min read'}</span>
                            </div>
                            <span className="inline-flex items-center gap-2 text-sm font-black text-blue-600">
                              {isRTL ? 'اقرأ المزيد' : 'Read more'}
                              <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="grid gap-6">
                      {articles.slice(1, 3).map((article) => (
                        <Link
                          key={article.id}
                          to={`/blog?post=${encodeURIComponent(article.slug)}`}
                          className="group grid overflow-hidden rounded-[2.25rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:grid-cols-[0.8fr_1.2fr]"
                        >
                          <div className="min-h-[200px] overflow-hidden bg-slate-100">
                            {article.image ? (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : null}
                          </div>
                          <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                              {inferCategory(article, isRTL)}
                            </p>
                            <h3 className="text-2xl font-black text-blue-900 dark:text-white leading-snug">{article.title}</h3>
                            <p className="mt-3 text-gray-500 dark:text-slate-400 font-medium leading-7">{article.excerpt}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {articles.slice(3).map((article) => (
                      <Link
                        key={article.id}
                        to={`/blog?post=${encodeURIComponent(article.slug)}`}
                        className="group overflow-hidden rounded-[2.25rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-60 overflow-hidden bg-slate-100">
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : null}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-5">
                            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur-md">
                              {inferCategory(article, isRTL)}
                            </span>
                          </div>
                        </div>
                        <div className={`space-y-4 p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500">
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{estimateReadMinutes(article)} {isRTL ? 'دقائق' : 'min'}</span>
                          </div>
                          <h3 className="text-2xl font-black text-blue-900 dark:text-white leading-snug">{article.title}</h3>
                          <p className="text-gray-500 dark:text-slate-400 font-medium leading-7">{article.excerpt}</p>
                          <div className="inline-flex items-center gap-2 text-sm font-black text-blue-600">
                            <span>{isRTL ? 'اقرأ المقال' : 'Read article'}</span>
                            <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <section className="max-w-3xl mx-auto rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                    <BookOpen className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-blue-900 dark:text-white mb-4">
                    {isRTL ? 'لا توجد مقالات معروضة حاليًا' : 'No articles are available right now'}
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 font-medium leading-8">
                    {isRTL
                      ? 'عند توفر المقالات من المصدر ستظهر هنا مباشرة مع عرض منظم وأسهل للقراءة.'
                      : 'When articles are available from the source, they will appear here in a cleaner reading layout.'}
                  </p>
                </section>
              )}
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Blog;

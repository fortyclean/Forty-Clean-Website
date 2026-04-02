import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import { ArrowRight, CheckCircle2, BookOpen, Clock, User, Sparkles, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [hasError, setHasError] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const post = params.get('post');
  const blogEmbedUrl = post
    ? `https://app.trysoro.com/api/embed/961a0745-9ae5-4dd2-a648-348e12fa7dff?post=${encodeURIComponent(post)}`
    : 'https://app.trysoro.com/api/embed/961a0745-9ae5-4dd2-a648-348e12fa7dff';

  const featuredTopics = [
    {
      icon: Sparkles,
      title: t('blog.featured_topics.cleaning.title'),
      desc: t('blog.featured_topics.cleaning.desc'),
      color: 'bg-amber-500'
    },
    {
      icon: Shield,
      title: t('blog.featured_topics.pest.title'),
      desc: t('blog.featured_topics.pest.desc'),
      color: 'bg-blue-600'
    },
    {
      icon: Zap,
      title: t('blog.featured_topics.solutions.title'),
      desc: t('blog.featured_topics.solutions.desc'),
      color: 'bg-emerald-500'
    }
  ];

  return (
    <Layout variant="blog">
      <Helmet>
        <title>{t('seo.blog.title')}</title>
        <meta name="description" content={t('seo.blog.description')} />
      </Helmet>
      <section id="hero" className="min-h-[60vh] gradient-bg flex items-center pt-32 pb-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6 animate-fadeInUp">
                <BookOpen className="w-4 h-4" />
                <span>{t('blog.knowledge_tag')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fadeInUp">
                {t('blog.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                {t('blog.subtitle')}
              </p>
              <p className="text-base text-white/70 mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                {t('blog.extra')}
              </p>
              <a 
                href="#blog-content" 
                className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-4 rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all animate-fadeInUp group" 
                style={{ animationDelay: '0.35s' }}
              >
                <span>{t('blog.cta')}</span>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
              </a>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg shadow-2xl relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-6">{t('blog.sidebar_title')}</h2>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="py-20 bg-white -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTopics.map((topic, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className={`w-14 h-14 ${topic.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <topic.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-3">{topic.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="blog-content" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-8 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-6">{t('blog.main_title')}</h2>
            <p className="text-gray-500 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              {t('blog.main_desc')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <section className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100">
              <div className={`flex flex-col md:flex-row items-center justify-between mb-12 gap-6 ${i18n.language === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h2 className="text-3xl font-black text-blue-900 mb-2">{t('blog.post_title')}</h2>
                  <p className="text-gray-400 font-bold">{t('blog.post_desc')}</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-2xl text-blue-600 font-bold">
                  <User className="w-5 h-5" />
                  <span>{t('blog.by_team')}</span>
                </div>
              </div>

              <div id="soro-blog-container" className="min-h-[400px] relative">
                {hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl animate-fadeIn">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                    <h3 className="text-2xl font-black text-blue-900 mb-2">
                      {t('blog.error.failed_to_load')}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                      {t('blog.error.connection_issue')}
                    </p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="gradient-btn text-white px-8 py-3 rounded-xl font-bold"
                    >
                      {t('blog.error.reload')}
                    </button>
                  </div>
                )}
                {!hasError && (
                  <iframe
                    src={blogEmbedUrl}
                    title="Forty Blog Embed"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    className="w-full min-h-[640px] rounded-2xl border border-gray-100"
                    onError={() => setHasError(true)}
                  />
                )}
              </div>
              
              <noscript>
                <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100">
                  <p className="text-red-600 font-bold text-lg">{t('blog.noscript')}</p>
                </div>
              </noscript>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Blog;

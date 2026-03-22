interface GalleryItem {
  webp: string;
  png: string;
  alt: string;
}

interface GallerySectionProps {
  title: string;
  subtitle: string;
  items: GalleryItem[];
}

const GallerySection = ({ title, subtitle, items }: GallerySectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-lg group bg-gray-100">
              <picture>
                <source srcSet={item.webp} type="image/webp" />
                <source srcSet={item.png} type="image/png" />
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.png}
                  alt={item.alt}
                  className="w-full h-72 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

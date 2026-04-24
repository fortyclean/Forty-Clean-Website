import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { saveContactInteraction } from '../lib/firebase';

type TrackedContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  channel: 'whatsapp' | 'phone';
  section: string;
  service?: 'cleaning' | 'pest';
};

const TrackedContactLink = ({
  channel,
  section,
  service,
  href,
  target,
  rel,
  onClick,
  ...props
}: TrackedContactLinkProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      !href ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const width = window.innerWidth;
    const deviceType =
      width < 768 ? 'mobile' :
      width < 1024 ? 'tablet' :
      width >= 1024 ? 'desktop' :
      'unknown';

    void saveContactInteraction({
      type: channel,
      page: location.pathname,
      section,
      language: i18n.language === 'en' ? 'en' : 'ar',
      deviceType,
      service,
    });
  };

  return <a {...props} href={href} target={target} rel={rel} onClick={handleClick} />;
};

export default TrackedContactLink;

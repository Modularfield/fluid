import type {TypeFromSelection} from 'groqd';

import {cx} from 'class-variance-authority';
import Autoplay from 'embla-carousel-autoplay';
import {useMemo} from 'react';

import type {ANNOUCEMENT_BAR_FRAGMENT} from '~/qroq/fragments';

import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';

import {IconArrowRight} from '../icons/IconArrowRight';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/Carousel';

type AnnoucementBarProps = TypeFromSelection<typeof ANNOUCEMENT_BAR_FRAGMENT>;

export function AnnouncementBar() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const annoucementBar = header?.annoucementBar;
  const plugins = useMemo(
    () =>
      header?.autoRotateAnnoucements
        ? [Autoplay({delay: 5000, stopOnMouseEnter: true})]
        : [],
    [header],
  );

  const cssVars = useSettingsCssVars({
    selector: `#announcement-bar`,
    settings: {
      colorScheme: header?.annoucementBarColorScheme!,
      customCss: null,
      hide: null,
      padding: null,
    },
  });

  const isActive = annoucementBar?.length! > 1;

  if (!annoucementBar) return null;

  return (
    <section className="bg-background text-foreground" id="announcement-bar">
      <div className="container">
        <style dangerouslySetInnerHTML={{__html: cssVars}} />
        <Carousel opts={{active: isActive}} plugins={plugins}>
          <CarouselContent className="relative">
            {annoucementBar?.map((item) => (
              <CarouselItem key={item._key}>
                <Item _key={item._key} link={item.link} text={item.text} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isActive && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function Item(props: AnnoucementBarProps) {
  if (!props.text) return null;

  const className = cx('flex w-full justify-center py-3 text-center');

  return props.link ? (
    <SanityInternalLink
      className={cx(['group', className])}
      data={{
        _key: props.link.slug.current,
        _type: 'internalLink',
        anchor: null,
        link: props.link,
        name: props.text,
      }}
    >
      <p className="flex items-center text-sm underline-offset-4 group-hover:underline">
        <span className="relative z-[2] block bg-background pr-2">
          {props.text}
        </span>
        <span className="-translate-x-[2px] transition-transform group-hover:translate-x-[-0.15px]">
          <IconArrowRight />
        </span>
      </p>
    </SanityInternalLink>
  ) : (
    <p className={className}>{props.text}</p>
  );
}

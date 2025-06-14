import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import { currentYear, imageLabel } from "../consts";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Icon Gallery Viewing Room - Tears for Fears</title>
      </Head>
      <main className='mx-auto max-w-[1960px] p-4 md:p-7 xl:p-10'>
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className='columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5'>
          <div className='after:content relative mb-5 flex h-[340px] flex-col items-center justify-center gap-5 overflow-hidden rounded-lg bg-white/10 px-6 pb-11 pt-6 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:h-[420px] lg:pt-1'>
            <Logo />
            <h2 className='text-base  uppercase tracking-wide text-white/75'>
              Icon Gallery <br></br>Viewing Room
            </h2>
            {/* // Keeping for reference */}
            {/* <h1 className=' mb-0 text-3xl  uppercase tracking-widest lg:text-4xl xl:text-4xl'>
            Tears <span className="text-xl tracking-normal">for</span> Fears
            </h1> */}
            {/* <p className='-mt-3 max-w-[40ch]  text-base tracking-wide text-white sm:max-w-[32ch]'>
              by Steve Parke
            </p> */}
            <p className='mt-2 max-w-[40ch] text-sm tracking-wide text-white/75 sm:max-w-[32ch]'>
              Curated for David Lobato
            </p>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className='after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight'
            >
              <Image
                alt={`Icon Gallery ${imageLabel}`}
                className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder='blur'
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes='(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw'
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className='grid grid-cols-1 gap-2 p-6 text-center  text-white/50 sm:p-12'>
        <p className='text-m hover:text-white'>
          <a href='https://icongallery.com'>
            Icon Gallery &nbsp;&nbsp;| &nbsp;&nbsp;Fine-Art Music Photography
          </a>
        </p>
        <p className='text-xs'>
          <a href='https://icongallery.com/copyright/' title='Copyright Notice'>
            {` ©${currentYear} Icon Gallery LLC`}
          </a>
        </p>
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "asc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}

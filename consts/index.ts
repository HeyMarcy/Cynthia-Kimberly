// TODO: consolidate types

type CurrentImageProps = {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
};

export const DIRECTORY_NAME = "david-lobato";

export const imageLabel = (currentImage: CurrentImageProps) =>
  currentImage.public_id.slice(DIRECTORY_NAME.length + 1, -7);

export const aspectRatio = (currentImage: CurrentImageProps) =>
  Number(currentImage.width) / Number(currentImage.height);

const currDate = Date.now();
export const currentYear = new Date(currDate).getFullYear();

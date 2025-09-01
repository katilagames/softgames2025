import Logger from "./Logger";

export enum LAYOUT_TYPE {
  VERTICAL = 1,
  HORIZONTAL = 2,
  SQUARE = 3,
}

export const layoutSizes = {
  [LAYOUT_TYPE.VERTICAL]: {
    width: 1080,
    height: 1920 
  },
  [LAYOUT_TYPE.HORIZONTAL]: {
    width: 1920,
    height: 1080 
  },
  [LAYOUT_TYPE.SQUARE]: {
    width: 1920,
    height: 1920 
  }
}

export const getCurrentLayoutType = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // percentage of size difference to use squared layout
  const layoutCheckMargin = 0.1;
  const squareRatio = 1;

  if (screenWidth > screenHeight) {
    const screenRatio = screenWidth/screenHeight;
    if (Math.abs(squareRatio - screenRatio) < layoutCheckMargin) {
      return LAYOUT_TYPE.SQUARE;
    }

    return LAYOUT_TYPE.HORIZONTAL;
  } else if (screenWidth < screenHeight) {
    const screenRatio = screenHeight/screenWidth;
    if (Math.abs(squareRatio - screenRatio) < layoutCheckMargin) {
      return LAYOUT_TYPE.SQUARE;
    }

    return LAYOUT_TYPE.VERTICAL;
  }
}

export const getGameSize = () => {
  const layoutType = getCurrentLayoutType();
  Logger.info(`layoutType: ${layoutType}`);
  return layoutSizes[layoutType];
}
export const radianToDegree = (radian: number) => {
  return (radian * 180) / Math.PI;
}
export const degreeToRadian = (degree: number) => {
  return (degree * Math.PI) / 180;
}
export const getFromRange = (maxNumber: number) => {
  return -maxNumber + (Math.random() * 2 * maxNumber);
}

export const plusMinus = (number: number) => {
  return Math.random() < .5 ? -number : number;
}
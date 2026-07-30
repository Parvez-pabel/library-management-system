export const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min)).toString();
};
export const getOtpExpiryTime = (minutesInFuture = 2) => {
  return new Date(Date.now() + minutesInFuture * 60 * 1000);
};

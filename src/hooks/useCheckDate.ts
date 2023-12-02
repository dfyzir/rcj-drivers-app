export const useCheckDate = () => {
  const currentDate = new Date().toISOString();
  let sevenDaysAhead = new Date();
  const sevenDaysFromNow = new Date(
    sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7)
  ).toISOString();

  const isExpired = (date: string) => {
    return date < currentDate;
  };

  const isExpireSoon = (date: string) => {
    return date < sevenDaysFromNow && date > currentDate;
  };

  return { isExpired, isExpireSoon };
};

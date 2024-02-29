export const formatDateToString = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
};

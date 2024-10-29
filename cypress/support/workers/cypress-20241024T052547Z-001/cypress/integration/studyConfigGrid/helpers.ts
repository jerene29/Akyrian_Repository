export const getRelativeDayOffsetWording = (relativeDayOffset: number) => {
  if (relativeDayOffset === 0) {
    return 'day';
  }

  return relativeDayOffset > 1
    ? 'days from previous visit'
    : 'day from previous visit';
};

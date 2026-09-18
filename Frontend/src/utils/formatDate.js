export default (date) => {
  if (date !== undefined) {
    return new Intl.DateTimeFormat().format(new Date(date));
  }
  return '';
};

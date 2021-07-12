const camelize = str => str
  .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  ))
  .replace(/\s+/g, '');

export default camelize;

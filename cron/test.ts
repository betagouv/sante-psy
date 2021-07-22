const firstFunction = async (index) => {
  console.log(`start ${index}`);
  await new Promise<string>((resolve) => {
    setTimeout(() => resolve('ok'), Math.random() * 1000);
  });
  console.log(`end ${index}`);
};

const values = [0, 1, 2, 3, 4, 5];
const secondFunction = async () => {
  console.log('Start');
  await Promise.all(values.map((i) => firstFunction(i)));
  console.log('End');
};

console.log("C'est parti");
secondFunction();
console.log("C'est déja fini");

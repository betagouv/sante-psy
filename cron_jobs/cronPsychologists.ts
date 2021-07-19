import psychologists from '@db/psychologists';

const reactivatePsychologists = async () : Promise<void> => {
  const results = await psychologists.reactivate();
  console.log(`${results} psychologists reactivated`);
};

export default { reactivatePsychologists };

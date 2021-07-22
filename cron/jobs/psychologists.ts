import psychologists from '../../db/psychologists';

const reactivatePsychologists = async () : Promise<boolean> => {
  const results = await psychologists.reactivate();
  console.log(`${results} psychologists reactivated`);
  return true;
};

export default { reactivatePsychologists };

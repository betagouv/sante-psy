import { reactivate } from '../db/psychologists';

const reactivatePsychologists = async () : Promise<void> => {
  const results = await reactivate();
  console.log(`${results} psychologists reactivated`);
};

export default { reactivatePsychologists };

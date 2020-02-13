import Chance from 'chance';

const chance = new Chance();
export default {
  random: {
    string: () => {
      return chance.string();
    }
  }
};

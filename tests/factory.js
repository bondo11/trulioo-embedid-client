import Chance from 'chance';

const chance = new Chance();
export default {
  random: {
    string: () => {
      return chance.string();
    },
    url: () => {
      return chance.url();
    },
    guidToken: () => {
      return chance.guid().replace(/-/g, '');
    },
    errorStatus: () => {
      return chance.integer({
        min: 400,
        max: 500
      });
    }
  }
};

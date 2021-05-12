import config from '../utils/config';

function getConfig(req, res) {
  res.json(config);
}

export default {
  getConfig,
};

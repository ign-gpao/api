const { Validator } = require('jsonschema');

module.exports = function checkIdsSchema(ids) {
  const v = new Validator();

  const schema = {
    type: 'object',
    required: [
      'ids',
    ],
    properties: {
      ids: {
        type: 'array',
        items: {
          type: 'integer',
        },
      },
    },
  };

  return v.validate(ids, schema).valid;
};

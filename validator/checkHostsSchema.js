const { Validator } = require('jsonschema');

module.exports = function checkHostsSchema(hosts) {
  const v = new Validator();

  const schema = {
    type: 'object',
    required: [
      'hosts',
    ],
    properties: {
      hosts: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  };

  return v.validate(hosts, schema).valid;
};

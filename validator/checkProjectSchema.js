const { Validator } = require('jsonschema');

module.exports = function checkProjectSchema(project) {
  // AB : source => https://www.npmjs.com/package/jsonschema
  const v = new Validator();

  const schema = {
    type: 'object',
    required: ['projects'],
    properties: {
      projects: {
        type: 'array',
        items: {
          required: ['jobs'],
          properties: {
            name: {
              type: 'string',
            },
            jobs: {
              type: 'array',
              items: {
                required: ['name', 'command'],
                properties: {
                  name: {
                    type: 'string',
                  },
                  command: {
                    type: 'string',
                  },
                  deps: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'integer',
                        },
                      },
                    },
                  },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
            deps: {
              type: 'array',
              items: {
                properties: {
                  id: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return v.validate(project, schema).valid;
};

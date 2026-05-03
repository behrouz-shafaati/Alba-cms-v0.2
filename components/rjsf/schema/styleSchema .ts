export const styleSchema = {
  type: 'object',
  title: 'Style',
  properties: {
    display: {
      type: 'object',
      title: 'Display',
      'x-responsive': true,
      'x-field': 'ResponsiveSelectField',
      enum: ['flex', 'block', 'unset'],
      default: 'unset',
    },

    flexSettings: {
      type: 'object',
      title: 'Flex',
      properties: {
        flexDirection: {
          type: 'object',
          enum: ['row', 'row-reverse', 'column', 'column-reverse'],
          default: 'row',
          'x-responsive': true,
          'x-field': 'ResponsiveSelectField',
        },
        justifyContent: {
          type: 'object',
          enum: [
            'start',
            'center',
            'end',
            'space-between',
            'space-around',
            'space-evenly',
          ],
          default: 'start',
          'x-responsive': true,
          'x-field': 'ResponsiveSelectField',
        },
        alignItems: {
          type: 'object',
          enum: ['stretch', 'center', 'start', 'end'],
          default: 'stretch',
          'x-responsive': true,
          'x-field': 'ResponsiveSelectField',
        },
        // justifyItems: {
        //   type: 'object',
        //   enum: ['stretch', 'center', 'start', 'end'],
        //   default: 'stretch',
        //   'x-responsive': true,
        //   'x-field': 'ResponsiveSelectField',
        // },

        gap: {
          type: 'object',
          title: 'Gap',
          'x-responsive': true,
          'x-field': 'ResponsiveNumber',
        },
      },
    },
  },
}

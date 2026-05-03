import generateObjectId from '@/lib/utils/objectId'
export const columnBlockDefaults = () => {
  return {
    sections: [
      {
        id: generateObjectId(),
        type: 'internalSection',
        width: 12,
        blocks: [],
        styles: {},
      },
    ],
    content: {
      colspans: '12',
    },
    styles: {},
  }
}

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
    settings: {
      sectionColumns: '12',
    },
    styles: {},
  }
}

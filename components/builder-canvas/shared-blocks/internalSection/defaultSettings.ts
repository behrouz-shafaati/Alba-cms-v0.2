import generateObjectId from '@/lib/utils/objectId'
export const columnBlockDefaults = () => {
  return {
    sections: [
      {
        id: generateObjectId(),
        type: 'internalSection',
        with: 12,
        blocks: [],
        styles: {},
      },
    ],
    styles: {},
  }
}

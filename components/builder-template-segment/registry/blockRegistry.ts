// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '@/lib/block/singletonBlockRegistry'
import { blockRegistry as templateRegisterlock } from '@/components/builder-template/registry/blockRegistry'

export const templateSegmentblockRegistry = {
  // ...
}

export const blockRegistry = {
  ...templateSegmentblockRegistry,
  ...templateRegisterlock,
  // ...
}

// registerBlock(templateSegmentblockRegistry)

import { Preset } from 'unocss'

export const unoPresets: Preset = {
  name: 'uno-presets',
  rules: [
    [/^m-([.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    [/^p-([.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
  ],
  variants: [
    /* ... */
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'custom-cover': 'relative flex',
      'cover-image': 'flex-1 h-300',
      'cover-text': 'absolute bottom-0 text-16px h-30px lh-30px bg-black bg-op-20 w-100%',
    },
  ],
}

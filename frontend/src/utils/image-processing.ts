import { DeltaStatic } from 'react-quill-new'
import { Image } from 'image-js'

export const postImageInsertProcessing = async (value: string, delta: DeltaStatic) => {
  const imageInsertOp = delta.ops.find(element => typeof element.insert === 'object' && typeof element.insert.image === 'string')
  if (!imageInsertOp) {
    return value
  } else {
    const originalImageBase64 = (imageInsertOp.insert as { image: string }).image
    const processedImage = await processImage(originalImageBase64)
    const processedBase64 = processedImage.toDataURL()
    return value.replace(originalImageBase64, processedBase64)
  }
}

const processImage = async (originalImageBase64: string): Promise<Image> => {
  const unprocessed = await Image.load(originalImageBase64)
  return resizeImageIfNecessary(unprocessed)
}

export const resizeImageIfNecessary = async (image: Image) => {
  const IMAGE_DIM_THRESH = 500
  const biggestSideOverThresh: 'width' | 'height' | null = Math.max(image.width, image.height) < IMAGE_DIM_THRESH ? null : (image.width > image.height ? 'width' : 'height')

  if (!biggestSideOverThresh) {
    console.log(`Image is not over threshold ${ IMAGE_DIM_THRESH }px`)
    return image
  }

  if (biggestSideOverThresh === 'width') {
    return image.resize({ preserveAspectRatio: true, width: IMAGE_DIM_THRESH })
  } else {
    return image.resize({ preserveAspectRatio: true, height: IMAGE_DIM_THRESH })
  }
}

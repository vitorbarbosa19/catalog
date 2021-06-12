import { storage } from '../../../Firebase'
import { readAndCompressImage } from 'browser-image-resizer'

const imageToLink = async (file:any,  path:string, fileName:string) => {
    try {
        const timestamp = Date.now();
        const image = storage.child(`${path}/${fileName}-${timestamp}`);
        const compressed = await readAndCompressImage(file, { quality: 0.65 });
        const uploadTask = await image.put(compressed);
        const imgUrl = await uploadTask.ref.getDownloadURL();
        return imgUrl
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

export default imageToLink
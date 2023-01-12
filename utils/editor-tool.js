import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import SimpleImage from '@editorjs/simple-image'
import Underline from '@editorjs/underline';
import Header from '@editorjs/header';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
import { makeid } from '../components/ebook-modal';
import Undo from 'editorjs-undo';

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a Sub Title',
      levels: [2],
      defaultLevel: 2,
      inlineTools: true,
      shortcut: 'CMD+SHIFT+H',
    }
  },
  embed: { class: Embed, shortcut: "CMD+SHIFT+E" },
  image: {
    class: Image,
    config: {
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file) {
          if (!file) return {
            success: false,
            file: {
              url: ""
            }
          }
          const imageRef = ref(storage, `/posts/image/${makeid(18)}`);
          return uploadBytes(imageRef, file).then(async snapshot => {
            const downloadUrl = await getDownloadURL(imageRef);
            return {
              success: true,
              file: {
                url: downloadUrl
              }
            }
          })
        }
      },
      shortcut: "CMD+SHIFT+P"
    },
  },
  delimiter: { class: Delimiter, shortcut: "CMD+SHIFT+D" },
  underline: { class: Underline, shortcut: "CMD+U" },
  simpleImage: SimpleImage,
}

export { Undo }
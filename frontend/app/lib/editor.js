import * as Config from "./config.js";

// this instance queue makes sure that there are not several editor instances
// loaded in parallel and thus become visible on the screen. it queues all
// incoming promises and executes them only when their previous promise has
// fulfilled
let instanceQueue = null;

const load = async ({ data, parent, onChange, databaseProvider }) => {
  if (instanceQueue === null) {
    instanceQueue = loadInstance({ data, parent, onChange, databaseProvider });
  } else {
    instanceQueue = instanceQueue.then((instance) => {
      instance.destroy();
      return loadInstance({ data, parent, onChange, databaseProvider });
    });
  }

  const instance = await instanceQueue;
  return instance;
};


const loadInstance = async ({ data, parent, onChange, databaseProvider }) => {
  const modules = await Promise.all([
    import("@editorjs/editorjs"),
    import("@editorjs/header"),
    import("@editorjs/link"),
    import("@editorjs/image"),
    import("@editorjs/list"),
    import("@editorjs/code"),
    import("@editorjs/attaches"),
  ]);

  const [
    EditorJS,
    Header,
    Link,
    Image,
    List,
    Code,
    Attaches,
  ] = modules.map((module) => module.default);

  const instance = new EditorJS({
    holder: parent,
    data,
    autofocus: true,
    placeholder: "Let's write an awesome note!",
    hideToolbar: false,
    tools: {
      header: {
        class: Header,
        placeholder: "Note title",
      },
      linkTool: {
        class: Link,
        config: {
          customRequestFunction: async (url) => {
            const metadata = await databaseProvider.fetchURLMetadata(url);

            return {
              "success": 1,
              "url": url,
              "meta": {
                "title": metadata.title,
                "description": metadata.description,
                "image": {
                  "url": metadata.image,
                },
              },
            };
          },
        },
      },
      image: {
        class: Image,
        config: {
          uploader: {
            uploadByFile: async (file) => {
              const fileInfo = await databaseProvider.uploadFile(file);
              return {
                success: 1,
                file: {
                  "url": Config.API_URL + "file/" + fileInfo.id,
                  "size": fileInfo.size,
                  "fileId": fileInfo.id,
                },
              };
            },
            uploadByUrl: async (url) => {
              const fileInfo = await databaseProvider.uploadFileByUrl({
                url,
              });
              return {
                success: 1,
                file: {
                  "url": Config.API_URL + "file/" + fileInfo.id,
                  "size": fileInfo.size,
                  "fileId": fileInfo.id,
                },
              };
            },
          },
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: {
        class: Code,
        config: {
          placeholder: "Enter your code here",
        },
      },
      attaches: {
        class: Attaches,
        config: {
          uploader: async (file) => {
            const fileId = await databaseProvider.uploadFile(file);
            return {
              success: 1,
              file: {
                "url": Config.API_URL + "file/" + fileId,
                "size": file.size,
                "name": file.name,
                "fileId": fileId,
              },
            };
          },
          field: "file",
          types: "application/pdf",
          buttonText: "Select PDF file",
          errorMessage: "File upload failed",
        },
      },
    },
    onChange,
  });

  await instance.isReady;
  return instance;
};


const save = async () => {
  if (!instanceQueue) return false;
  const instance = await instanceQueue;
  await instance.isReady;
  const editorData = await instance.save();
  return editorData;
};


export {
  load,
  save,
};

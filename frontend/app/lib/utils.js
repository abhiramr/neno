import * as Config from "./config.js";

const yyyymmdd = (date) => {
  if (!date) date = new Date();

  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();
  return (
    yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])
  );
};


const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
};


const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};


const makeTimestampHumanReadable = (timestamp) => {
  return (new Date(timestamp)).toString();
};


const getNewNoteObject = () => {
  const note = {
    changes: [],
    creationTime: null,
    editorData: Config.newEditorDataObject,
    id: null,
    isUnsaved: true,
    linkedNotes: [],
    updateTime: null,
    position: {
      x: null,
      y: null,
    },
  };

  Object.seal(note);
  return note;
};


const setNoteTitleByLinkTitleIfUnset = (note, defaultNoteTitle) => {
  // if the note has no title yet, take the title of the link metadata
  const firstLinkBlock = note.editorData.blocks.find(
    (block) => block.type === "linkTool",
  );

  if (
    (note.editorData?.blocks?.[0]?.data?.text
      === defaultNoteTitle)
    && firstLinkBlock
    && typeof firstLinkBlock.data.meta.title === "string"
    && firstLinkBlock.data.meta.title.length > 0
  ) {
    note.editorData.blocks[0].data.text
      = firstLinkBlock.data.meta.title;
  }
};


/*
  @function binaryArrayFind:
    This function performs a binary search in an array of objects that is
    sorted by a specific key in the objects.

  @param sortedArray:
    An array of objects that is sorted by a specific key in the objects.
  @param sortKeyKey:
    They key of the object whose corresponding value is the sort key for
    that object.
  @param sortKeyKey:
    The sort key we want to find.
*/
const binaryArrayFind = function(sortedArray, sortKeyKey, sortKeyToFind) {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, return it
    if (sortedArray[mid][sortKeyKey] === sortKeyToFind) {
      return sortedArray[mid];
    // Else look in left or right half accordingly
    } else if (sortedArray[mid][sortKeyKey] < sortKeyToFind) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
};


/*
  @function binaryArrayIncludes:
    This function performs a binary search in the manner of Array.includes()
    in an array of values that has been sorted with Array.sort().

  @param sortedArray:
    An array of values that is sorted with Array.sort()
  @param valueToLookFor:
    The value we want to find.
*/
const binaryArrayIncludes = function(sortedArray, valueToLookFor) {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, we have it
    if (sortedArray[mid] === valueToLookFor) {
      return true;
    // Else look in left or right half accordingly
    } else if (sortedArray[mid] < valueToLookFor) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
};


function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1
  );


  return bytes.toFixed(dp) + " " + units[u];
}


const shortenText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.trim().substr(0, maxLength) + "…";
  } else {
    return text;
  }
};


const streamToBlob = async (stream, mimeType) => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType },
    },
  );
  const blob = await response.blob();
  return blob;
};


const getUrlForFileId = async (fileId, databaseProvider) => {
  let url;

  if (databaseProvider.constructor.type === "LOCAL") {
    const { readable, mimeType }
      = await databaseProvider.getReadableFileStream(
        fileId,
      );
    const blob = await streamToBlob(readable, mimeType);
    url = URL.createObjectURL(blob);
  } else {
    url = Config.API_URL + "file/" + fileId;
  }

  return url;
};


export {
  yyyymmdd,
  htmlDecode,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  setNoteTitleByLinkTitleIfUnset,
  binaryArrayFind,
  binaryArrayIncludes,
  humanFileSize,
  shortenText,
  streamToBlob,
  getUrlForFileId,
};

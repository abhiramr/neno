const ALLOWED_FILE_TYPES = [
  {
    mimeType: "image/png",
    ending: "png",
  },
  {
    mimeType: "image/jpeg",
    ending: "jpg",
  },
  {
    mimeType: "image/webp",
    ending: "webp",
  },
  {
    mimeType: "image/gif",
    ending: "gif",
  },
  {
    mimeType: "application/pdf",
    ending: "pdf",
  },
];

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 100;

export {
  ALLOWED_FILE_TYPES,
  NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
}
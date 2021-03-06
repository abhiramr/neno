import React from "react";
import IconButton from "./IconButton.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  openImportLinksDialog,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext);

  return <section id="note-controls">
    <div id="note-controls-left">
      <IconButton
        id="button_new"
        title="New note"
        icon="note_add"
        onClick={createNewNote}
      />
      <IconButton
        id="button_upload"
        title="Save note"
        icon="save"
        onClick={handleNoteSaveRequest}
      />
      <IconButton
        id="button_remove"
        disabled={activeNote.isUnsaved}
        title="Remove note"
        icon={activeNote.isUnsaved
          ? "delete_disabled"
          : "delete"
        }
        onClick={async () => {
          await confirm({
            text: "Do you really want to remove this note?",
            confirmText: "Remove note",
            cancelText: "Cancel",
            encourageConfirmation: false,
          });

          removeActiveNote();
        }}
      />
      <IconButton
        id="button_pin"
        disabled={activeNote.isUnsaved}
        title="Pin note"
        icon={activeNote.isUnsaved
          ? "push_pin_disabled"
          : "push_pin"
        }
        onClick={pinOrUnpinNote}
      />
      <IconButton
        id="button_import_links_as_notes"
        title="Import links as notes"
        icon="dynamic_feed"
        onClick={openImportLinksDialog}
      />
    </div>
    <div id="note-controls-right">
      <UnsavedChangesIndicator
        isUnsaved={activeNote.isUnsaved}
        unsavedChanges={unsavedChanges}
      />
    </div>
  </section>;
};

export default NoteControls;

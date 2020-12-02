import React, { useEffect, useRef } from "react";
import NoteListItem from "./NoteListItem.js";
import * as Editor from "./lib/editor.js";
import NoteStats from "./NoteStats.js";
import isEqual from "react-fast-compare";

const Note = ({
  note,
  loadNote,
  displayedLinkedNotes,
  onLinkRemoval,
  setUnsavedChanges,
}) => {
  const previousEditorData = useRef(null);
  const editorData = note?.editorData;

  useEffect(() => {
    const parent = document.getElementById("editor");
    if (!parent) return;

    if (isEqual(editorData?.blocks, previousEditorData.current?.blocks)) {
      return;
    }

    Editor.load({
      data: editorData,
      parent,
      onChange: () => setUnsavedChanges(true),
    })
      .then(() => {
        previousEditorData.current = editorData;
      });
  });

  return <section id="note">
    <div id="editor"></div>
    <div id="links">
      <h2>Links</h2>
      <table id="links-table">
        <tbody>
          {
            displayedLinkedNotes.map((displayedLinkedNote, i) => <NoteListItem
              note={displayedLinkedNote}
              index={i + 1}
              showLinksIndicator={false}
              key={"note-link-list-item-" + displayedLinkedNote.id}
              onClick={() => loadNote(displayedLinkedNote.id)}
              isActive={false}
              onDelete={() => onLinkRemoval(displayedLinkedNote.id)}
            />)
          }
        </tbody>
      </table>
    </div>
    {
      (!note.isUnsaved)
        ? <NoteStats note={note} />
        : ""
    }
  </section>;
};

export default Note;

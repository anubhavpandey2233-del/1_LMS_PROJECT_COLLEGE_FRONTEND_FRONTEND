import React, { useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { useField } from "formik";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";

function TextEditor(props) {
  const [field, meta, helpers] = useField(props);
  const { value } = field;
  const { setValue } = helpers;
  const rteRef = useRef(null);

  // Sync external changes (e.g., row selection, form reset) to the editor
  useEffect(() => {
    const editor = rteRef.current?.editor;
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      {props.label && (
        <FormLabel
          style={{
            fontSize: "0.8rem",
            color: "rgba(0, 0, 0, 0.6)",
            marginBottom: 8,
            display: "block",
          }}
        >
          {props.label}
        </FormLabel>
      )}
      <RichTextEditor
        ref={rteRef}
        extensions={[StarterKit]}
        content={value || ""}
        onUpdate={({ editor }) => {
          setValue(editor.getHTML());
        }}
        sx={{
          "& .ProseMirror": {
            minHeight: "150px",
            padding: "12px",
            outline: "none",
          },
          border: meta.touched && meta.error ? "1px solid #d32f2f" : "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "4px",
          "&:hover": {
            borderColor: meta.touched && meta.error ? "#d32f2f" : "rgba(0, 0, 0, 0.87)",
          },
          "&:focus-within": {
            borderColor: meta.touched && meta.error ? "#d32f2f" : "primary.main",
            borderWidth: "1px",
          },
        }}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        )}
      />
      {meta.touched && meta.error && (
        <FormHelperText error style={{ marginLeft: 4 }}>
          {meta.error}
        </FormHelperText>
      )}
    </div>
  );
}

export default TextEditor;
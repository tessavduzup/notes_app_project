const NoteList = ({ notes, onEdit, onDelete }) => {
  if (!notes.length) {
    return <p>Заметок пока нет</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "2px",
            padding: "12px",
            display: "grid",
            gridTemplateRows: note.description ? "auto auto" : "auto",
            gap: "8px",
          }}
          aria-label={`Заметка: ${note.title}`}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {note.title}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>
              {new Date(note.updated_at).toLocaleString()}
            </div>
            <button onClick={() => onEdit(note)} aria-label={`Редактировать заметку ${note.title}`}>
              Редактировать
            </button>
            <button onClick={() => onDelete(note.id)} style={{color: "red" }} aria-label={`Удалить заметку ${note.title}`}>
              Удалить
            </button>
          </div>
          {note.description && (
            <div
              style={{
                fontSize: "0.9rem",
                color: "#333",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {note.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList;

import { useState, useEffect } from "react";
import * as util from "../util";

export default function NoteEditor({ note, onSave, onCancel }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) {
      setForm({ title: note.title, description: note.description || "" });
      setError("");
    } else {
      setForm({ title: "", description: "" });
      setError("");
    }
  }, [note]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const errMsg = util.validateTitle(form.title) 
    if (errMsg) {
      setError(errMsg);
      return;
    }
    try{
      onSave({ title: form.title.trim(), description: form.description.trim() });
      setForm({ title: "", description: "" });
    }
    catch(err){
      setError(err.message);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        placeholder="Заголовок"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Описание"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
      />
      <br/>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Сохранить</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
        Отмена
      </button>
    </form>
  );
}

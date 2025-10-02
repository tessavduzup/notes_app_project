import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import UserProfile from "./components/UserProfile";
import { useUser } from "./hooks/useUser";
import { useNotes } from "./hooks/useNotes";

export default function App() {
  const {
    token,
    user: profile,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  } = useUser();

  const {
    notes,
    loading: notesLoading,
    createNote,
    updateNote,
    deleteNote 
  } = useNotes(token);

  const [editingNote, setEditingNote] = useState(null);
  const [showProfile, setShowProfile] = useState(false);


  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  const handleRegister = async (username, email, password) => {
    await register(username, email, password);
    alert("Регистрация успешна и вы вошли в аккаунт.");
    setShowProfile(false);
  };

  const handleLogout = () => {
    if (!window.confirm("Вы действительно хотите выйти из аккаунта?")) return;
    logout();
    setShowProfile(false);
    setEditingNote(null);
  };

  const handleSaveNote = async (note) => {
    if (editingNote) {
      await updateNote(editingNote.id, note);
      setEditingNote(null);

    } else {
      await createNote(note);

    }
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    if (editingNote && editingNote.id === id) {
      setEditingNote(null);
    }
  };

  const openProfile = () => {
    setShowProfile(true);
    setEditingNote(null);
  };
  const closeProfile = () => {
    setShowProfile(false);
  };

  const handleUpdateProfile = async (updatedProfile) => {
    const updated = await updateProfile(updatedProfile);
    alert("Профиль успешно обновлен");
    return updated;
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Вы действительно хотите удалить аккаунт? Это действие необратимо.")) return;
    await deleteAccount();
    setShowProfile(false);
  };

  return (
    <>
      {!token ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister}/>
      ) : showProfile ? (
        <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
          <button onClick={closeProfile}>Назад</button>
          <UserProfile
            profile={profile}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onDeleteAccount={handleDeleteAccount}
          />
          
        </div>
      ) : (
        <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
          <button onClick={openProfile}>Мой профиль</button>
          <h1>Ваши заметки</h1>
          {notesLoading && <p>Загрузка заметок...</p>}
          <NoteList notes={notes} onEdit={setEditingNote} onDelete={handleDeleteNote} />
          <h2>{editingNote ? "Редактировать заметку" : "Создать новую"}</h2>
          <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={() => setEditingNote(null)} />
          
        </div>
      )}
    </>
  );
}

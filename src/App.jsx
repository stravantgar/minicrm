import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAtIZUqpz1TOFMz54LMqypRGFHP83pNdnA",
  authDomain: "minicrm-77489.firebaseapp.com",
  projectId: "minicrm-77489",
  storageBucket: "minicrm-77489.firebasestorage.app",
  messagingSenderId: "827918895304",
  appId: "1:827918895304:web:eee9a48e2e022c8ae7fdfd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadCustomers();
    });
  }, []);

  const loadCustomers = async () => {
    const querySnapshot = await getDocs(collection(db, 'customers'));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCustomers(data);
  };

  const handleAdd = async () => {
    if (name === '') return;
    await addDoc(collection(db, 'customers'), { name, note });
    setName('');
    setNote('');
    loadCustomers();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'customers', id));
    loadCustomers();
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, 'demo@minicrm.com', 'password123');
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, 'demo@minicrm.com', 'password123');
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">MiniCRM Giriş</h1>
        <button onClick={handleLogin} className="btn">Giriş Yap</button>
        <button onClick={handleRegister} className="btn ml-2">Kayıt Ol</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MiniCRM - Müşteri Listesi</h1>
      <button onClick={handleLogout} className="btn mb-4">Çıkış Yap</button>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Müşteri Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mr-2"
        />
        <input
          type="text"
          placeholder="Not"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input mr-2"
        />
        <button onClick={handleAdd} className="btn">Ekle</button>
      </div>

      <ul>
        {customers.map((cust) => (
          <li key={cust.id} className="mb-2">
            <strong>{cust.name}</strong> – {cust.note}
            <button onClick={() => handleDelete(cust.id)} className="btn ml-2">Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

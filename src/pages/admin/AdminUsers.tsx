import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Trash2, UserCog, User, ShieldCheck, GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => handleFirestoreError(error, OperationType.LIST, 'users'));
    return () => unsubscribe();
  }, []);

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'users');
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, 'users');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-display font-bold dark:text-white">User Management</h1>
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Points</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold dark:text-white">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <select 
                    value={u.role || 'student'} 
                    onChange={e => handleChangeRole(u.id, e.target.value)}
                    className="bg-transparent border p-1 rounded text-sm dark:text-white border-gray-200 dark:border-zinc-700"
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {u.points || 0}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

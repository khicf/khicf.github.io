'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      console.log(data);
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await fetch(`/api/admin/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Approved By</th>
            <th className="px-4 py-2">Approved At</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.status}</td>
              <td className="border px-4 py-2">{user.approvedBy?.name}</td>
              <td className="border px-4 py-2">{user.approvedAt}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                {user.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateUser(user.id, { status: 'APPROVED' })}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateUser(user.id, { status: 'REJECTED' })}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}
                {session?.user?.role === 'ADMIN' && (
                  <>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
                      disabled={user.email === 'admin@example.com'}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2"
                      disabled={user.email === 'admin@example.com'}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

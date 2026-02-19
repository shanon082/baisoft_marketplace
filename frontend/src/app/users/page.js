"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Shield, UserPlus } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import TopHeader from "../components/TopHeader";

function getApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return fallback;
  const value = data[firstKey];
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return fallback;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
    business: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchBusinesses();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      const payload = res.data;
      setUsers(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load users"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await api.get("/businesses/");
      const payload = res.data;
      setBusinesses(Array.isArray(payload) ? payload : payload?.results || []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load businesses"));
      setBusinesses([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (user?.is_superuser) {
        payload.business = formData.business ? Number(formData.business) : null;
      }

      await api.post("/users/", payload);
      toast.success("User created");
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "viewer",
        business: "",
      });
      fetchUsers();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create user"));
    }
  };

  if (loading) return <div className="surface p-6">Loading users...</div>;

  return (
    <div className="space-y-6">
      <TopHeader
        title="User Management"
        subtitle="Create users, assign roles, and control access."
      />

      <div className="surface p-5 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">User Management</h1>
          <p className="text-sm text-slate-600 mt-1">Create and manage workspace users.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
          <Shield className="h-4 w-4" />
          {users.length} users
        </div>
      </div>

      <div className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-indigo-600" />
          Create User
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="approver">Approver</option>
            <option value="admin">Admin</option>
          </select>
          {user?.is_superuser && (
            <select
              name="business"
              value={formData.business}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 md:col-span-2"
              required
            >
              <option value="">Select business</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Username</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Email</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.username}</td>
                  <td className="px-4 py-3 text-slate-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

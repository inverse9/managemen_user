import { useEffect, useState } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/user"); // Adjust API URL
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("There was an error fetching the users:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (name && age) {
      const newUser = { nama: name, umur: parseInt(age) };

      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        await response.json();
        fetchUsers();
        setName("");
        setAge("");
      } catch (error) {
        console.error("There was an error adding the user:", error);
      }
    } else {
      alert("Please provide both name and age.");
    }
  };

  // Handle user edit
  const handleEditUser = (user) => {
    setEditUser(user);
    setName(user.nama);
    setAge(user.umur);
  };

  // Handle save after editing user
  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (name && age && editUser) {
      const updatedUser = { ...editUser, nama: name, umur: parseInt(age) };

      try {
        const response = await fetch(
          `http://localhost:3000/user/${editUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        await response.json();

        fetchUsers();
        setName("");
        setAge("");
        setEditUser(null);
      } catch (error) {
        console.error("There was an error updating the user:", error);
      }
    } else {
      alert("Please provide both name and age.");
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:3000/user/${userId}`, {
        method: "DELETE",
      });

      const filteredUsers = users.filter((user) => user.id !== userId);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("There was an error deleting the user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">User Management</h1>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.nama}</td>
                <td className="px-4 py-2">{user.umur}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form for Adding or Editing User */}
      <h2 className="text-2xl font-semibold mb-4">
        {editUser ? "Edit User" : "Add New User"}
      </h2>
      <form
        onSubmit={editUser ? handleSaveUser : handleAddUser}
        className="flex flex-col space-y-4 max-w-sm mx-auto"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Umur
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editUser ? "Save Changes" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default App;

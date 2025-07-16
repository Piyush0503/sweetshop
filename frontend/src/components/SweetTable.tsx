// 'use client';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Sweet {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   quantity: number;
// }

// const api = axios.create({
//   baseURL: 'http://localhost:5000/sweets',
// });

// export default function SweetTable() {
//   const [sweets, setSweets] = useState<Sweet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchSweets();
//   }, []);

//   const fetchSweets = async () => {
//     setLoading(true);
//     const res = search
//       ? await api.get(`/search?name=${search}`)
//       : await api.get('/');
//     setSweets(res.data);
//     setLoading(false);
//   };

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!form.name || !form.category || !form.price || !form.quantity) return;
//     await api.post('/', {
//       name: form.name,
//       category: form.category,
//       price: parseFloat(form.price),
//       quantity: parseInt(form.quantity),
//     });
//     setForm({ name: '', category: '', price: '', quantity: '' });
//     fetchSweets();
//   };

//   const handlePurchase = async (id: number) => {
//     await api.put(`/${id}/purchase`, { quantity: 1 });
//     fetchSweets();
//   };

//   const handleRestock = async (id: number) => {
//     await api.put(`/${id}/restock`, { quantity: 5 });
//     fetchSweets();
//   };

//   const handleDelete = async (id: number) => {
//     await api.delete(`/${id}`);
//     fetchSweets();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Add Sweet Form */}
//       <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
//         <input
//           className="border p-2 rounded"
//           name="name"
//           value={form.name}
//           placeholder="Name"
//           onChange={handleChange}
//         />
//         <input
//           className="border p-2 rounded"
//           name="category"
//           value={form.category}
//           placeholder="Category"
//           onChange={handleChange}
//         />
//         <input
//           className="border p-2 rounded"
//           name="price"
//           value={form.price}
//           placeholder="Price"
//           type="number"
//           onChange={handleChange}
//         />
//         <input
//           className="border p-2 rounded"
//           name="quantity"
//           value={form.quantity}
//           placeholder="Quantity"
//           type="number"
//           onChange={handleChange}
//         />
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Add Sweet
//         </button>
//       </form>

//       {/* Search Box */}
//       <div className="flex gap-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border p-2 w-1/3 rounded"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button
//           onClick={fetchSweets}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Search
//         </button>
//         <button
//           onClick={() => {
//             setSearch('');
//             fetchSweets();
//           }}
//           className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         >
//           Clear
//         </button>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading sweets...</p>
//       ) : (
//         <table className="w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Name</th>
//               <th className="p-2">Category</th>
//               <th className="p-2">Price</th>
//               <th className="p-2">Quantity</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sweets.map((sweet) => (
//               <tr key={sweet.id} className="border-t">
//                 <td className="p-2">{sweet.name}</td>
//                 <td className="p-2">{sweet.category}</td>
//                 <td className="p-2">₹{sweet.price}</td>
//                 <td className="p-2">{sweet.quantity}</td>
//                 <td className="p-2 space-x-2">
//                   <button
//                     onClick={() => handlePurchase(sweet.id)}
//                     className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                   >
//                     Buy
//                   </button>
//                   <button
//                     onClick={() => handleRestock(sweet.id)}
//                     className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
//                   >
//                     Restock
//                   </button>
//                   <button
//                     onClick={() => handleDelete(sweet.id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }



// src/components/SweetTable.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const api = axios.create({
  baseURL: 'http://localhost:5000/sweets',
});

export default function SweetTable() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
  const [search, setSearch] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', price: '', quantity: '' });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search.name) query.append('name', search.name);
      if (search.category) query.append('category', search.category);
      if (search.minPrice) query.append('minPrice', search.minPrice);
      if (search.maxPrice) query.append('maxPrice', search.maxPrice);

      const res = await api.get('/' + (query.toString() ? `search?${query.toString()}` : ''));
      setSweets(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: any) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/', {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });
      setForm({ name: '', category: '', price: '', quantity: '' });
      fetchSweets();
    } catch (e: any) {
      setError('Failed to add sweet');
    }
  };

  const handlePurchase = async (id: number) => {
    try {
      await api.put(`/${id}/purchase`, { quantity: 1 });
      fetchSweets();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Purchase failed');
    }
  };

  const handleRestock = async (id: number) => {
    await api.put(`/${id}/restock`, { quantity: 5 });
    fetchSweets();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/${id}`);
    fetchSweets();
  };

  const startEdit = (sweet: Sweet) => {
    setEditId(sweet.id);
    setEditForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    });
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: number) => {
    await api.put(`/${id}`, {
      name: editForm.name,
      category: editForm.category,
      price: parseFloat(editForm.price),
      quantity: parseInt(editForm.quantity),
    });
    setEditId(null);
    fetchSweets();
  };

  return (
    <div className="space-y-6">
      {/* Add Sweet Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
        <input className="border p-2 rounded" name="name" value={form.name} placeholder="Name" onChange={handleFormChange} />
        <input className="border p-2 rounded" name="category" value={form.category} placeholder="Category" onChange={handleFormChange} />
        <input className="border p-2 rounded" name="price" type="number" value={form.price} placeholder="Price" onChange={handleFormChange} />
        <input className="border p-2 rounded" name="quantity" type="number" value={form.quantity} placeholder="Quantity" onChange={handleFormChange} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Sweet</button>
      </form>

      {/* Search Box */}
      <div className="grid grid-cols-5 gap-4">
        <input className="border p-2 rounded" name="name" value={search.name} placeholder="Search name" onChange={handleSearchChange} />
        <input className="border p-2 rounded" name="category" value={search.category} placeholder="Category" onChange={handleSearchChange} />
        <input className="border p-2 rounded" name="minPrice" type="number" value={search.minPrice} placeholder="Min Price" onChange={handleSearchChange} />
        <input className="border p-2 rounded" name="maxPrice" type="number" value={search.maxPrice} placeholder="Max Price" onChange={handleSearchChange} />
        <button onClick={fetchSweets} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
      </div>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Sweet Table */}
      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.id} className="border-t">
                <td className="p-2">{sweet.id}</td>
                {editId === sweet.id ? (
                  <>
                    <td className="p-2"><input className="border p-1 rounded" name="name" value={editForm.name} onChange={handleEditChange} /></td>
                    <td className="p-2"><input className="border p-1 rounded" name="category" value={editForm.category} onChange={handleEditChange} /></td>
                    <td className="p-2"><input className="border p-1 rounded" name="price" type="number" value={editForm.price} onChange={handleEditChange} /></td>
                    <td className="p-2"><input className="border p-1 rounded" name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} /></td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => saveEdit(sweet.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{sweet.name}</td>
                    <td className="p-2">{sweet.category}</td>
                    <td className="p-2">₹{sweet.price}</td>
                    <td className="p-2">{sweet.quantity}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handlePurchase(sweet.id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Buy</button>
                      <button onClick={() => handleRestock(sweet.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Restock</button>
                      <button onClick={() => startEdit(sweet)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit</button>
                      <button onClick={() => handleDelete(sweet.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

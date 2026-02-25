import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const GetApiDemo = () => {
    const [users, setusers] = useState([])

    const getUsers = async () => {
        const response = await axios.get("https://node5.onrender.com/user/user/")
        console.log(response.data)
        setusers(response.data.data)
    }

    const deleteUser = async (id) => {
        //console.log("delete user called...", id)
        const response = await axios.delete(`https://node5.onrender.com/user/user/${id}`)
        console.log(response)
        if (response.status == 204) {
            toast.success("User deleted successfully")
            getUsers()
        }
    }

    useEffect(() => {
        getUsers()
    }, [])
    return (
        <div style={{ textAlign: "center" }} className='place-items-center'>
            <h1>GetApiDemo</h1>
            <table className='table-auto md:table-fixed border border-separate border-gray-300'>
                <thead>
                    <tr className='p-5'>
                        <th className='border border-gray-300 p-2'>ID</th>
                        <th className='border border-gray-300 p-2'>Name</th>
                        <th className='border border-gray-300 p-2'>Email</th>
                        <th className='border border-gray-300 p-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr>
                            <td className='border border-gray-300 p-2'>{user._id}</td>
                            <td className='border border-gray-300 p-2'>{user.name}</td>
                            <td className='border border-gray-300 p-2'>{user.email}</td>
                            <td className='border border-gray-300 p-2'>
                                <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={() => deleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

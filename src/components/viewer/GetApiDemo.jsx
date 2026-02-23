import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const GetApiDemo = () => {
    const [users, setusers] = useState([])

    const getUsers = async () => {
        const response = await axios.get("https://node5.onrender.com/user/user/")
        console.log(response.data)
        setusers(response.data.data)
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
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr>
                            <td className='border border-gray-300 p-2'>{user._id}</td>
                            <td className='border border-gray-300 p-2'>{user.name}</td>
                            <td className='border border-gray-300 p-2'>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

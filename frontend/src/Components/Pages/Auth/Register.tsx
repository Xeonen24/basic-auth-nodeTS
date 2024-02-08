import { useState, useRef } from 'react'
import { TextField, Button, Box, Snackbar } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import { CgSpinner } from 'react-icons/cg'
import { MdDone } from 'react-icons/md'
import { Alert } from '@mui/material'
import axios from 'axios'

function Register({ setHandleState }: { setHandleState: Function }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        address: '',
        phone: '',
        name: '',
    })

    const [profileImage, setProfileImage] = useState('' as any)
    const profileRef: any = useRef()
    const [state, setState] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProfileImage(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setState('loading')

        if (formData.email === '' || formData.password === '' || formData.password.length < 6 || formData.address === '' || formData.phone === '' || formData.name === '' || profileImage === '') {
            setState('error')
            return
        }

        try {
            const formDatas = new FormData()
            formDatas.append('name', formData.name)
            formDatas.append('email', formData.email)
            formDatas.append('password', formData.password)
            formDatas.append('address', formData.address)
            formDatas.append('phone', formData.phone)
            formDatas.append('profileImage', profileImage)

            const res = await axios.post(import.meta.env.VITE_API_URL + '/user/register', formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if (res.status === 201) {
                setState('success')
                setTimeout(() => {
                    setHandleState('login')
                }, 2000)
            }
        } catch (error) {
            console.log(error)
            setState('error')
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex items-center justify-between gap-20 border-gray-300 p-10 rounded-2xl'>
            <Snackbar open={state === 'error'} autoHideDuration={2000} onClose={() => setState('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error">{formData.email === '' || formData.password === '' || formData.address === '' || formData.phone === '' || formData.name === '' || profileImage === '' ? 'Please fill all the fields' : 'Something went wrong'}</Alert>
            </Snackbar>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} position={'relative'}>
                <img
                    src={profileImage ? URL.createObjectURL(profileImage) : '/default.png'}
                    className='w-52 h-52 p-2 rounded-full object-cover border-2 border-gray-500 border-dashed mb-10'
                />
                {profileImage &&
                    <div className='absolute top-0 right-0 duration-300 hover:scale-105 text-white p-1 px-2.5 bg-red-500 rounded-full cursor-pointer' onClick={() => setProfileImage('')}>
                        X
                    </div>
                }
                <input
                    id="profileImage"
                    type="file"
                    ref={profileRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                />
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => profileRef.current.click()}
                >
                    Upload Profile Image
                </Button>
            </Box>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                <p className='text-center text-2xl uppercase'>Signup</p>
                <TextField
                    label="Name"
                    variant="outlined"
                    size='small'
                    sx={{ mb: 1, mt: 5, p: 0 }}
                    value={formData.name}
                    helperText=' '
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextField
                    label="Address"
                    variant="outlined"
                    size='small'
                    sx={{ mb: 1, p: 0 }}
                    value={formData.address}
                    helperText=' '
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <MuiTelInput
                    defaultCountry={'IN'}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e })}
                    size='small'
                    label='Phone'
                    sx={{ mb: 1, width: '100%' }}
                    error={formData.phone !== '' && formData.phone.length < 15}
                    helperText={formData.phone !== '' && formData.phone.length < 15 ? 'Please enter a valid phone number' : ' '}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    size='small'
                    sx={{ mb: 1, p: 0 }}
                    value={formData.email}
                    error={formData.email !== '' && !formData.email.includes('@')}
                    helperText={formData.email !== '' && !formData.email.includes('@') ? 'Please enter a valid email' : ' '}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    size='small'
                    error={formData.password !== '' && formData.password.length < 6}
                    helperText={formData.password !== '' && formData.password.length < 6 ? 'Password must be at least 6 characters' : ' '}
                    sx={{ mb: 2, p: 0 }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button type="submit" variant="contained" color="info">
                    {state === 'loading' ? <CgSpinner className='animate-spin' size={25} /> : state === 'success' ? <MdDone size={24} /> : 'Signup'}
                </Button>
                <Button variant="text" color='primary' fullWidth sx={{marginTop:'1rem'}} onClick={() => setHandleState('login')}>Login existing</Button>
            </Box>
        </form>
    )
}

export default Register
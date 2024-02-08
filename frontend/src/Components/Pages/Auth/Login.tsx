import { TextField, Button, Box, Snackbar, Checkbox, Typography, FormGroup, FormControlLabel } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { CgSpinner } from 'react-icons/cg'
import { MdDone } from 'react-icons/md'
import { Alert } from '@mui/material'

function Login({ setHandleState }: { setHandleState: Function }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [state, setState] = useState('')
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.email === '' || formData.password === '') {
            setState('error');
            return;
        }

        try {
            setState('loading');
            const res = await axios.post(import.meta.env.VITE_API_URL + '/user/login', formData);
            if (res.status === 200) {
                setState('success');
                setTimeout(() => {
                    const expiration = rememberMe
                        ? new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
                        : new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3);

                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('tokenExpiration', expiration.getTime().toString());
                    // window.location.href = '/'  -----------------> redirect to any page after login
                }, 2000);
            }
        } catch (error) {
            setState('error');
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-between border-gray-300 border p-10 rounded-2xl'>
            <Snackbar open={state === 'error'} autoHideDuration={2000} onClose={() => setState('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error">{formData.email !== '' && formData.password !== '' ? 'Invalid email or password' : 'Please enter email and password'}</Alert>
            </Snackbar>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' position='relative' width={'100%'}>
                <p className='text-center text-2xl uppercase'>Login</p>
                <TextField
                    label="Email"
                    variant="outlined"
                    size='small'
                    sx={{ mb: 1, mt: 5, p: 0 }}
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
                    helperText={formData.password !== '' && formData.password.length < 6 ? 'Enter more than 6 characters' : ' '}
                    sx={{ mb: 2, p: 0 }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <FormGroup sx={{ mb: 2 }}>
                    <FormControlLabel control={<Checkbox />} label={<Typography variant='button'>Remember me</Typography>} onChange={() => setRememberMe(!rememberMe)} />
                </FormGroup>
            </Box>
            <Button type="submit" variant="contained" color='primary' fullWidth disabled={state === 'loading' || state === 'success'}>
                {state === 'loading' ? <CgSpinner className='animate-spin' size={25} /> : state === 'success' ? <MdDone size={24} /> : 'Login'}
            </Button>
            <Button variant="text" color='primary' fullWidth sx={{ marginTop: '1rem' }} onClick={() => setHandleState('register')}>Create account</Button>
        </form>
    )
}

export default Login
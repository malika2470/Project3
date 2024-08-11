'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase'; // Ensure this path is correct
import { useRouter } from 'next/navigation';

import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box,
    FormControl,
    Divider,
    Card,
    Alert
} from '@mui/material';

import { styled } from '@mui/system';

// Styled components for better UI
const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'white' // Card background color
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
        backgroundColor: '#333', // Darker shade on hover
    },
}));

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/sign-in");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(email, password);
            console.log('User signed up:', userCredential.user);
            sessionStorage.setItem('user', JSON.stringify(userCredential.user));
            setEmail('');
            setPassword('');
            router.push('/');
        } catch (e) {
            setError('Failed to sign up. Please check your details and try again.');
            console.error('Sign-up error:', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: 'black',
                margin: 0,
                padding: 0,
                width: '100vw',
                overflowX: 'hidden'
            }}
        >
            <StyledCard>
                <Typography variant="h5" gutterBottom>
                    Sign Up
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="form" noValidate onSubmit={handleSignUp}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                    {error && (
                        <Alert severity="error" sx={{ my: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <StyledButton
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </StyledButton>
                </Box>
                <Typography sx={{ paddingTop: "35px" }}>Already have an account?</Typography>

                <Button
                    fullWidth
                    variant='text'
                    type="button" // Prevent form submission
                    disabled={loading}
                    onClick={handleSignIn}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
            </StyledCard>
        </Container>
    );
};

export default SignUp;

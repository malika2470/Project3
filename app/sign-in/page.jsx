
'use client';
import { useState, useCallback } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
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
    textAlign: 'center'
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    backgroundColor: '#1e1e1e', // Button background color
    color: 'white', // Button text color
    '&:hover': {
        backgroundColor: '#333', // Darker shade on hover
    },
}));

export const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    // Setting up router 
    const router = useRouter();

    const handleSignUp = () => {
        router.push("/sign-up");
    };

    const handleSignIn = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(email, password);
            sessionStorage.setItem('user', JSON.stringify(userCredential.user));
            sessionStorage.setItem('user', true)
            setEmail('');
            setPassword('');
            router.push('/');
        } catch (e) {
            setError('Failed to sign in. Please check your details and try again.');
            console.error('Sign-in error:', e.message);
        } finally {
            setLoading(false);
        }
    }, [email, password, signInWithEmailAndPassword, router]);

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
                    Sign In
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box component="form" noValidate onSubmit={handleSignIn}>
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
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </StyledButton>
                </Box>
                <Typography sx={{ paddingTop: "35px" }}>Don't have an account?</Typography>
                <Button
                    fullWidth
                    variant='text'
                    type="button" // Prevent form submission
                    disabled={loading}
                    onClick={handleSignUp}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
            </StyledCard>
        </Container>
    );
};

export default SignIn;
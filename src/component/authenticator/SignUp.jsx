import { Card, Label, TextInput, Button, Alert,Spinner } from 'flowbite-react'
import { useRef, useState, useEffect } from 'react';
import { createUserWithFirebase } from '../../FIrebase';
import { Link, useNavigate } from 'react-router-dom'
import { userAuth } from '../../context/AuthContext'

function SignUp() {
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = userAuth().error;
  

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.current.value !== confirmPassword.current.value) {
      return setError('Do not match passwords')
    }
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    const result = await createUserWithFirebase(emailValue, passwordValue, setError);

    if (result) {
      navigate('/userInterface/root');
    }
    
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 400);
  }, [])


  return (
    
    <div className='flex items-center justify-center h-screen'>
      {loading ? <Spinner  color="success" aria-label="Success spinner example" size="xl"/> :
      <Card className='sm:w-[500px]'>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h2 className='text-center text-green-700 text-4xl font-semibold mb-5'>Sign Up</h2>
          {error && 
            <Alert 
              color="failure"
            >
              <span className='font-semibold'>{error}</span>
            </Alert>}
          <h3 className='text-green-700 font-semibold'><Link to={'/'}>Sign In?</Link></h3>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Your email"
              />
            </div>
            <TextInput
              id="email1"
              type="email"
              placeholder="name@gmail.com"
              required={true}
              ref={email}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="Write a password"
              />
            </div>
            <TextInput
              id="password1"
              type="password"
              required={true}
              ref={password}
            />
          </div>
          <div className='mb-4'>
          <div className="mb-2 block">
            <Label
              htmlFor="password2"
              value="Repeat your password"
            />
          </div>
          <TextInput
            id="password2"
            type="password"
            required={true}
            ref={confirmPassword}
          />
        </div>
        <Button type="submit" color='success'>
          Submit
        </Button>
      </form>
    </Card>}
    </div>
  )
}

export default SignUp

import { Card, Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react';
import { signInUserWithFirebase } from '../../FIrebase';
import { Link, useNavigate } from 'react-router-dom'
import { userAuth } from '../../context/AuthContext'

function SignIn() {
  const email = useRef();
  const password = useRef();
  const {handleSignInUser, user} = userAuth();
  const [error, setError] = userAuth().error;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    signInUserWithFirebase(emailValue, passwordValue, setError);
  }

  useEffect(() => {
    if (user) return navigate('/userinterface')
  }, [user])


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
          <h2 className='text-green-700 text-center text-4xl font-semibold mb-5'>Sign In</h2>
          {error && 
            <Alert 
              color="failure"
            >
              <span className='font-semibold'>{error}</span>
            </Alert>
          }
          <h3 className='text-green-700 font-semibold'><Link to={'/signup'}>Sign Up?</Link></h3>
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
                value="Password"
              />
            </div>
            <TextInput
              id="password1"
              type="password"
              required={true}
              ref={password}
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

export default SignIn

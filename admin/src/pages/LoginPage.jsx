import { SignIn } from '@clerk/clerk-react'

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  )
}

export default LoginPage

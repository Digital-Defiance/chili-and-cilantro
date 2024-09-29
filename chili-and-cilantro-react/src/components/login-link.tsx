import './login-link.scss';

function LoginLink() {
  const loginWithRedirect = () => {
    // Implement the logic to initiate the OAuth login flow
  };
  return (
    <button onClick={() => loginWithRedirect()} className="login-link">
      Log In
    </button>
  );
}

export default LoginLink;

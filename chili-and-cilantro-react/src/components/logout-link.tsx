import './logout-link.scss';

function LogoutLink() {
  const logout = () => {
    // Add your own logout logic here
  };
  return (
    <button onClick={() => logout()} className="logout-link">
      Log Out
    </button>
  );
}

export default LogoutLink;

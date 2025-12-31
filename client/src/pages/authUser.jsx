import { Navigate } from 'react-router-dom';

const AuthUser = ({ children }) => {
  const token = localStorage.getItem('coparents_token'); // or from Redux / Context
console.log(token)
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthUser;

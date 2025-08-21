import { useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please enter your details to sign in</p>
        </div>
        
        <LoginForm redirectPath={from} />
      </div>
    </div>
  );
};

export default LoginPage;

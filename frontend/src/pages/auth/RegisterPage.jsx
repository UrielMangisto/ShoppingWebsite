import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Please fill in your details to register</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

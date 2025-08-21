import ResetPasswordForm from '../../components/auth/ResetPasswordForm/ResetPasswordForm';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

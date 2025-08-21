import ResetPasswordForm from '../../../components/auth/ResetPasswordForm/ResetPasswordForm';
import { useSearchParams } from 'react-router-dom';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="reset-password-page">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
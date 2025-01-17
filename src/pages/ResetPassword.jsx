import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
  
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const response = await resetPassword(token, newPassword, confirmPassword);
      setSuccess(response.message);
      console.log('Respuesta:', response);
  
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Restablecer Contraseña</h2>
      {success ? (
        <p className="text-success">{success}</p>
      ) : (
        <>
          {error && <p className="text-danger">{error}</p>}
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="form-control mb-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSubmit}>Restablecer Contraseña</button>
        </>
      )}
    </div>
  );
}


export default ResetPassword;


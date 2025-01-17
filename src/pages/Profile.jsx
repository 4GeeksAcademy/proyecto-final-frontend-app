import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import UserContext from '../context/UserContext';
import '../styles/Profile.css';
import Footer from '../components/layout/Footer';
import logo from '/logo-solo.png';

function Profile() {
  const { user, logout } = useContext(UserContext); // Consumir el contexto
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nombre: '',
    apellidos: '',
    nombre_usuario: '',
    email: '',
    foto_url: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    nombre: '',
    apellidos: '',
    nombre_usuario: '',
    email: '',
    foto_url: ''
  });

  // Cargar datos de usuario desde el contexto o localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    try {
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setTempData(parsedData);
      } else if (user) {
        setUserData(user);
        setTempData(user);
      }
    } catch (error) {
      console.error('Error al parsear los datos de usuario:', error);
      localStorage.removeItem('userData');
    }
  }, [user]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setUserData(tempData);
    localStorage.setItem('userData', JSON.stringify(tempData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'foto_url' && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setTempData({ ...tempData, foto_url: event.target.result });
      };
      fileReader.readAsDataURL(files[0]);
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };

  //  Cerrar Sesión
  const handleLogout = () => {
    localStorage.removeItem('userData'); // Eliminar datos de localStorage
    localStorage.removeItem('token'); // Eliminar token
    logout(); // Limpiar el estado global en el contexto
    navigate('/'); // Redirigir al inicio
  };

  if (!userData.nombre && !userData.email) {
    return <p className="text-center">Cargando perfil...</p>;
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="d-flex flex-grow-1">
        <Sidebar onSidebarClick={() => { }} />
        <div className="w-100 content">
          <div className="my-5">
            {/* Botón de Cerrar Sesión */}
            <div className="text-end mb-3">
              <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>

            <div className="profile-header text-center">
              {/* Imagen del Usuario */}
              <img
                src={userData.foto_url || logo }
                alt="Perfil"
                className="profile-img mb-3"
              />
              {isEditing && (
                <input
                  type="file"
                  name="foto_url"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handleChange}
                />
              )}

              {/* Nombre */}
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  className="form-control mb-2"
                  value={tempData.nombre}
                  onChange={handleChange}
                />
              ) : (
                <h2>{userData.nombre}</h2>
              )}

              {/* Apellidos */}
              {isEditing ? (
                <input
                  type="text"
                  name="apellidos"
                  className="form-control mb-2"
                  value={tempData.apellidos}
                  onChange={handleChange}
                />
              ) : (
                <h4>{userData.apellidos}</h4>
              )}

              {/* Nombre de Usuario */}
              {isEditing ? (
                <input
                  type="text"
                  name="nombre_usuario"
                  className="form-control mb-2"
                  value={tempData.nombre_usuario}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-muted">@{userData.nombre_usuario}</p>
              )}

              {/* Correo */}
              <p className="text-muted">{userData.email}</p>
            </div>

            {/* Acciones */}
            <div className="profile-actions text-center">
              {isEditing ? (
                <button className="btn btn-success me-2" onClick={handleSave}>
                  Guardar
                </button>
              ) : (
                <button className="btn btn-outline-primary me-2" onClick={handleEdit}>
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Footer />
      </div>
    </div>
  );
}

export default Profile;












export const initialStore = () => {
  return {
    message: null,
    auth: sessionStorage.getItem("token") ? true : false,

    // Crear la logica de auth en el store para que este disponible en varios componentes
    // Utilizar dispatch en el componente form para cambiar de auth de false a true
    // En el navbar mostrar el boton de logout solo si esta logeado utilizando la misma variable
    // Mostrar solo los formularios si se está logueado utilizando lo mismo en un ternario
    // Si no se esta logeado redireccionar con <Navigate />
  };
};

export default function storeReducer(state = initialStore(), action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...state,
        message: action.payload,
      };

    case "login_success":
      return { ...state, auth: true };

    case "logout":
      return { ...state, auth: false };

    default:
      throw Error("Unknown action.");
  }
}

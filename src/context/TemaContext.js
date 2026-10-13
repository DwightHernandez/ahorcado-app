import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cargarConfiguracion } from '../storage/almacenamiento';
import { colores } from '../theme/colores';

const TemaContext = createContext({
  tema: colores.claro,
  modoOscuro: false,
  setModoOscuro: () => {},
  sonidoActivo: false,
  setSonidoActivo: () => {},
});

export function TemaProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(false);

  useEffect(() => {
    let activo = true;
    cargarConfiguracion().then((config) => {
      if (activo) {
        setModoOscuro(config.tema === 'oscuro');
        setSonidoActivo(config.sonido === true);
      }
    });
    return () => { activo = false; };
  }, []);

  const value = useMemo(() => ({
    tema: modoOscuro ? colores.oscuro : colores.claro,
    modoOscuro,
    setModoOscuro,
    sonidoActivo,
    setSonidoActivo,
  }), [modoOscuro, sonidoActivo]);

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}

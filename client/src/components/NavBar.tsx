import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../redux/auth/actions';
import { RootState } from '../redux/store'
import { useMutation } from '@apollo/client';
import { SIGNOUT_GRAPH } from '../query/user';

export default function Navbar() {
  const [singOut] = useMutation(SIGNOUT_GRAPH)
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const logout = async () => {
    const { data } = await singOut({ variables: { message: "закончить сессию" } })
    if (data.signOut.message === 'Вы успeшно вышли из системы') {
      dispatch(logOutUser())
    }
  };
  return (
    <nav className="nav-item">
      <Link className="navWords" to="/">Home</Link>
      {isAuth && <Link className="navWords" to="/basket">BasketPage</Link>}
      {!isAuth && <Link className="navWords" to="/auth">Login</Link>}
      {isAuth && <Link className="navWords" to="/login" onClick={logout}>logOut</Link>}
    </nav>
  );
}

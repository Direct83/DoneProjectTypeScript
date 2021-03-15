import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'
import ItemList from './ItemList';

export default function HomePage() {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <h1>HomePage</h1>
      {!isAuth
        ? <div>Контент доступен только авторизованным пользователям</div>
        : (
          <>
            <ItemList />
          </>
        )}
    </>
  );
}

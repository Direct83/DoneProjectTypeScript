import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signInUser, message } from '../redux/auth/actions';
import { RootState } from '../redux/store'
import { useMutation } from '@apollo/client';
import { SIGNIN_GRAPH } from '../query/user';

interface AuthDataType {
  name: string,
  password: string,
}
export default function SignIn() {
  const [signIn] = useMutation(SIGNIN_GRAPH);
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [authData, setAuthData] = useState<AuthDataType>({
    name: '',
    password: '',
  });
  const inputHundler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAuthData((previousAuthData) => ({
      ...previousAuthData,
      [name]: value,
    }));
  };
  const loginHandler = async () => {
    const { data } = await signIn({ variables: authData })
    if (data.signIn === null) {
      return dispatch(message('Нет такого пользователя'))
    }
    dispatch(signInUser(data.signIn.userId, data.signIn.userName))
  };
  return (
    <>
      {isAuth && <Redirect to="/" />}
      { !isAuth
        && (
          <div className="login">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputName1" className="form-label">
                  name
                  <input type="text" onChange={inputHundler} name="name" className="form-control" id="exampleInputName1" />
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  password
                  <input type="password" onChange={inputHundler} name="password" className="form-control" id="exampleInputPassword1" />
                </label>
              </div>
              <button type="button" className="btn btn-primary" onClick={loginHandler}>Submit</button>
            </form>
          </div>
        )}
    </>
  );
};


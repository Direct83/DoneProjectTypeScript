import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signInUser } from '../redux/auth/actions';
import { RootState } from '../redux/store'
import { useMutation } from '@apollo/client';
import { SIGNUP_GRAPH } from '../query/user';

interface AuthDataType {
  name: string,
  password: string,
  email: string,
}
export default function SignUp() {
  const [signUp] = useMutation(SIGNUP_GRAPH);
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [authData, setAuthData] = useState<AuthDataType>({
    name: '',
    email: '',
    password: '',
  });
  const [errMessage, setErrMessage] = useState('')
  const inputHundler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAuthData((previousAuthData) => ({
      ...previousAuthData,
      [name]: value,
    }));
  };
  const signUpHandler = async () => {
    const { data } = await signUp({ variables: authData })
    if (data.signUp.message !== "пользователь уже существует в базе"
      && data.signUp.message !== 'пользователь c таким email уже существует') {
      dispatch(signInUser(data.signUp.userId, data.signUp.userName))
    } else {
      setErrMessage(data.signUp.message)
    }
  };
  return (
    <>
      {isAuth && <Redirect to="/" />}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {errMessage ? <h1 style={{ color: 'red' }}>{errMessage}</h1> : null}
      </div>
      { !isAuth && (
        <div className="registration">
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputName1" className="form-label">
                loginName
                <input type="text" onChange={inputHundler} name="name" className="form-control" id="exampleInputName1" />
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                email
                <input type="email" onChange={inputHundler} name="email" className="form-control" id="exampleInputEmail1" />
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                password
                <input type="password" onChange={inputHundler} name="password" className="form-control" id="exampleInputPassword1" />
              </label>
            </div>
            <button type="button" className="btn btn-primary" onClick={signUpHandler}>Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

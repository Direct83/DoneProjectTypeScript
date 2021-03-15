import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'
import { useMutation } from '@apollo/client';
import { GET_BASKET_GRAPH, DEL_ITEM_GRAPH } from '../query/user';

export default function BasketPage() {
  const [getBasket] = useMutation(GET_BASKET_GRAPH);
  const [delItem] = useMutation(DEL_ITEM_GRAPH);
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { userId } = useSelector((state: RootState) => state.auth)
  const [basketState, setBasketState] = useState([])
  const [total, setTotal] = useState(0)
  console.log('basketState', basketState)
  useEffect(() => {
    (async () => {
      if (userId) {
        const { data: { getBasket: { basket } } }: any = await getBasket({ variables: { userId } })
        console.log('basket', basket);
        setBasketState(basket)
        if (basket.length > 0) {
          setTotal(basket?.map((el: any) => +el.objProduct.price)?.reduce((a: any, b: any) => a + b))
        }
      }
    })()
  }, [isAuth, basketState.length])
  const delProd = async (basketId: string) => {
    await delItem({ variables: { basketId } })
    setBasketState(basketState.filter((el: any) => el.basketId !== basketId))
  }
  return (
    <>
      <h1>BasketPage</h1>
      {isAuth ?
        (
          <>
            <h2>Общая сумма заказа: {total}</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ol>
                {basketState.map((el: any) => {
                  return (
                    <li key={el.basketId} style={{ marginBottom: '20px' }}>
                      <div>Название: {el.objProduct.name}</div>
                      <div>Цена: {el.objProduct.price}</div>
                      <button type="button" onClick={() => delProd(el.basketId)}>Удалить</button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </>
        ) : <div>Контент доступен только авторизованным пользователям</div>
      }
    </>
  );
}

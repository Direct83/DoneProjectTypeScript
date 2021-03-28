import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_ITEMS_GRAPH, ADD_ITEM_GRAPH } from '../query/user';
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux';
import './ItemList.scss'

interface ItemsType {
  id: number,
  name: string,
  price: number,
  img: string,
}

export default function ItemList() {
  const { userId } = useSelector((state: RootState) => state.auth)
  const [getItems] = useMutation(GET_ITEMS_GRAPH);
  const [addItem] = useMutation(ADD_ITEM_GRAPH);
  const [itemsState, setItemsState] = useState<ItemsType[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6 })
  const [itemsLength, setItemsLength] = useState<number>()
  useEffect(() => {
    (async () => {
      const { data: { getItems: { items, itemsLength } } } = await getItems({ variables: pagination })
      const allPages: number = Math.floor(itemsLength / pagination.limit)
      setItemsLength(allPages)
      setItemsState(items)
    })()
  }, [pagination.page])
  const pages = [...Array(itemsLength)].map((e, i) => i + 1)
  const clickHandler = async ({ target }: any) => {
    switch (target.innerText) {
      case '«':
        if (pagination.page !== 1) {
          setPagination((prevState) => ({ ...prevState, page: (prevState.page - 1) }))
        }
        break
      case '»':
        if (pagination.page !== itemsLength) {
          setPagination((prevState) => ({ ...prevState, page: (prevState.page + 1) }))
        }
        break
      default:
        setPagination((prevState) => ({ ...prevState, page: +target.innerText }))
    }
  }
  const addProd = async (idProd: number) => {
    await addItem({ variables: { idProd, userId } })
  }
  return (
    <>
      <h1>ItemList</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '900px', display: 'flex', flexDirection: 'row', flexWrap: "wrap" }}>
          {itemsState.map((e: ItemsType) => {
            return (
              <div key={e.id + 'b'} style={{
                marginLeft: '50px', width: '200px', marginBottom: '20px'
              }}>
                <img src={e.img} style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
                <div>Название: {e.name}</div>
                <div>Цена: {e.price}</div>
                <button onClick={() => addProd(e.id)}>Добавить в корзину</button>
              </div>
            )
          }
          )}
        </div>
      </div>
      <div className="pagination" onClick={clickHandler}>
        <a>«</a>
        {pages.map((e) => {
          const classActive = pagination.page === e ? 'active' : ''
          return (
            <div key={e + 'a'}>
              <a className={classActive}>{e}</a>
            </div>
          )
        })}
        <a>»</a>
      </div>
    </>
  );
}

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
  const clickHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.target as HTMLElement
    const text: string = input.innerText
    switch (text) {
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
        setPagination((prevState) => ({ ...prevState, page: +text }))
    }
  }
  const addProd = async (idProd: number) => {
    await addItem({ variables: { idProd, userId } })
  }
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>ItemList</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='allItem'>
          {itemsState.map((e: ItemsType) => {
            return (
              <div key={e.id + 'b'} className='itemFront'>
                <img src={e.img} />
                <div>Название: {e.name}</div>
                <div>Цена: {e.price}</div>
                <button onClick={() => addProd(e.id)} style={{ borderRadius: '5px', padding: '5px' }}>Добавить в корзину</button>
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

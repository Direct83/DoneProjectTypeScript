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
          {itemsState.map((el: ItemsType) => {
            return (
              <div key={el.id + 'b'} className='itemFront'>
                <img src={el.img} />
                <div>Название: {el.name}</div>
                <div>Цена: {el.price}</div>
                <button onClick={() => addProd(el.id)}>Добавить в корзину</button>
              </div>
            )
          }
          )}
        </div>
      </div>
      <div className="pagination" onClick={clickHandler}>
        <a>«</a>
        {pages.map((el) => {
          const classActive = pagination.page === el ? 'active' : ''
          return (
            <div key={el + 'a'}>
              <a className={classActive}>{el}</a>
            </div>
          )
        })}
        <a>»</a>
      </div>
    </>
  );
}

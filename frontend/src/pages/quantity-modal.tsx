import type { ListItemFrontend, QuantityUnit } from '../../../shared/types/shopping.ts'
import '../styles/modal.scss'
import { useEffect, useState } from 'react'
import { setQuantity as setQuantityApi } from '../api/shopping.ts'

interface EditItemsModalProps {
  item: ListItemFrontend | undefined,
  modalOpen: boolean
  closeModal: Function
}

const quantityLabels: { [K in QuantityUnit]: string } = {
  PCS: 'Stück',
  G: 'Gramm',
  ML: 'Milliliter'
}

const QuantityModal = ({ modalOpen, item, closeModal }: EditItemsModalProps) => {
  const handleModalClose = () => {
    closeModal()
  }

  const [ quantity, setQuantity ] = useState<number>(item?.quantity ?? 1)
  const [ quantityUnit, setQuantityUnit ] = useState<QuantityUnit>(item?.quantityUnit ?? 'PCS')

  useEffect(() => {
    setQuantity(item?.quantity ?? 1)
    setQuantityUnit(item?.quantityUnit ?? 'PCS')
  }, [ item ])


  useEffect(() => {
    console.log(quantityUnit)
  }, [ quantityUnit ])

  const handleOk = async () => {
    if (!item) return
    await setQuantityApi(item.id, quantity, quantityUnit)
    handleModalClose()
  }

  return (
    <div>
      <div id="modal-overlay" className={ `modal-overlay ${ modalOpen ? 'visible' : '' }` }
           onClick={ (e) => {
             if ((e.target as any).id === 'modal-overlay') handleModalClose()
           } }>
        <div className="modal">
          <span className="close-btn" onClick={ handleModalClose }>&times;</span>
          <h2>Menge hinzufügen für<br/>{ item?.name }</h2>
          <div className="quantity-wrapper">
            <input type="text" value={ quantity } onChange={ (e) => setQuantity(Number(e.target.value)) }/>
            <div className="unit-selectors">{ Object.keys(quantityLabels).map((key, index) => (<div key={ index }>
              <input name="unit-select"
                     checked={ quantityUnit === key }
                     onChange={ e => {
                       e.target.checked ? setQuantityUnit(key as QuantityUnit) : void (0)
                     } }
                     id={ `id-${ key }` }
                     type="radio"/> <label htmlFor={ `id-${ key }` }>{ quantityLabels[key as QuantityUnit] }</label>
            </div>)) }</div>
          </div>
          <button className="my-button" onClick={ handleOk }>OK</button>
        </div>
      </div>
    </div>
  )
}

export default QuantityModal
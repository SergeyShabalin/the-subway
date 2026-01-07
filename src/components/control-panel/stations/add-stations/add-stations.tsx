import { Modal } from '@components/ui'
import { StationsAddForm } from '@components/forms/stations-add-form/stations-add-form.tsx'
import { useState } from 'react'
import { useMetro } from '@store/hooks/use-metro.ts'

const AddStations = () => {
  const {  actions: metroActions } = useMetro()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModalHandler = () => {
    setIsModalOpen(true)
  }

  const addStationSubmit =(station)=>{
    console.log('sss',station)
    metroActions.addNewStation(station)
    setIsModalOpen(false)
  }

  return (
    <>
        <button
          onClick={toggleModalHandler}
          style={{
            marginBottom: '12px',
            width: '100%',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Добавить станцию
        </button>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <StationsAddForm onSubmit={addStationSubmit} />
      </Modal>
    </>
  )
}

export { AddStations }
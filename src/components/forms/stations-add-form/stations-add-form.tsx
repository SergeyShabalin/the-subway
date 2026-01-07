import React, { useState } from 'react'
import { useMetro } from '@store/hooks/use-metro.ts'
import { Dropdown, Form } from '@components/ui'

interface StationFormData {
  name: string
  branchId: string
}

interface StationsAddFormProps {
  onSubmit: (data: {
    name: string
    branchId: number
    x: number
    y: number
    color: string
    labelOffset: { x: number; y: number }
  }) => void
}

const StationsAddForm: React.FC<StationsAddFormProps> = ({ onSubmit }) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const { metroNetwork, actions: metroActions } = useMetro()

  const stationFields: FormField[] = [
    {
      name: 'branchId',
      label: 'Ветка метро',
      type: 'select',
      required: false,
      placeholder: 'Выберите ветку',
    },
    {
      name: 'name',
      label: 'Наименование станции',
      type: 'text',
      required: false,
      placeholder: 'Наименование станции',
    },
  ]

  const handleStationSubmit = (data: Record<string, string>) => {
    const formData: StationFormData = data as unknown as StationFormData

    if (!formData.branchId) {
      return
    }
    const selectedLine = metroNetwork.find(
      (line) => line.id === parseInt(formData.branchId),
    )
    const lineColor = selectedLine.color
    let x = 555 // значение по умолчанию
    let y = 555

    if (selectedLine.stations.length > 0) {
      const lastStation =
        selectedLine.stations[selectedLine.stations.length - 1]
      x = lastStation.x + 50
      y = lastStation.y
    }

    const stationData = {
      name: formData.name,
      branchId: parseInt(formData.branchId),
      x: x,
      y: y,
      color: lineColor,
      labelOffset: {
        x: 0,
        y: -60,
      },
    }

    onSubmit(stationData)
  }

  // Кастомный рендер для выбора ветки
  const renderBranchSelect = (
    value: string,
    onChange: (value: string) => void,
  ) => {
    return (
      <Dropdown
        options={metroNetwork.map((line) => ({
          value: line.id,
          label: `${line.name} ${line.renderStyle === 'circular' ? '(кольцевая)' : ''}`,
          color: line.color,
        }))}
        value={selectedBranch}
        onChange={(selectedValue) => {
          const stringValue = selectedValue.toString()
          const id = selectedValue === '' ? null : Number(selectedValue)

          setSelectedBranch(id)
          metroActions.setActiveLineId(id)
          onChange(stringValue) // Обновляем значение в форме
        }}
        placeholder="Выберите линию..."
        showColor={true}
      />
    )
  }

  return (
    <Form
      fields={stationFields.map((field) =>
        field.name === 'branchId'
          ? { ...field, customRender: renderBranchSelect }
          : field,
      )}
      onSubmit={handleStationSubmit}
      title="Добавление новой станции"
      submitText="Добавить станцию"
    />
  )
}

export { StationsAddForm }
